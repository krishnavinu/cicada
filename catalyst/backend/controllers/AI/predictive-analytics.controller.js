const groq = require('../../config/Groq');
const User = require('../../models/user.model');
const Job = require('../../models/job.model');
const Resume = require('../../models/resume.model');
const InterviewSession = require('../../models/interviewSession.model');
const PlacementPrediction = require('../../models/placementPrediction.model');

// Helper function to calculate average SGPA
function calculateAverageSGPA(sgpa) {
  if (!sgpa) return 7.0;
  const values = Object.values(sgpa).filter(v => v != null && v > 0);
  return values.length > 0 
    ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
    : 7.0;
}

// Helper function to extract skills from job description
function extractSkillsFromJob(description) {
  if (!description) return [];
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'MongoDB',
    'C++', 'C#', 'Angular', 'Vue.js', 'Express', 'Django', 'Flask',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'Linux', 'HTML', 'CSS',
    'TypeScript', 'Spring Boot', 'PostgreSQL', 'MySQL', 'Redis'
  ];
  const lowerDesc = description.toLowerCase();
  return commonSkills.filter(skill => 
    lowerDesc.includes(skill.toLowerCase())
  );
}

// Helper function to calculate skills match percentage
function calculateSkillsMatch(jobSkills, resumeSkills) {
  if (jobSkills.length === 0) return 100;
  if (resumeSkills.length === 0) return 0;
  
  const matched = jobSkills.filter(js => 
    resumeSkills.some(rs => 
      rs.toLowerCase().includes(js.toLowerCase()) || 
      js.toLowerCase().includes(rs.toLowerCase())
    )
  );
  return Math.round((matched.length / jobSkills.length) * 100);
}

// Predict placement probability
const predictPlacement = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user._id;

    if (!jobId || jobId === 'undefined') {
      return res.status(400).json({ msg: 'Job ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    const resume = await Resume.findOne({ userId });
    const recentInterviews = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate factors
    const avgSGPA = calculateAverageSGPA(user.studentProfile?.SGPA);
    const resumeScore = resume?.aiScore || 0;
    const interviewAvg = recentInterviews.length > 0
      ? Math.round(recentInterviews
          .filter(s => s.overallScore != null)
          .reduce((sum, s) => sum + (s.overallScore || 0), 0) / 
          recentInterviews.filter(s => s.overallScore != null).length)
      : 70; // Default if no interviews

    // Skills match calculation
    const jobSkills = extractSkillsFromJob(job.jobDescription);
    const resumeSkills = resume?.sections?.skills?.flatMap(s => s.items || []) || [];
    const skillsMatch = calculateSkillsMatch(jobSkills, resumeSkills);

    // Experience level
    const experienceCount = resume?.sections?.experience?.length || 0;
    const projectCount = resume?.sections?.projects?.length || 0;
    const experienceLevel = Math.min((experienceCount * 20) + (projectCount * 10), 100);

    // Academic score (0-100)
    const academicScore = Math.min(avgSGPA * 10, 100);

    // AI-powered prediction
    const predictionPrompt = `Predict placement probability for this student:

Student Profile:
- Department: ${user.studentProfile?.department || 'Engineering'}
- Average SGPA: ${avgSGPA}/10
- Resume Score: ${resumeScore}/100
- Interview Performance (avg): ${interviewAvg}/100
- Skills Match: ${skillsMatch}%
- Experience: ${experienceCount} positions
- Projects: ${projectCount}
- Internships: ${user.studentProfile?.internships?.length || 0}
- Live KTs: ${user.studentProfile?.liveKT || 0}
- Gap Year: ${user.studentProfile?.gap ? 'Yes' : 'No'}

Job Requirements:
- Title: ${job.jobTitle}
- Company: ${job.company?.companyName || 'Company'}
- Salary: ${job.salary || 'Not specified'} LPA
- Description: ${job.jobDescription?.substring(0, 500) || 'N/A'}

Based on this comprehensive data, predict:
1. Placement probability (0-100%) - likelihood of getting selected
2. Predicted package range (in LPA) - realistic salary expectation
3. Confidence level (0-100%) - how confident is this prediction
4. Key factors affecting probability (top 3)
5. Top 5 actionable recommendations to improve chances

Return JSON format:
{
  "probability": 75,
  "predictedPackage": 8.5,
  "confidence": 85,
  "keyFactors": ["Factor 1", "Factor 2", "Factor 3"],
  "recommendations": ["Rec 1", "Rec 2", "Rec 3", "Rec 4", "Rec 5"]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are an expert placement analyst with years of experience. Predict placement success based on comprehensive data analysis. Be realistic and data-driven. Always return valid JSON." 
        },
        { 
          role: "user", 
          content: predictionPrompt 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const predictionData = JSON.parse(completion.choices[0].message.content);

    // Save or update prediction
    const predictionDoc = await PlacementPrediction.findOneAndUpdate(
      { userId, jobId },
      {
        placementProbability: predictionData.probability || 0,
        factors: {
          academicScore: Math.round(academicScore),
          interviewPerformance: interviewAvg,
          resumeScore: Math.round(resumeScore),
          skillsMatch: skillsMatch,
          experienceLevel: Math.round(experienceLevel)
        },
        recommendations: predictionData.recommendations || [],
        predictedPackage: predictionData.predictedPackage || job.salary || 0,
        confidenceLevel: predictionData.confidence || 75,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ 
      prediction: predictionDoc,
      analysis: {
        keyFactors: predictionData.keyFactors || [],
        overallAssessment: `Based on your profile, you have a ${predictionData.probability || 0}% chance of getting placed in this position.`
      }
    });
  } catch (error) {
    console.error('Error predicting placement:', error);
    res.status(500).json({ msg: 'Error predicting placement', error: error.message });
  }
};

// Get prediction for a job
const getPrediction = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const prediction = await PlacementPrediction.findOne({ userId, jobId })
      .populate('jobId', 'jobTitle')
      .populate('userId', 'first_name');

    if (!prediction) {
      return res.status(404).json({ msg: 'Prediction not found. Generate one first.' });
    }

    res.json({ prediction });
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({ msg: 'Error fetching prediction', error: error.message });
  }
};

// Get all predictions for user
const getUserPredictions = async (req, res) => {
  try {
    const userId = req.user._id;

    const predictions = await PlacementPrediction.find({ userId })
      .populate('jobId', 'jobTitle company')
      .sort({ lastUpdated: -1 })
      .limit(20);

    res.json({ predictions });
  } catch (error) {
    console.error('Error fetching user predictions:', error);
    res.status(500).json({ msg: 'Error fetching predictions', error: error.message });
  }
};

module.exports = {
  predictPlacement,
  getPrediction,
  getUserPredictions
};

