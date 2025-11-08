const mongoose = require('mongoose');

const PlacementDriveSchema = new mongoose.Schema({
  driveName: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  driveDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  venue: { type: String },
  eligibilityCriteria: {
    departments: [{ type: String }],
    minCGPA: { type: Number },
    year: [{ type: Number }],
    backlogsAllowed: { type: Number, default: 0 }
  },
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], 
    default: 'upcoming' 
  },
  registeredStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users' 
  }],
  selectedStudents: [{ 
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    package: { type: Number },
    offerDate: { type: Date }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlacementDrive', PlacementDriveSchema);

