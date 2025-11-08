const groq = require('../../config/Groq');
const InterviewSession = require('../../models/interviewSession.model');
const User = require('../../models/user.model');
const Job = require('../../models/job.model');
const Resume = require('../../models/resume.model');

// Start interview session
const startInterview = async (req, res) => {
  try {
    const { jobId, roundType } = req.body;
    const userId = req.user._id;

    // Get user resume and job details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    let job = null;
    if (jobId && jobId !== 'undefined') {
      job = await Job.findById(jobId).populate('company');
      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }
    }

    const resume = await Resume.findOne({ userId });

    // Generate interview questions using AI
    const userSkills = resume?.sections?.skills?.flatMap(s => s.items || []).join(', ') || 'Not specified';
    const experienceCount = resume?.sections?.experience?.length || 0;
    const department = user.studentProfile?.department || 'Engineering';
    
    const prompt = `Generate 5 ${roundType} questions for a ${job ? job.jobTitle + ' position at ' + job.company?.companyName : 'general interview'}.

Student Profile:
- Department: ${department}
- Skills: ${userSkills}
- Experience: ${experienceCount} position(s)
- Projects: ${resume?.sections?.projects?.length || 0}

Generate realistic, challenging questions that test both technical knowledge and problem-solving skills. Make questions relevant to the student's background.

Return JSON format:
{
  "questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are an expert technical interviewer. Generate relevant, challenging interview questions based on the candidate's profile. Always return valid JSON." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    const questions = response.questions || [];

    if (questions.length === 0) {
      return res.status(500).json({ msg: 'Failed to generate questions' });
    }

    // Create interview session
    const session = new InterviewSession({
      userId,
      jobId: jobId && jobId !== 'undefined' ? jobId : null,
      roundType,
      questions: questions.map(q => ({ question: q, userAnswer: '' })),
      status: 'in-progress'
    });
    await session.save();

    res.json({ 
      sessionId: session._id, 
      questions: questions,
      roundType,
      jobTitle: job ? job.jobTitle : 'General Interview'
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ msg: 'Error starting interview', error: error.message });
  }
};

// Submit answer and get AI feedback
const submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;
    
    if (!sessionId || questionIndex === undefined || !answer) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    if (questionIndex >= session.questions.length) {
      return res.status(400).json({ msg: 'Invalid question index' });
    }

    const question = session.questions[questionIndex];
    question.userAnswer = answer;

    // Get AI feedback
    const feedbackPrompt = `Evaluate this interview answer:

Question: ${question.question}
Answer: ${answer}
Round Type: ${session.roundType}

Provide detailed feedback with:
1. Score (0-100) - overall quality of the answer
2. Strengths (array of 3 specific positive points)
3. Improvements (array of 3 specific areas to improve)
4. Suggested better answer (a brief improved version)

Return JSON format:
{
  "score": 85,
  "strengths": ["Point 1", "Point 2", "Point 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "suggestedAnswer": "Improved answer suggestion"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are an expert interview evaluator. Provide constructive, detailed feedback on interview answers. Always return valid JSON." 
        },
        { 
          role: "user", 
          content: feedbackPrompt 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const feedbackData = JSON.parse(completion.choices[0].message.content);
    
    question.aiFeedback = {
      score: feedbackData.score || 0,
      strengths: feedbackData.strengths || [],
      improvements: feedbackData.improvements || [],
      suggestedAnswer: feedbackData.suggestedAnswer || '',
      timestamp: new Date()
    };

    await session.save();
    
    res.json({ 
      feedback: question.aiFeedback,
      questionIndex,
      totalQuestions: session.questions.length
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ msg: 'Error submitting answer', error: error.message });
  }
};

// Complete interview and get overall analysis
const completeInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ msg: 'Session ID required' });
    }

    const session = await InterviewSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    // Calculate overall scores
    const answeredQuestions = session.questions.filter(q => q.userAnswer && q.aiFeedback);
    const scores = answeredQuestions.map(q => q.aiFeedback.score);
    
    const overallScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;

    session.overallScore = overallScore;

    // Generate comprehensive analysis
    const answersText = answeredQuestions.map((q, i) => 
      `Q${i+1}: ${q.question}\nAnswer: ${q.userAnswer}\nScore: ${q.aiFeedback.score}/100`
    ).join('\n\n');

    const analysisPrompt = `Analyze this complete interview session:

Round Type: ${session.roundType}
Questions Answered: ${answeredQuestions.length}/${session.questions.length}
Average Score: ${overallScore}/100

Answers and Scores:
${answersText}

Provide comprehensive analysis in JSON format:
{
  "communicationScore": 85,
  "technicalScore": 80,
  "confidenceScore": 75,
  "timeManagement": 70,
  "overallAnalysis": "Brief overall performance summary",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4", "Recommendation 5"]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are an expert career coach. Provide comprehensive interview performance analysis. Always return valid JSON." 
        },
        { 
          role: "user", 
          content: analysisPrompt 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    session.performanceMetrics = {
      communicationScore: analysis.communicationScore || 0,
      technicalScore: analysis.technicalScore || 0,
      confidenceScore: analysis.confidenceScore || 0,
      timeManagement: analysis.timeManagement || 0
    };
    session.aiRecommendations = analysis.recommendations || [];
    session.status = 'completed';
    session.completedAt = new Date();

    await session.save();
    
    res.json({ 
      session: {
        _id: session._id,
        overallScore: session.overallScore,
        performanceMetrics: session.performanceMetrics,
        aiRecommendations: session.aiRecommendations,
        roundType: session.roundType,
        completedAt: session.completedAt
      },
      analysis: {
        overallAnalysis: analysis.overallAnalysis || '',
        recommendations: analysis.recommendations || []
      }
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({ msg: 'Error completing interview', error: error.message });
  }
};

// Get interview history
const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('jobId', 'jobTitle')
      .select('roundType overallScore status createdAt completedAt');

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching interview history:', error);
    res.status(500).json({ msg: 'Error fetching interview history', error: error.message });
  }
};

// Get session details
const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await InterviewSession.findById(sessionId)
      .populate('jobId', 'jobTitle')
      .populate('userId', 'first_name email');

    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (session.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Error fetching session details:', error);
    res.status(500).json({ msg: 'Error fetching session details', error: error.message });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getSessionDetails
};

