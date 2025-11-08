const CareerDNA = require('../../models/careerDNA.model');
const User = require('../../models/user.model');
const Resume = require('../../models/resume.model');
const InterviewSession = require('../../models/interviewSession.model');
const groq = require('../../config/Groq');

// Analyze and generate Career DNA profile
const analyzeCareerDNA = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const resume = await Resume.findOne({ userId });
    const interviewSessions = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    if (!user || user.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Collect data for analysis
    const analysisData = {
      resume: resume?.sections || {},
      interviewResponses: interviewSessions
        .filter(s => s.status === 'completed' && s.questions)
        .map(s => ({
          questions: s.questions.map(q => ({
            question: q.question,
            answer: q.userAnswer || '',
            feedback: q.aiFeedback || {}
          })),
          roundType: s.roundType,
          overallScore: s.overallScore
        })),
      studentProfile: {
        department: user.studentProfile?.department,
        year: user.studentProfile?.year,
        internships: user.studentProfile?.internships || [],
        appliedJobs: user.studentProfile?.appliedJobs || []
      }
    };

    // Prepare text for AI analysis
    const resumeText = JSON.stringify(resume?.sections || {});
    const interviewText = analysisData.interviewResponses
      .map(s => s.questions.map(q => `Q: ${q.question}\nA: ${q.userAnswer}`).join('\n\n'))
      .join('\n\n---\n\n');

    const prompt = `Analyze this student's profile and generate a comprehensive Career DNA analysis.

RESUME DATA:
${resumeText.substring(0, 2000)}

INTERVIEW RESPONSES:
${interviewText.substring(0, 3000)}

STUDENT PROFILE:
- Department: ${user.studentProfile?.department || 'Engineering'}
- Year: ${user.studentProfile?.year || 'Unknown'}
- Internships: ${user.studentProfile?.internships?.length || 0}
- Applied Jobs: ${user.studentProfile?.appliedJobs?.length || 0}

Based on this data, analyze and return a JSON object with:
1. Personality traits (Big 5 - scores 0-100):
   - openness (innovation, creativity)
   - conscientiousness (organization, reliability)
   - extraversion (social, collaborative)
   - agreeableness (team player, cooperative)
   - neuroticism (stress handling - lower is better)

2. Work Style Preferences:
   - preferredEnvironment: "startup" | "mid-size" | "enterprise" | "flexible"
   - collaborationPreference: "highly-collaborative" | "moderate" | "independent" | "flexible"
   - pacePreference: "fast-paced" | "moderate" | "steady" | "flexible"
   - workLocationPreference: "remote" | "hybrid" | "office" | "flexible"

3. Values and Priorities (0-100):
   - workLifeBalance
   - innovation
   - stability
   - growthOpportunity
   - compensation
   - companyCulture

4. Communication Style: "direct" | "diplomatic" | "analytical" | "empathetic" | "balanced"

5. Career Trajectory Predictions (top 3):
   - Array of { path: string, probability: number }

6. Key Insights (5-7 insights):
   - Array of { category: string, insight: string, confidence: number }

Return ONLY valid JSON, no other text.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert career psychologist and talent analyst. Analyze student profiles to generate comprehensive Career DNA. Always return valid JSON format only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    let dnaData;
    try {
      dnaData = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // Fallback to default values if parsing fails
      dnaData = getDefaultCareerDNA();
    }

    // Save or update Career DNA
    const careerDNA = await CareerDNA.findOneAndUpdate(
      { userId },
      {
        personality: dnaData.personality || {},
        workStyle: dnaData.workStyle || {},
        values: dnaData.values || {},
        communicationStyle: dnaData.communicationStyle || 'balanced',
        careerTrajectory: {
          predictedPaths: dnaData.careerTrajectory?.predictedPaths || [],
          preferredPath: dnaData.careerTrajectory?.preferredPath || ''
        },
        insights: dnaData.insights || [],
        analysisSource: {
          interviewSessions: interviewSessions.map(s => s._id),
          resumeAnalysis: true,
          lastAnalyzed: new Date()
        },
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      careerDNA,
      summary: {
        dominantTraits: getDominantTraits(dnaData.personality),
        workStyleSummary: dnaData.workStyle,
        topValues: getTopValues(dnaData.values),
        preferredCareerPath: dnaData.careerTrajectory?.preferredPath
      }
    });
  } catch (error) {
    console.error('Error analyzing Career DNA:', error);
    res.status(500).json({ msg: 'Error analyzing Career DNA', error: error.message });
  }
};

// Get Career DNA profile
const getCareerDNA = async (req, res) => {
  try {
    const userId = req.user._id;
    const careerDNA = await CareerDNA.findOne({ userId });

    if (!careerDNA) {
      return res.status(404).json({ msg: 'Career DNA not found. Please generate it first.' });
    }

    res.json({ careerDNA });
  } catch (error) {
    console.error('Error fetching Career DNA:', error);
    res.status(500).json({ msg: 'Error fetching Career DNA', error: error.message });
  }
};

// Match Career DNA with job/company culture
const matchCulture = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const careerDNA = await CareerDNA.findOne({ userId });
    if (!careerDNA) {
      return res.status(404).json({ msg: 'Career DNA not found. Please generate it first.' });
    }

    const Job = require('../../models/job.model');
    const job = await Job.findById(jobId).populate('company');

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Analyze company culture from job description
    const jobText = `${job.jobTitle} ${job.jobDescription} ${job.eligibility || ''} ${job.company?.companyDescription || ''}`;

    const culturePrompt = `Analyze this job and company to extract culture signals:

JOB INFORMATION:
${jobText.substring(0, 2000)}

Extract and return JSON with:
1. Company Culture Profile:
   - environment: "startup" | "mid-size" | "enterprise" | "unknown"
   - collaborationLevel: "highly-collaborative" | "moderate" | "independent" | "unknown"
   - pace: "fast-paced" | "moderate" | "steady" | "unknown"
   - workLocation: "remote" | "hybrid" | "office" | "unknown"

2. Company Values (0-100):
   - workLifeBalance
   - innovation
   - stability
   - growthOpportunity
   - compensation
   - companyCulture

3. Culture Signals:
   - positiveSignals: [array of positive culture indicators]
   - potentialConcerns: [array of potential red flags]

Return ONLY valid JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a company culture analyst. Analyze job descriptions to extract culture signals. Always return valid JSON."
        },
        {
          role: "user",
          content: culturePrompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    let companyCulture;
    try {
      companyCulture = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      companyCulture = getDefaultCultureProfile();
    }

    // Calculate compatibility scores
    const compatibility = calculateCompatibility(careerDNA, companyCulture);

    res.json({
      job: {
        _id: job._id,
        jobTitle: job.jobTitle,
        company: job.company?.companyName
      },
      careerDNA: {
        personality: careerDNA.personality,
        workStyle: careerDNA.workStyle,
        values: careerDNA.values
      },
      companyCulture,
      compatibility,
      recommendations: generateRecommendations(compatibility, careerDNA, companyCulture)
    });
  } catch (error) {
    console.error('Error matching culture:', error);
    res.status(500).json({ msg: 'Error matching culture', error: error.message });
  }
};

// Helper functions
function getDefaultCareerDNA() {
  return {
    personality: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50
    },
    workStyle: {
      preferredEnvironment: 'flexible',
      collaborationPreference: 'flexible',
      pacePreference: 'flexible',
      workLocationPreference: 'flexible'
    },
    values: {
      workLifeBalance: 50,
      innovation: 50,
      stability: 50,
      growthOpportunity: 50,
      compensation: 50,
      companyCulture: 50
    },
    communicationStyle: 'balanced',
    careerTrajectory: {
      predictedPaths: []
    },
    insights: []
  };
}

function getDefaultCultureProfile() {
  return {
    companyCultureProfile: {
      environment: 'unknown',
      collaborationLevel: 'unknown',
      pace: 'unknown',
      workLocation: 'unknown'
    },
    companyValues: {
      workLifeBalance: 50,
      innovation: 50,
      stability: 50,
      growthOpportunity: 50,
      compensation: 50,
      companyCulture: 50
    },
    cultureSignals: {
      positiveSignals: [],
      potentialConcerns: []
    }
  };
}

function getDominantTraits(personality) {
  if (!personality) return [];
  const traits = Object.entries(personality)
    .filter(([key]) => key !== 'neuroticism')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  return traits.map(([trait, score]) => ({ trait, score }));
}

function getTopValues(values) {
  if (!values) return [];
  return Object.entries(values)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([value, score]) => ({ value, score }));
}

function calculateCompatibility(careerDNA, companyCulture) {
  let totalScore = 0;
  let maxScore = 0;
  const breakdown = {};

  // Work Style Compatibility (30%)
  const workStyleScore = calculateWorkStyleMatch(careerDNA.workStyle, companyCulture.companyCultureProfile);
  breakdown.workStyle = workStyleScore;
  totalScore += workStyleScore * 0.3;
  maxScore += 100 * 0.3;

  // Values Compatibility (40%)
  const valuesScore = calculateValuesMatch(careerDNA.values, companyCulture.companyValues);
  breakdown.values = valuesScore;
  totalScore += valuesScore * 0.4;
  maxScore += 100 * 0.4;

  // Personality Fit (30%)
  const personalityScore = calculatePersonalityFit(careerDNA.personality, companyCulture);
  breakdown.personality = personalityScore;
  totalScore += personalityScore * 0.3;
  maxScore += 100 * 0.3;

  const overallScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 50;

  return {
    overallScore,
    breakdown,
    level: overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : overallScore >= 40 ? 'moderate' : 'low'
  };
}

function calculateWorkStyleMatch(workStyle, companyProfile) {
  let matches = 0;
  let total = 0;

  if (workStyle.preferredEnvironment && companyProfile.environment) {
    total++;
    if (workStyle.preferredEnvironment === companyProfile.environment || 
        workStyle.preferredEnvironment === 'flexible' || 
        companyProfile.environment === 'unknown') {
      matches++;
    }
  }

  if (workStyle.collaborationPreference && companyProfile.collaborationLevel) {
    total++;
    if (workStyle.collaborationPreference === companyProfile.collaborationLevel ||
        workStyle.collaborationPreference === 'flexible' ||
        companyProfile.collaborationLevel === 'unknown') {
      matches++;
    }
  }

  if (workStyle.pacePreference && companyProfile.pace) {
    total++;
    if (workStyle.pacePreference === companyProfile.pace ||
        workStyle.pacePreference === 'flexible' ||
        companyProfile.pace === 'unknown') {
      matches++;
    }
  }

  return total > 0 ? (matches / total) * 100 : 75;
}

function calculateValuesMatch(studentValues, companyValues) {
  if (!studentValues || !companyValues) return 75;
  
  const valueKeys = ['workLifeBalance', 'innovation', 'stability', 'growthOpportunity', 'compensation', 'companyCulture'];
  let totalDiff = 0;
  let count = 0;

  valueKeys.forEach(key => {
    if (studentValues[key] !== undefined && companyValues[key] !== undefined) {
      const diff = Math.abs(studentValues[key] - companyValues[key]);
      totalDiff += diff;
      count++;
    }
  });

  if (count === 0) return 75;
  const avgDiff = totalDiff / count;
  return Math.max(0, 100 - avgDiff);
}

function calculatePersonalityFit(personality, companyCulture) {
  // Simplified personality fit calculation
  // Higher openness + extraversion = better for startups/innovation
  // Higher conscientiousness = better for enterprise/stability
  
  if (!personality) return 75;
  
  const environment = companyCulture.companyCultureProfile?.environment;
  if (environment === 'startup') {
    return (personality.openness * 0.5 + personality.extraversion * 0.5);
  } else if (environment === 'enterprise') {
    return (personality.conscientiousness * 0.6 + (100 - personality.neuroticism) * 0.4);
  }
  
  return 75;
}

function generateRecommendations(compatibility, careerDNA, companyCulture) {
  const recommendations = [];

  if (compatibility.overallScore >= 80) {
    recommendations.push({
      type: 'positive',
      message: 'Excellent culture fit! This company aligns well with your work style and values.',
      confidence: 'high'
    });
  } else if (compatibility.overallScore < 40) {
    recommendations.push({
      type: 'warning',
      message: 'Potential culture mismatch. Consider if this work environment suits your preferences.',
      confidence: 'medium'
    });
  }

  if (compatibility.breakdown.workStyle < 60) {
    recommendations.push({
      type: 'info',
      message: `Work style mismatch: You prefer ${careerDNA.workStyle.preferredEnvironment} environments, but this appears to be ${companyCulture.companyCultureProfile.environment}.`,
      confidence: 'medium'
    });
  }

  if (companyCulture.cultureSignals?.potentialConcerns?.length > 0) {
    recommendations.push({
      type: 'warning',
      message: `Potential concerns: ${companyCulture.cultureSignals.potentialConcerns.join(', ')}`,
      confidence: 'medium'
    });
  }

  return recommendations;
}

module.exports = {
  analyzeCareerDNA,
  getCareerDNA,
  matchCulture
};

