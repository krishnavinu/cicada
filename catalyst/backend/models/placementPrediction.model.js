const mongoose = require('mongoose');

const placementPredictionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users', 
    required: true 
  },
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job',
    required: true
  },
  placementProbability: { 
    type: Number, 
    min: 0, 
    max: 100,
    required: true
  },
  factors: {
    academicScore: { type: Number, min: 0, max: 100 },
    interviewPerformance: { type: Number, min: 0, max: 100 },
    resumeScore: { type: Number, min: 0, max: 100 },
    skillsMatch: { type: Number, min: 0, max: 100 },
    experienceLevel: { type: Number, min: 0, max: 100 }
  },
  recommendations: [String],
  predictedPackage: { type: Number, min: 0 },
  confidenceLevel: { 
    type: Number, 
    min: 0, 
    max: 100,
    default: 75
  },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Compound index for efficient queries
placementPredictionSchema.index({ userId: 1, jobId: 1 });

module.exports = mongoose.model('PlacementPrediction', placementPredictionSchema);

