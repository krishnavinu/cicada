const Resume = require('../../models/resume.model');
const User = require('../../models/user.model');
const Job = require('../../models/job.model');
const groq = require('../../config/Groq');
const puppeteer = require('puppeteer');
const cloudinary = require('../../config/Cloudinary');
const fs = require('fs');
const path = require('path');

// Get user's resume
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    res.json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ msg: 'Error fetching resume', error: error.message });
  }
};

// Save/Update resume
const saveResume = async (req, res) => {
  try {
    const { templateId, sections, styling } = req.body;
    
    let resume = await Resume.findOne({ userId: req.user._id });
    
    if (resume) {
      resume.templateId = templateId || resume.templateId;
      resume.sections = sections || resume.sections;
      resume.styling = styling || resume.styling;
      resume.updatedAt = new Date();
      await resume.save();
    } else {
      resume = new Resume({
        userId: req.user._id,
        templateId: templateId || 'template-1',
        sections: sections || {},
        styling: styling || {}
      });
      await resume.save();
    }
    
    res.json({ msg: 'Resume saved successfully', resume });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ msg: 'Error saving resume', error: error.message });
  }
};

// Get AI suggestions
const getAISuggestions = async (req, res) => {
  try {
    const { resumeData, jobId } = req.body;
    
    if (!jobId) {
      return res.status(400).json({ msg: 'Job ID is required' });
    }
    
    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    
    const prompt = `You are a resume optimization expert. Analyze this resume and job description.

RESUME DATA:
${JSON.stringify(resumeData?.sections || {}, null, 2)}

JOB DETAILS:
- Title: ${job.jobTitle}
- Description: ${job.jobDescription?.substring(0, 1000) || 'N/A'}
- Eligibility: ${job.eligibility?.substring(0, 500) || 'N/A'}
- Company: ${job.company?.companyName || 'Unknown'}

Provide your analysis in JSON format:
{
  "matchPercentage": 85,
  "matchedSkills": ["JavaScript", "React"],
  "missingSkills": ["TypeScript", "Docker"],
  "suggestedSkills": ["Add TypeScript", "Add Docker experience"],
  "suggestedAchievements": [
    "Quantify your project impact",
    "Add specific metrics"
  ],
  "improvements": [
    "Add more technical keywords",
    "Highlight relevant projects"
  ],
  "atsOptimization": [
    "Use standard section headings",
    "Include keywords from job description"
  ]
}

Return only valid JSON, no other text.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional resume optimization expert. Always return valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });
    
    const suggestions = JSON.parse(completion.choices[0].message.content);
    
    // Update job match score
    const resume = await Resume.findOne({ userId: req.user._id });
    if (resume) {
      const matchIndex = resume.jobMatchScores.findIndex(
        m => m.jobId.toString() === jobId
      );
      
      const matchData = {
        jobId,
        matchPercentage: suggestions.matchPercentage || 0,
        matchedSkills: suggestions.matchedSkills || [],
        missingSkills: suggestions.missingSkills || []
      };
      
      if (matchIndex >= 0) {
        resume.jobMatchScores[matchIndex] = matchData;
      } else {
        resume.jobMatchScores.push(matchData);
      }
      resume.updatedAt = new Date();
      await resume.save();
    }
    
    res.json({ 
      suggestions, 
      matchScore: suggestions.matchPercentage || 0
    });
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    res.status(500).json({ 
      msg: 'Error getting suggestions', 
      error: error.message 
    });
  }
};

// Get skill suggestions
const getSkillSuggestions = async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    
    const prompt = `Based on this job description, suggest relevant skills for a resume.

Job Title: ${jobTitle}
Job Description: ${jobDescription?.substring(0, 1000) || 'N/A'}

Return JSON:
{
  "technicalSkills": ["Skill1", "Skill2"],
  "softSkills": ["Skill1", "Skill2"],
  "tools": ["Tool1", "Tool2"],
  "certifications": ["Cert1", "Cert2"]
}

Return only valid JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a career advisor. Suggest relevant skills. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });
    
    const suggestions = JSON.parse(completion.choices[0].message.content);
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Error getting skill suggestions:', error);
    res.status(500).json({ 
      msg: 'Error getting skill suggestions', 
      error: error.message 
    });
  }
};

// AI Resume Scoring
const scoreResume = async (req, res) => {
  try {
    const { resumeData } = req.body;
    
    const prompt = `Evaluate this resume and provide a comprehensive score out of 100.

RESUME DATA:
${JSON.stringify(resumeData?.sections || {}, null, 2)}

Evaluate based on:
1. Content completeness (20 points)
2. Keyword optimization (20 points)
3. Formatting and structure (20 points)
4. Achievements and impact (20 points)
5. ATS compatibility (20 points) - Check for standard headings, simple formatting, no images/tables, clear structure

Return JSON:
{
  "overallScore": 85,
  "breakdown": {
    "contentCompleteness": 18,
    "keywordOptimization": 17,
    "formatting": 19,
    "achievements": 16,
    "atsCompatibility": 15
  },
  "feedback": [
    "Strengths: Good technical skills",
    "Improvements: Add more quantifiable achievements"
  ]
}

Return only valid JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a resume evaluator. Score resumes objectively. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    
    const scoreData = JSON.parse(completion.choices[0].message.content);
    
    // Update resume score
    const resume = await Resume.findOne({ userId: req.user._id });
    if (resume) {
      resume.aiScore = scoreData.overallScore || 0;
      resume.updatedAt = new Date();
      await resume.save();
    }
    
    res.json({ score: scoreData });
  } catch (error) {
    console.error('Error scoring resume:', error);
    res.status(500).json({ 
      msg: 'Error scoring resume', 
      error: error.message 
    });
  }
};

// Generate PDF
const exportPDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    
    // Generate HTML for resume
    const html = generateResumeHTML(resume);
    
    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    await browser.close();
    
    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ msg: 'Error generating PDF', error: error.message });
  }
};

// Submit resume to job
const submitToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const resume = await Resume.findOne({ userId: req.user._id });
    
    if (!resume) {
      return res.status(400).json({ msg: 'Please create a resume first' });
    }
    
    // Generate PDF
    const html = generateResumeHTML(resume);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true 
    });
    await browser.close();
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'CPMS/Resume', 
          resource_type: 'raw',
          format: 'pdf',
          public_id: `resume_${req.user._id}_${Date.now()}`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(pdfBuffer);
    });
    
    // Update user's resume URL
    const user = await User.findById(req.user._id);
    if (user) {
      user.studentProfile.resume = uploadResult.secure_url;
      await user.save();
    }
    
    // Apply to job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    
    // Check if already applied
    const alreadyApplied = user.studentProfile?.appliedJobs?.some(
      aj => aj.jobId?.toString() === jobId
    );
    
    if (alreadyApplied) {
      return res.status(400).json({ msg: 'Already applied to this job' });
    }
    
    // Add to user's applied jobs
    if (!user.studentProfile.appliedJobs) {
      user.studentProfile.appliedJobs = [];
    }
    user.studentProfile.appliedJobs.push({
      jobId: jobId,
      status: 'applied',
      appliedAt: new Date()
    });
    await user.save();
    
    // Add to job's applicants
    if (!job.applicants) {
      job.applicants = [];
    }
    job.applicants.push({
      studentId: req.user._id,
      status: 'applied',
      appliedAt: new Date()
    });
    await job.save();
    
    res.json({ 
      msg: 'Resume submitted and application successful',
      resumeUrl: uploadResult.secure_url
    });
  } catch (error) {
    console.error('Error submitting resume:', error);
    res.status(500).json({ msg: 'Error submitting resume', error: error.message });
  }
};

// Helper function to generate resume HTML
function generateResumeHTML(resume) {
  const sections = resume.sections || {};
  const styling = resume.styling || {};
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: ${styling.fontFamily || 'Arial'}, sans-serif;
            font-size: ${styling.fontSize || '12px'};
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            border-bottom: 2px solid ${styling.colorScheme === 'blue' ? '#2563eb' : '#000'};
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: ${styling.colorScheme === 'blue' ? '#2563eb' : '#000'};
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .item {
            margin-bottom: 10px;
          }
          .item-title {
            font-weight: bold;
          }
          ul {
            margin: 5px 0;
            padding-left: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${sections.personalInfo?.fullName || 'Resume'}</h1>
          <p>${sections.personalInfo?.email || ''} | ${sections.personalInfo?.phone || ''}</p>
          ${sections.personalInfo?.address ? `<p>${sections.personalInfo.address}</p>` : ''}
        </div>
        
        ${sections.summary ? `
          <div class="section">
            <div class="section-title">Summary</div>
            <p>${sections.summary}</p>
          </div>
        ` : ''}
        
        ${sections.education && sections.education.length > 0 ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${sections.education.map(edu => `
              <div class="item">
                <div class="item-title">${edu.degree || ''} - ${edu.institution || ''}</div>
                <p>${edu.year || ''} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${sections.experience && sections.experience.length > 0 ? `
          <div class="section">
            <div class="section-title">Experience</div>
            ${sections.experience.map(exp => `
              <div class="item">
                <div class="item-title">${exp.title || ''} at ${exp.company || ''}</div>
                <p>${exp.duration || ''}</p>
                <p>${exp.description || ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${sections.skills && sections.skills.length > 0 ? `
          <div class="section">
            <div class="section-title">Skills</div>
            ${sections.skills.map(skill => `
              <div class="item">
                <strong>${skill.category || ''}:</strong> ${skill.items?.join(', ') || ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${sections.projects && sections.projects.length > 0 ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${sections.projects.map(proj => `
              <div class="item">
                <div class="item-title">${proj.name || ''}</div>
                <p>${proj.description || ''}</p>
                <p>Technologies: ${proj.technologies?.join(', ') || ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </body>
    </html>
  `;
}

module.exports = {
  getResume,
  saveResume,
  getAISuggestions,
  getSkillSuggestions,
  scoreResume,
  exportPDF,
  submitToJob
};

