const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  templateId: { type: String, default: 'template-1' },
  sections: {
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      github: String,
      portfolio: String
    },
    summary: String,
    education: [{
      degree: String,
      institution: String,
      year: String,
      gpa: String,
      achievements: [String]
    }],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String,
      achievements: [String]
    }],
    skills: [{
      category: String,
      items: [String]
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      link: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String
    }],
    achievements: [String],
    languages: [{
      language: String,
      proficiency: String
    }]
  },
  styling: {
    fontFamily: { type: String, default: 'Arial' },
    fontSize: { type: String, default: '12px' },
    colorScheme: { type: String, default: 'blue' },
    layout: { type: String, default: 'single-column' }
  },
  aiScore: { type: Number, default: 0 },
  jobMatchScores: [{
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    matchPercentage: Number,
    matchedSkills: [String],
    missingSkills: [String]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);

