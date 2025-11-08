const Intervention = require('../../models/intervention.model');
const User = require('../../models/user.model');
const Resume = require('../../models/resume.model');
const InterviewSession = require('../../models/interviewSession.model');

// Intervention effect sizes (based on typical improvements)
const INTERVENTION_EFFECTS = {
  resume_improvement: {
    prsDelta: 8, // +8 points on PRS
    description: 'Improve resume quality and ATS compatibility',
    estimatedTime: '2-3 days'
  },
  mock_interview: {
    prsDelta: 12, // +12 points on PRS
    description: 'Practice mock interviews to improve interview skills',
    estimatedTime: '1-2 weeks'
  },
  skill_training: {
    prsDelta: 10, // +10 points on PRS
    description: 'Complete skill training courses',
    estimatedTime: '2-4 weeks'
  },
  grade_improvement: {
    prsDelta: 15, // +15 points on PRS (long-term)
    description: 'Improve academic grades',
    estimatedTime: '1-2 semesters'
  },
  attendance_improvement: {
    prsDelta: 5, // +5 points on PRS
    description: 'Improve attendance percentage',
    estimatedTime: '1-2 months'
  },
  project_addition: {
    prsDelta: 7, // +7 points on PRS
    description: 'Add relevant projects to resume',
    estimatedTime: '1-2 weeks'
  }
};

// Get recommended interventions for a student
const getRecommendedInterventions = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const resume = await Resume.findOne({ userId });
    const recentInterviews = await InterviewSession.find({ userId }).limit(5);

    if (!user || user.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    const currentPRS = user.studentProfile?.placementReadinessScore?.score || 0;
    const recommendations = [];

    // Analyze profile and recommend interventions
    const factors = user.studentProfile?.placementReadinessScore?.contributingFactors || [];

    // Check resume quality - recommend if score < 80 (more lenient threshold)
    const resumeFactor = factors.find(f => f.factor === 'Resume Quality');
    if (!resumeFactor || resumeFactor.score < 80) {
      recommendations.push({
        interventionType: 'resume_improvement',
        priority: resumeFactor?.score < 70 ? 'high' : 'medium',
        currentScore: resumeFactor?.score || 0,
        projectedPRS: Math.min(100, currentPRS + INTERVENTION_EFFECTS.resume_improvement.prsDelta),
        prsDelta: INTERVENTION_EFFECTS.resume_improvement.prsDelta,
        ...INTERVENTION_EFFECTS.resume_improvement
      });
    }

    // Check mock interview performance - recommend if score < 80 or less than 3 interviews
    const interviewFactor = factors.find(f => f.factor === 'Mock Interview Performance');
    if (!interviewFactor || interviewFactor.score < 80 || recentInterviews.length < 3) {
      recommendations.push({
        interventionType: 'mock_interview',
        priority: (interviewFactor?.score < 70 || recentInterviews.length === 0) ? 'high' : 'medium',
        currentScore: interviewFactor?.score || 0,
        projectedPRS: Math.min(100, currentPRS + INTERVENTION_EFFECTS.mock_interview.prsDelta),
        prsDelta: INTERVENTION_EFFECTS.mock_interview.prsDelta,
        ...INTERVENTION_EFFECTS.mock_interview
      });
    }

    // Check attendance - recommend if score < 80 (more lenient)
    const attendanceFactor = factors.find(f => f.factor === 'Attendance');
    if (!attendanceFactor || attendanceFactor.score < 80) {
      recommendations.push({
        interventionType: 'attendance_improvement',
        priority: attendanceFactor?.score < 75 ? 'medium' : 'low',
        currentScore: attendanceFactor?.score || 0,
        projectedPRS: Math.min(100, currentPRS + INTERVENTION_EFFECTS.attendance_improvement.prsDelta),
        prsDelta: INTERVENTION_EFFECTS.attendance_improvement.prsDelta,
        ...INTERVENTION_EFFECTS.attendance_improvement
      });
    }

    // Check projects - recommend if less than 3 projects (instead of < 2)
    if (!resume || !resume.sections?.projects || resume.sections.projects.length < 3) {
      recommendations.push({
        interventionType: 'project_addition',
        priority: (!resume?.sections?.projects || resume.sections.projects.length < 2) ? 'medium' : 'low',
        currentScore: resume?.sections?.projects?.length || 0,
        projectedPRS: Math.min(100, currentPRS + INTERVENTION_EFFECTS.project_addition.prsDelta),
        prsDelta: INTERVENTION_EFFECTS.project_addition.prsDelta,
        ...INTERVENTION_EFFECTS.project_addition
      });
    }

    // Always recommend skill training for improvement (unless PRS is very high)
    if (currentPRS < 90) {
      recommendations.push({
        interventionType: 'skill_training',
        priority: currentPRS < 70 ? 'high' : 'medium',
        currentScore: currentPRS,
        projectedPRS: Math.min(100, currentPRS + INTERVENTION_EFFECTS.skill_training.prsDelta),
        prsDelta: INTERVENTION_EFFECTS.skill_training.prsDelta,
        ...INTERVENTION_EFFECTS.skill_training
      });
    }

    // Check academic performance - recommend if score < 80 (more lenient)
    const academicFactor = factors.find(f => f.factor === 'Academic Performance');
    if (!academicFactor || academicFactor.score < 80) {
      recommendations.push({
        interventionType: 'grade_improvement',
        priority: 'low', // Long-term
        currentScore: academicFactor?.score || 0,
        projectedPRS: Math.min(100, currentPRS + INTERVENTION_EFFECTS.grade_improvement.prsDelta),
        prsDelta: INTERVENTION_EFFECTS.grade_improvement.prsDelta,
        ...INTERVENTION_EFFECTS.grade_improvement
      });
    }

    // Ensure at least 2-3 recommendations are shown (prioritize highest impact)
    if (recommendations.length === 0) {
      // Fallback: provide general recommendations
      recommendations.push({
        interventionType: 'skill_training',
        priority: 'medium',
        currentScore: currentPRS,
        projectedPRS: Math.min(100, currentPRS + INTERVENTION_EFFECTS.skill_training.prsDelta),
        prsDelta: INTERVENTION_EFFECTS.skill_training.prsDelta,
        ...INTERVENTION_EFFECTS.skill_training
      });
      recommendations.push({
        interventionType: 'project_addition',
        priority: 'medium',
        currentScore: resume?.sections?.projects?.length || 0,
        projectedPRS: Math.min(100, currentPRS + INTERVENTION_EFFECTS.project_addition.prsDelta),
        prsDelta: INTERVENTION_EFFECTS.project_addition.prsDelta,
        ...INTERVENTION_EFFECTS.project_addition
      });
    }

    // Sort by priority and PRS delta
    recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.prsDelta - a.prsDelta;
    });

    res.json({
      currentPRS,
      recommendations,
      totalRecommendations: recommendations.length
    });
  } catch (error) {
    console.error('Error getting interventions:', error);
    res.status(500).json({ msg: 'Error getting interventions', error: error.message });
  }
};

// Simulate "What-if" scenario
const simulateIntervention = async (req, res) => {
  try {
    const { interventionTypes } = req.body; // Array of intervention types to simulate
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    const currentPRS = user.studentProfile?.placementReadinessScore?.score || 0;
    const currentFactors = user.studentProfile?.placementReadinessScore?.contributingFactors || [];

    // Calculate projected PRS after interventions
    let projectedPRS = currentPRS;
    const interventionDeltas = [];
    const updatedFactors = [...currentFactors];

    interventionTypes.forEach(interventionType => {
      const effect = INTERVENTION_EFFECTS[interventionType];
      if (effect) {
        projectedPRS += effect.prsDelta;
        interventionDeltas.push({
          interventionType,
          prsDelta: effect.prsDelta,
          description: effect.description
        });

        // Update relevant factor
        if (interventionType === 'resume_improvement') {
          const factor = updatedFactors.find(f => f.factor === 'Resume Quality');
          if (factor) {
            factor.score = Math.min(100, factor.score + 15);
            factor.impact = factor.score * factor.weight;
          }
        } else if (interventionType === 'mock_interview') {
          const factor = updatedFactors.find(f => f.factor === 'Mock Interview Performance');
          if (factor) {
            factor.score = Math.min(100, factor.score + 20);
            factor.impact = factor.score * factor.weight;
          }
        } else if (interventionType === 'attendance_improvement') {
          const factor = updatedFactors.find(f => f.factor === 'Attendance');
          if (factor) {
            factor.score = Math.min(100, factor.score + 10);
            factor.impact = factor.score * factor.weight;
          }
        }
      }
    });

    projectedPRS = Math.min(100, Math.round(projectedPRS));
    const prsIncrease = projectedPRS - currentPRS;

    // Recalculate top factors
    updatedFactors.sort((a, b) => b.impact - a.impact);
    const projectedTop3Factors = updatedFactors.slice(0, 3);

    res.json({
      currentPRS,
      projectedPRS,
      prsIncrease,
      interventionDeltas,
      currentTop3Factors: currentFactors
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 3),
      projectedTop3Factors,
      simulation: {
        interventions: interventionTypes,
        totalInterventions: interventionTypes.length,
        estimatedTimeToComplete: getMaxEstimatedTime(interventionTypes),
        overallImpact: prsIncrease > 0 ? 'positive' : 'neutral'
      }
    });
  } catch (error) {
    console.error('Error simulating intervention:', error);
    res.status(500).json({ msg: 'Error simulating intervention', error: error.message });
  }
};

// Helper function to get max estimated time
function getMaxEstimatedTime(interventionTypes) {
  const times = interventionTypes.map(type => {
    const effect = INTERVENTION_EFFECTS[type];
    return effect ? effect.estimatedTime : 'Unknown';
  });
  return times.length > 0 ? times[0] : 'Unknown';
}

// Create an intervention (mark as in progress)
const createIntervention = async (req, res) => {
  try {
    const { interventionType, description } = req.body;
    const userId = req.user._id;

    const effect = INTERVENTION_EFFECTS[interventionType];
    if (!effect) {
      return res.status(400).json({ msg: 'Invalid intervention type' });
    }

    const intervention = new Intervention({
      userId,
      interventionType,
      description: description || effect.description,
      projectedPRSDelta: effect.prsDelta,
      status: 'in_progress'
    });

    await intervention.save();
    res.json({ msg: 'Intervention created', intervention });
  } catch (error) {
    console.error('Error creating intervention:', error);
    res.status(500).json({ msg: 'Error creating intervention', error: error.message });
  }
};

// Complete an intervention
const completeIntervention = async (req, res) => {
  try {
    const { interventionId } = req.params;
    const userId = req.user._id;

    const intervention = await Intervention.findOne({ _id: interventionId, userId });
    if (!intervention) {
      return res.status(404).json({ msg: 'Intervention not found' });
    }

    // Recalculate PRS to get actual delta
    const userBefore = await User.findById(userId);
    const prsBefore = userBefore.studentProfile?.placementReadinessScore?.score || 0;

    // Trigger PRS recalculation by calling the calculatePRS function
    const prsController = require('./prs.controller');
    await prsController.calculatePRS({ user: { _id: userId } }, { 
      json: () => {}, 
      status: () => ({ json: () => {} }) 
    });

    const userAfter = await User.findById(userId);
    const prsAfter = userAfter.studentProfile?.placementReadinessScore?.score || 0;
    const actualDelta = prsAfter - prsBefore;

    intervention.status = 'completed';
    intervention.actualPRSDelta = actualDelta;
    intervention.completedAt = new Date();
    await intervention.save();

    res.json({
      msg: 'Intervention completed',
      intervention,
      prsChange: {
        before: prsBefore,
        after: prsAfter,
        delta: actualDelta,
        projectedDelta: intervention.projectedPRSDelta
      }
    });
  } catch (error) {
    console.error('Error completing intervention:', error);
    res.status(500).json({ msg: 'Error completing intervention', error: error.message });
  }
};

// Get intervention history
const getInterventionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const interventions = await Intervention.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ interventions });
  } catch (error) {
    console.error('Error fetching intervention history:', error);
    res.status(500).json({ msg: 'Error fetching intervention history', error: error.message });
  }
};

module.exports = {
  getRecommendedInterventions,
  simulateIntervention,
  createIntervention,
  completeIntervention,
  getInterventionHistory
};
