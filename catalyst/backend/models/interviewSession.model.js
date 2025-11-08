const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users', 
    required: true 
  },
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job' 
  },
  roundType: { 
    type: String, 
    enum: ['Technical Interview', 'HR Interview', 'Aptitude Test', 'Group Discussion'],
    required: true
  },
  questions: [{
    question: { type: String, required: true },
    userAnswer: { type: String, default: '' },
    aiFeedback: {
      score: { type: Number, min: 0, max: 100 },
      strengths: [String],
      improvements: [String],
      suggestedAnswer: String,
      timestamp: Date
    },
    timestamp: { type: Date, default: Date.now }
  }],
  overallScore: { type: Number, min: 0, max: 100 },
  performanceMetrics: {
    communicationScore: { type: Number, min: 0, max: 100 },
    technicalScore: { type: Number, min: 0, max: 100 },
    confidenceScore: { type: Number, min: 0, max: 100 },
    timeManagement: { type: Number, min: 0, max: 100 }
  },
  aiRecommendations: [String],
  status: { 
    type: String, 
    enum: ['in-progress', 'completed'], 
    default: 'in-progress' 
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);

