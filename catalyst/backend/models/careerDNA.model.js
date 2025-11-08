const mongoose = require('mongoose');

const careerDNASchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    unique: true
  },
  // Personality Traits (Big 5 - simplified)
  personality: {
    openness: { type: Number, min: 0, max: 100, default: 50 }, // Innovation, creativity
    conscientiousness: { type: Number, min: 0, max: 100, default: 50 }, // Organization, reliability
    extraversion: { type: Number, min: 0, max: 100, default: 50 }, // Social, collaborative
    agreeableness: { type: Number, min: 0, max: 100, default: 50 }, // Team player, cooperative
    neuroticism: { type: Number, min: 0, max: 100, default: 50 } // Stress handling (lower is better)
  },
  // Work Style Preferences
  workStyle: {
    preferredEnvironment: {
      type: String,
      enum: ['startup', 'mid-size', 'enterprise', 'flexible'],
      default: 'flexible'
    },
    collaborationPreference: {
      type: String,
      enum: ['highly-collaborative', 'moderate', 'independent', 'flexible'],
      default: 'flexible'
    },
    pacePreference: {
      type: String,
      enum: ['fast-paced', 'moderate', 'steady', 'flexible'],
      default: 'flexible'
    },
    workLocationPreference: {
      type: String,
      enum: ['remote', 'hybrid', 'office', 'flexible'],
      default: 'flexible'
    }
  },
  // Values and Priorities (0-100 scale)
  values: {
    workLifeBalance: { type: Number, min: 0, max: 100, default: 50 },
    innovation: { type: Number, min: 0, max: 100, default: 50 },
    stability: { type: Number, min: 0, max: 100, default: 50 },
    growthOpportunity: { type: Number, min: 0, max: 100, default: 50 },
    compensation: { type: Number, min: 0, max: 100, default: 50 },
    companyCulture: { type: Number, min: 0, max: 100, default: 50 }
  },
  // Communication Style
  communicationStyle: {
    type: String,
    enum: ['direct', 'diplomatic', 'analytical', 'empathetic', 'balanced'],
    default: 'balanced'
  },
  // Career Trajectory Predictions
  careerTrajectory: {
    predictedPaths: [{
      path: { type: String }, // e.g., "Technical Lead", "Entrepreneur", "Consultant"
      probability: { type: Number, min: 0, max: 100 }
    }],
    preferredPath: { type: String }
  },
  // Key Insights (AI-generated)
  insights: [{
    category: { type: String }, // e.g., "Work Style", "Values", "Career Path"
    insight: { type: String },
    confidence: { type: Number, min: 0, max: 100 }
  }],
  // Analysis metadata
  analysisSource: {
    interviewSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession' }],
    resumeAnalysis: { type: Boolean, default: false },
    lastAnalyzed: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for efficient queries
careerDNASchema.index({ userId: 1 });

module.exports = mongoose.model('CareerDNA', careerDNASchema);

