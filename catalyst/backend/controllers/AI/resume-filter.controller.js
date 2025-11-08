const mongoose = require('mongoose');
const groq = require('../../config/Groq');
const User = require('../../models/user.model');
const Job = require('../../models/job.model');

// Helper function to calculate CGPA
const calculateCGPA = (sgpa) => {
  if (!sgpa) return 0;
  const semesters = Object.values(sgpa).filter(v => v && v > 0);
  if (semesters.length === 0) return 0;
  return (semesters.reduce((a, b) => a + b, 0) / semesters.length).toFixed(2);
};

// Helper function to extract skills from user profile
const extractSkills = (user) => {
  const skills = [];
  // Extract from resume if available, or from profile
  if (user.studentProfile?.resume) {
    // Skills would be extracted from resume parsing
    skills.push('Technical Skills'); // Placeholder
  }
  return skills;
};

const filterResumes = async (req, res) => {
  try {
    const { jobId, filters } = req.body;
    
    if (!jobId) {
      return res.status(400).json({ msg: 'Job ID is required' });
    }
    
    // Convert jobId to ObjectId for proper querying
    let jobObjectId;
    try {
      if (mongoose.Types.ObjectId.isValid(jobId)) {
        jobObjectId = new mongoose.Types.ObjectId(jobId);
      } else {
        return res.status(400).json({ msg: 'Invalid Job ID format' });
      }
    } catch (error) {
      return res.status(400).json({ msg: 'Invalid Job ID format' });
    }
    
    // Get job requirements
    const job = await Job.findById(jobObjectId).populate('company');
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    
    // Get applicants - try both methods for reliability
    let applicants = [];
    
    // Method 1: Get from Job.applicants array (more reliable)
    if (job.applicants && job.applicants.length > 0) {
      const applicantIds = job.applicants.map(app => app.studentId).filter(id => id);
      applicants = await User.find({
        _id: { $in: applicantIds },
        role: 'student'
      });
    }
    
    // Method 2: Fallback - Get from User.appliedJobs
    if (applicants.length === 0) {
      applicants = await User.find({
        'studentProfile.appliedJobs.jobId': jobObjectId,
        role: 'student'
      });
    }
    
    if (applicants.length === 0) {
      return res.json({
        totalApplicants: 0,
        filteredResults: [],
        shortlisted: 0,
        maybe: 0,
        rejected: 0,
        msg: 'No applicants found for this job'
      });
    }
    
    // Filter using AI
    const filterResults = [];
    
    for (const applicant of applicants) {
      const applicantData = {
        name: `${applicant.first_name || ''} ${applicant.last_name || ''}`.trim() || 'Unknown',
        department: applicant.studentProfile?.department || 'Unknown',
        year: applicant.studentProfile?.year || 0,
        cgpa: calculateCGPA(applicant.studentProfile?.SGPA),
        backlogs: applicant.studentProfile?.liveKT || 0,
        hasResume: !!applicant.studentProfile?.resume,
        internships: applicant.studentProfile?.internships?.length || 0,
        attendance: applicant.studentProfile?.attendance?.overallPercentage || 0
      };
      
      const prompt = `Evaluate if this candidate matches the job requirements:
      
      Candidate Profile:
      - Name: ${applicantData.name}
      - Department: ${applicantData.department}
      - Year: ${applicantData.year}
      - CGPA: ${applicantData.cgpa}
      - Backlogs: ${applicantData.backlogs}
      - Has Resume: ${applicantData.hasResume}
      - Internships: ${applicantData.internships}
      - Attendance: ${applicantData.attendance}%
      
      Job Requirements:
      - Title: ${job.jobTitle}
      - Description: ${job.jobDescription?.substring(0, 500) || 'N/A'}
      - Eligibility: ${job.eligibility?.substring(0, 500) || 'N/A'}
      - Company: ${job.company?.companyName || 'N/A'}
      
      Return JSON:
      {
        "matchScore": 85,
        "matches": ["Has required skills", "Good CGPA"],
        "gaps": ["Missing certification"],
        "recommendation": "shortlist",
        "reason": "Brief reason for recommendation"
      }
      
      Recommendation should be: "shortlist", "maybe", or "reject"
      Match score should be 0-100.
      
      Return only valid JSON, no other text.`;
      
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: "You are a resume screening expert. Evaluate candidates objectively based on job requirements. Always return valid JSON." 
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.5,
          max_tokens: 500,
          response_format: { type: "json_object" }
        });
        
        const aiResponse = completion.choices[0].message.content;
        let evaluation;
        
        try {
          // Try to parse JSON directly
          evaluation = JSON.parse(aiResponse);
        } catch (parseError) {
          // If direct parse fails, try to extract JSON from markdown or other formatting
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            evaluation = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Failed to parse AI response as JSON');
          }
        }
        
        // Validate evaluation object
        if (!evaluation.matchScore && evaluation.matchScore !== 0) {
          evaluation.matchScore = 50;
        }
        if (!evaluation.recommendation) {
          evaluation.recommendation = 'maybe';
        }
        if (!evaluation.reason) {
          evaluation.reason = 'No reason provided';
        }
        
        filterResults.push({
          applicantId: applicant._id,
          applicantName: applicantData.name,
          email: applicant.email,
          department: applicantData.department,
          year: applicantData.year,
          cgpa: applicantData.cgpa,
          matchScore: Math.max(0, Math.min(100, evaluation.matchScore || 0)),
          recommendation: ['shortlist', 'maybe', 'reject'].includes(evaluation.recommendation?.toLowerCase()) 
            ? evaluation.recommendation.toLowerCase() 
            : 'maybe',
          reason: evaluation.reason || 'No reason provided',
          matches: Array.isArray(evaluation.matches) ? evaluation.matches : [],
          gaps: Array.isArray(evaluation.gaps) ? evaluation.gaps : [],
          resume: applicant.studentProfile?.resume || null
        });
      } catch (aiError) {
        console.error(`AI evaluation error for applicant ${applicant._id}:`, aiError.message);
        // Fallback if AI fails
        filterResults.push({
          applicantId: applicant._id,
          applicantName: applicantData.name,
          email: applicant.email,
          department: applicantData.department,
          year: applicantData.year,
          cgpa: applicantData.cgpa,
          matchScore: 50,
          recommendation: 'maybe',
          reason: 'AI evaluation failed, manual review required',
          matches: [],
          gaps: [],
          resume: applicant.studentProfile?.resume || null
        });
      }
    }
    
    // Sort by match score (highest first)
    filterResults.sort((a, b) => b.matchScore - a.matchScore);
    
    res.json({ 
      totalApplicants: applicants.length,
      filteredResults: filterResults,
      shortlisted: filterResults.filter(r => r.recommendation === 'shortlist').length,
      maybe: filterResults.filter(r => r.recommendation === 'maybe').length,
      rejected: filterResults.filter(r => r.recommendation === 'reject').length
    });
  } catch (error) {
    console.error('Error filtering resumes:', error);
    res.status(500).json({ 
      msg: 'Error filtering resumes', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = { filterResumes };

