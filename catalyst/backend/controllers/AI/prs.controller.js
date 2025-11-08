const User = require('../../models/user.model');
const Resume = require('../../models/resume.model');
const InterviewSession = require('../../models/interviewSession.model');

// Calculate Placement Readiness Score (PRS)
const calculatePRS = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : (req.params.userId || (req.body && req.body.userId));
    
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    const resume = await Resume.findOne({ userId });
    const recentInterviews = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate individual component scores
    const factors = {};

    // 1. Academic Score (30% weight) - based on SGPA
    const sgpaValues = Object.values(user.studentProfile?.SGPA || {}).filter(v => v && v > 0);
    const avgSGPA = sgpaValues.length > 0 
      ? sgpaValues.reduce((a, b) => a + b, 0) / sgpaValues.length 
      : 0;
    factors.academicScore = {
      score: Math.min(avgSGPA * 10, 100),
      weight: 0.30,
      label: 'Academic Performance',
      details: `Average SGPA: ${avgSGPA.toFixed(2)}/10`
    };

    // 2. Resume Quality (25% weight) - based on AI score and completeness
    const resumeScore = resume?.aiScore || 0;
    const resumeCompleteness = calculateResumeCompleteness(resume);
    factors.resumeQuality = {
      score: (resumeScore * 0.7) + (resumeCompleteness * 0.3),
      weight: 0.25,
      label: 'Resume Quality',
      details: `AI Score: ${resumeScore}/100, Completeness: ${resumeCompleteness.toFixed(0)}%`
    };

    // 3. Mock Interview Performance (25% weight) - based on recent interview scores
    const interviewAvg = recentInterviews.length > 0
      ? recentInterviews
          .filter(s => s.overallScore != null)
          .reduce((sum, s) => sum + (s.overallScore || 0), 0) / 
          recentInterviews.filter(s => s.overallScore != null).length
      : 50; // Default if no interviews
    factors.mockInterviewScore = {
      score: interviewAvg,
      weight: 0.25,
      label: 'Mock Interview Performance',
      details: `Average Score: ${interviewAvg.toFixed(0)}/100 (${recentInterviews.filter(s => s.overallScore != null).length} sessions)`
    };

    // 4. Attendance (20% weight)
    const attendance = user.studentProfile?.attendance?.overallPercentage || 75;
    factors.attendance = {
      score: attendance,
      weight: 0.20,
      label: 'Attendance',
      details: `Attendance: ${attendance}%`
    };

    // Calculate weighted PRS
    let totalWeight = 0;
    let weightedSum = 0;
    const contributingFactors = [];

    Object.entries(factors).forEach(([key, factor]) => {
      weightedSum += factor.score * factor.weight;
      totalWeight += factor.weight;
      contributingFactors.push({
        factor: factor.label,
        weight: factor.weight,
        score: Math.round(factor.score),
        impact: Math.round(factor.score * factor.weight),
        details: factor.details
      });
    });

    const prs = totalWeight > 0 ? weightedSum / totalWeight : 0;

    // Ensure PRS is a valid number between 0-100
    const finalPRS = Math.max(0, Math.min(100, Math.round(prs)));
    if (isNaN(finalPRS) || !isFinite(finalPRS)) {
      throw new Error('Invalid PRS calculation: result is NaN or Infinity');
    }

    // Clean and validate contributing factors - ensure all numbers are valid
    const cleanContributingFactors = contributingFactors.map(factor => {
      const cleanFactor = {
        factor: String(factor.factor || ''),
        weight: Math.max(0, Math.min(1, Number(factor.weight) || 0)),
        score: Math.max(0, Math.min(100, Number(factor.score) || 0)),
        impact: Math.max(0, Number(factor.impact) || 0),
        details: String(factor.details || '')
      };
      
      // Validate each field
      if (isNaN(cleanFactor.weight) || isNaN(cleanFactor.score) || isNaN(cleanFactor.impact)) {
        throw new Error(`Invalid factor values: ${JSON.stringify(factor)}`);
      }
      
      return cleanFactor;
    });

    // Sort cleaned contributing factors by impact (descending) and get top 3
    cleanContributingFactors.sort((a, b) => b.impact - a.impact);
    const top3Factors = cleanContributingFactors.slice(0, 3);

    // Initialize PRS structure if it doesn't exist
    if (!user.studentProfile.placementReadinessScore) {
      user.studentProfile.placementReadinessScore = {
        score: 0,
        contributingFactors: [],
        lastUpdated: new Date()
      };
    }
    
    // Update user's PRS with cleaned data
    user.studentProfile.placementReadinessScore.score = finalPRS;
    user.studentProfile.placementReadinessScore.contributingFactors = cleanContributingFactors;
    user.studentProfile.placementReadinessScore.lastUpdated = new Date();
    
    // Mark the field as modified to ensure Mongoose saves it
    user.markModified('studentProfile.placementReadinessScore');
    
    // Validate before saving
    try {
      const validationError = user.validateSync();
      if (validationError) {
        console.error('Validation Error Details:', JSON.stringify(validationError.errors, null, 2));
        throw new Error(`Validation failed: ${validationError.message}`);
      }
    } catch (validationErr) {
      // If validation fails, log detailed error and throw
      console.error('User Validation Error:', validationErr);
      throw validationErr;
    }
    
    await user.save();

    // Return response if res object is provided (API call)
    if (res && res.json) {
      return res.json({
        prs: finalPRS,
        factors: factors,
        top3ContributingFactors: top3Factors,
        allFactors: cleanContributingFactors,
        breakdown: {
          academic: factors.academicScore.score,
          resume: factors.resumeQuality.score,
          interview: factors.mockInterviewScore.score,
          attendance: factors.attendance.score
        }
      });
    }
    
    // Return data for internal calls
    return {
      prs: finalPRS,
      factors: factors,
      top3ContributingFactors: top3Factors,
      allFactors: cleanContributingFactors
    };
  } catch (error) {
    console.error('Error calculating PRS:', error);
    if (res && res.status) {
      return res.status(500).json({ 
        msg: 'Error calculating PRS', 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
    throw error;
  }
};

// Helper function to calculate resume completeness
function calculateResumeCompleteness(resume) {
  if (!resume || !resume.sections) return 0;

  const sections = resume.sections;
  let completeness = 0;
  let totalChecks = 0;

  // Personal Info (15%)
  totalChecks++;
  if (sections.personalInfo?.fullName && sections.personalInfo?.email) {
    completeness += 15;
  }

  // Summary (10%)
  totalChecks++;
  if (sections.summary && sections.summary.length > 50) {
    completeness += 10;
  }

  // Education (15%)
  totalChecks++;
  if (sections.education && sections.education.length > 0) {
    completeness += 15;
  }

  // Experience (20%)
  totalChecks++;
  if (sections.experience && sections.experience.length > 0) {
    completeness += 20;
  }

  // Skills (15%)
  totalChecks++;
  if (sections.skills && sections.skills.length > 0) {
    completeness += 15;
  }

  // Projects (15%)
  totalChecks++;
  if (sections.projects && sections.projects.length > 0) {
    completeness += 15;
  }

  // Certifications (10%)
  totalChecks++;
  if (sections.certifications && sections.certifications.length > 0) {
    completeness += 10;
  }

  return completeness;
}

// Get PRS for a user
const getPRS = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.params.userId;
    const user = await User.findById(userId);

    if (!user || user.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    const prsData = user.studentProfile?.placementReadinessScore;
    
    if (!prsData || prsData.score === undefined || prsData.score === 0) {
      // Return 404 so frontend can trigger calculation
      return res.status(404).json({ msg: 'PRS not calculated yet' });
    }

    // Reconstruct breakdown for response
    const resume = await Resume.findOne({ userId });
    const recentInterviews = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate breakdown components
    const sgpaValues = Object.values(user.studentProfile?.SGPA || {}).filter(v => v && v > 0);
    const avgSGPA = sgpaValues.length > 0 
      ? sgpaValues.reduce((a, b) => a + b, 0) / sgpaValues.length 
      : 0;
    const academicScore = Math.min(avgSGPA * 10, 100);
    
    const resumeScore = resume?.aiScore || 0;
    const resumeCompleteness = calculateResumeCompleteness(resume);
    const resumeQualityScore = (resumeScore * 0.7) + (resumeCompleteness * 0.3);

    const interviewAvg = recentInterviews.length > 0
      ? recentInterviews
          .filter(s => s.overallScore != null)
          .reduce((sum, s) => sum + (s.overallScore || 0), 0) / 
          recentInterviews.filter(s => s.overallScore != null).length
      : 50;

    const attendance = user.studentProfile?.attendance?.overallPercentage || 75;

    const top3Factors = (prsData.contributingFactors || [])
      .sort((a, b) => (b.impact || 0) - (a.impact || 0))
      .slice(0, 3);

    res.json({
      prs: prsData.score,
      top3ContributingFactors: top3Factors,
      allFactors: prsData.contributingFactors || [],
      breakdown: {
        academic: Math.round(academicScore),
        resume: Math.round(resumeQualityScore),
        interview: Math.round(interviewAvg),
        attendance: Math.round(attendance)
      },
      lastUpdated: prsData.lastUpdated
    });
  } catch (error) {
    console.error('Error fetching PRS:', error);
    res.status(500).json({ msg: 'Error fetching PRS', error: error.message });
  }
};

// Get PRS for all students (for TPO)
const getAllStudentsPRS = async (req, res) => {
  try {
    const { department, year } = req.query;
    
    const query = { role: 'student' };
    if (department) query['studentProfile.department'] = department;
    if (year) query['studentProfile.year'] = parseInt(year);

    const students = await User.find(query)
      .select('first_name last_name email studentProfile')
      .sort({ 'studentProfile.placementReadinessScore.score': -1 });

    const studentsWithPRS = students.map(student => ({
      _id: student._id,
      name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
      email: student.email,
      department: student.studentProfile?.department,
      year: student.studentProfile?.year,
      prs: student.studentProfile?.placementReadinessScore?.score || 0,
      top3Factors: student.studentProfile?.placementReadinessScore?.contributingFactors
        ?.sort((a, b) => b.impact - a.impact)
        .slice(0, 3) || []
    }));

    res.json({ students: studentsWithPRS });
  } catch (error) {
    console.error('Error fetching all students PRS:', error);
    res.status(500).json({ msg: 'Error fetching PRS data', error: error.message });
  }
};

// Update attendance
const updateAttendance = async (req, res) => {
  try {
    const { userId, attendancePercentage } = req.body;
    const studentId = userId || req.user._id;

    const user = await User.findById(studentId);
    if (!user || user.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    if (attendancePercentage < 0 || attendancePercentage > 100) {
      return res.status(400).json({ msg: 'Attendance must be between 0 and 100' });
    }

    user.studentProfile.attendance = {
      overallPercentage: attendancePercentage,
      lastUpdated: new Date()
    };
    await user.save();

    // Recalculate PRS after attendance update
    const prsReq = { user: { _id: studentId } };
    await calculatePRS(prsReq, { json: () => {}, status: () => ({ json: () => {} }) });

    res.json({ msg: 'Attendance updated successfully', attendance: attendancePercentage });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ msg: 'Error updating attendance', error: error.message });
  }
};

module.exports = {
  calculatePRS,
  getPRS,
  getAllStudentsPRS,
  updateAttendance
};

