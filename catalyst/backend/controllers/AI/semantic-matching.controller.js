const groq = require('../../config/Groq');
const Job = require('../../models/job.model');
const Resume = require('../../models/resume.model');
const User = require('../../models/user.model');

// Generate embedding using Groq (we'll use text similarity via LLM since Groq doesn't have embeddings API)
// For production, you'd use OpenAI embeddings or a dedicated embedding service
const generateEmbedding = async (text) => {
  try {
    // Since Groq doesn't have embeddings, we'll use semantic analysis
    // In production, replace this with actual embedding generation
    const prompt = `Analyze this text and extract key semantic concepts, skills, and requirements. Return a JSON object with normalized keywords and concepts:

Text: ${text.substring(0, 2000)}

Return JSON:
{
  "keywords": ["keyword1", "keyword2", ...],
  "concepts": ["concept1", "concept2", ...],
  "skills": ["skill1", "skill2", ...],
  "requirements": ["req1", "req2", ...]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a semantic text analyzer. Extract key concepts, skills, and requirements from text. Always return valid JSON." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    return {
      keywords: analysis.keywords || [],
      concepts: analysis.concepts || [],
      skills: analysis.skills || [],
      requirements: analysis.requirements || [],
      text: text
    };
  } catch (error) {
    console.error('Error generating embedding:', error);
    return { keywords: [], concepts: [], skills: [], requirements: [], text: text };
  }
};

// Calculate semantic similarity between two embeddings
const calculateSimilarity = (embedding1, embedding2) => {
  // Combine all vectors
  const allKeywords = [...new Set([...embedding1.keywords, ...embedding2.keywords])];
  const allConcepts = [...new Set([...embedding1.concepts, ...embedding2.concepts])];
  const allSkills = [...new Set([...embedding1.skills, ...embedding2.skills])];

  // Calculate Jaccard similarity for each dimension
  const keywordSimilarity = calculateJaccard(embedding1.keywords, embedding2.keywords);
  const conceptSimilarity = calculateJaccard(embedding1.concepts, embedding2.concepts);
  const skillSimilarity = calculateJaccard(embedding1.skills, embedding2.skills);

  // Weighted combination (skills are most important)
  const similarity = (keywordSimilarity * 0.2) + (conceptSimilarity * 0.3) + (skillSimilarity * 0.5);
  
  return {
    overallSimilarity: Math.round(similarity * 100),
    keywordSimilarity: Math.round(keywordSimilarity * 100),
    conceptSimilarity: Math.round(conceptSimilarity * 100),
    skillSimilarity: Math.round(skillSimilarity * 100),
    matchedKeywords: embedding1.keywords.filter(k => embedding2.keywords.includes(k)),
    matchedConcepts: embedding1.concepts.filter(c => embedding2.concepts.includes(c)),
    matchedSkills: embedding1.skills.filter(s => embedding2.skills.includes(s)),
    missingKeywords: embedding2.keywords.filter(k => !embedding1.keywords.includes(k)),
    missingConcepts: embedding2.concepts.filter(c => !embedding1.concepts.includes(c)),
    missingSkills: embedding2.skills.filter(s => !embedding1.skills.includes(s))
  };
};

// Calculate Jaccard similarity
function calculateJaccard(set1, set2) {
  if (set1.length === 0 && set2.length === 0) return 1;
  if (set1.length === 0 || set2.length === 0) return 0;
  
  const intersection = set1.filter(item => set2.includes(item)).length;
  const union = new Set([...set1, ...set2]).size;
  
  return intersection / union;
}

// Match jobs to candidate semantically
const matchJobsToCandidate = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const resume = await Resume.findOne({ userId });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found. Please create a resume first.' });
    }

    // Get all active jobs
    const jobs = await Job.find({
      applicationDeadline: { $gte: new Date() }
    }).populate('company');

    // Generate resume embedding
    const resumeText = JSON.stringify(resume.sections);
    const resumeEmbedding = await generateEmbedding(resumeText);

    // Match each job
    const matches = [];
    for (const job of jobs) {
      const jobText = `${job.jobTitle} ${job.jobDescription} ${job.eligibility || ''}`;
      const jobEmbedding = await generateEmbedding(jobText);
      const similarity = calculateSimilarity(resumeEmbedding, jobEmbedding);

      matches.push({
        jobId: job._id,
        jobTitle: job.jobTitle,
        company: job.company?.companyName || 'Unknown',
        salary: job.salary,
        matchScore: similarity.overallSimilarity,
        similarityBreakdown: {
          keyword: similarity.keywordSimilarity,
          concept: similarity.conceptSimilarity,
          skill: similarity.skillSimilarity
        },
        matchedSkills: similarity.matchedSkills,
        matchedConcepts: similarity.matchedConcepts,
        missingSkills: similarity.missingSkills.slice(0, 5), // Top 5 missing
        missingConcepts: similarity.missingConcepts.slice(0, 5)
      });
    }

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      matches: matches.slice(0, 20), // Top 20 matches
      resumeEmbedding: {
        skills: resumeEmbedding.skills,
        keywords: resumeEmbedding.keywords.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error matching jobs:', error);
    res.status(500).json({ msg: 'Error matching jobs', error: error.message });
  }
};

// Match candidates to a job (for TPO)
const matchCandidatesToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate('company');

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Generate job embedding
    const jobText = `${job.jobTitle} ${job.jobDescription} ${job.eligibility || ''}`;
    const jobEmbedding = await generateEmbedding(jobText);

    // Get all students with resumes
    const resumes = await Resume.find().populate('userId');
    const matches = [];

    for (const resume of resumes) {
      if (!resume.userId || resume.userId.role !== 'student') continue;

      const resumeText = JSON.stringify(resume.sections);
      const resumeEmbedding = await generateEmbedding(resumeText);
      const similarity = calculateSimilarity(resumeEmbedding, jobEmbedding);

      matches.push({
        studentId: resume.userId._id,
        studentName: `${resume.userId.first_name || ''} ${resume.userId.last_name || ''}`.trim(),
        email: resume.userId.email,
        department: resume.userId.studentProfile?.department,
        matchScore: similarity.overallSimilarity,
        similarityBreakdown: {
          keyword: similarity.keywordSimilarity,
          concept: similarity.conceptSimilarity,
          skill: similarity.skillSimilarity
        },
        matchedSkills: similarity.matchedSkills,
        missingSkills: similarity.missingSkills.slice(0, 5)
      });
    }

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      job: {
        _id: job._id,
        jobTitle: job.jobTitle,
        company: job.company?.companyName
      },
      matches: matches.slice(0, 50), // Top 50 matches
      jobEmbedding: {
        skills: jobEmbedding.skills,
        keywords: jobEmbedding.keywords.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error matching candidates:', error);
    res.status(500).json({ msg: 'Error matching candidates', error: error.message });
  }
};

// Get semantic match for a specific job
const getJobMatch = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const job = await Job.findById(jobId).populate('company');
    const resume = await Resume.findOne({ userId });

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    // Generate embeddings
    const jobText = `${job.jobTitle} ${job.jobDescription} ${job.eligibility || ''}`;
    const resumeText = JSON.stringify(resume.sections);

    const jobEmbedding = await generateEmbedding(jobText);
    const resumeEmbedding = await generateEmbedding(resumeText);
    const similarity = calculateSimilarity(resumeEmbedding, jobEmbedding);

    // Highlight matching phrases (simple keyword highlighting)
    const highlightedJobDesc = highlightMatches(job.jobDescription, similarity.matchedSkills, similarity.matchedConcepts);

    res.json({
      job: {
        _id: job._id,
        jobTitle: job.jobTitle,
        company: job.company?.companyName
      },
      matchScore: similarity.overallSimilarity,
      similarityBreakdown: {
        keyword: similarity.keywordSimilarity,
        concept: similarity.conceptSimilarity,
        skill: similarity.skillSimilarity
      },
      matchedSkills: similarity.matchedSkills,
      matchedConcepts: similarity.matchedConcepts,
      missingSkills: similarity.missingSkills,
      missingConcepts: similarity.missingConcepts,
      highlightedDescription: highlightedJobDesc
    });
  } catch (error) {
    console.error('Error getting job match:', error);
    res.status(500).json({ msg: 'Error getting job match', error: error.message });
  }
};

// Helper function to highlight matching phrases
function highlightMatches(text, matchedSkills, matchedConcepts) {
  let highlighted = text;
  const allMatches = [...matchedSkills, ...matchedConcepts];
  
  allMatches.forEach(match => {
    const regex = new RegExp(`\\b${match}\\b`, 'gi');
    highlighted = highlighted.replace(regex, `<mark class="bg-yellow-200">${match}</mark>`);
  });
  
  return highlighted;
}

module.exports = {
  matchJobsToCandidate,
  matchCandidatesToJob,
  getJobMatch
};

