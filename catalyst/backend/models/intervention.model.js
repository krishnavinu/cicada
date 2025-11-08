const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  interventionType: {
    type: String,
    enum: ['resume_improvement', 'mock_interview', 'skill_training', 'grade_improvement', 'attendance_improvement', 'project_addition'],
    required: true
  },
  description: String,
  projectedPRSDelta: { type: Number, default: 0 },
  actualPRSDelta: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['recommended', 'in_progress', 'completed', 'dismissed'],
    default: 'recommended'
  },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Intervention', interventionSchema);

