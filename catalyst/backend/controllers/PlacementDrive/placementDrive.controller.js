const PlacementDrive = require('../../models/placementDrive.model');
const Job = require('../../models/job.model');
const User = require('../../models/user.model');
const Company = require('../../models/company.model');
const { sendSimpleEmail } = require('../../utils/emailHelper');

// Create placement drive
const createDrive = async (req, res) => {
  try {
    const {
      driveName,
      company,
      jobPostings,
      driveDate,
      registrationDeadline,
      venue,
      eligibilityCriteria
    } = req.body;

    if (!driveName || !company || !driveDate || !registrationDeadline) {
      return res.status(400).json({ msg: 'Required fields missing' });
    }

    const drive = new PlacementDrive({
      driveName,
      company,
      jobPostings: jobPostings || [],
      driveDate: new Date(driveDate),
      registrationDeadline: new Date(registrationDeadline),
      venue: venue || '',
      eligibilityCriteria: eligibilityCriteria || {},
      createdBy: req.user._id,
      status: new Date(driveDate) > new Date() ? 'upcoming' : 'ongoing'
    });

    await drive.save();
    res.json({ msg: 'Placement drive created successfully', drive });
  } catch (error) {
    console.error('Error creating drive:', error);
    res.status(500).json({ msg: 'Error creating placement drive', error: error.message });
  }
};

// Get all drives
const getAllDrives = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const drives = await PlacementDrive.find(query)
      .populate('company', 'companyName')
      .populate('createdBy', 'first_name last_name email')
      .populate('jobPostings', 'jobTitle salary')
      .sort({ driveDate: -1 });

    res.json({ drives });
  } catch (error) {
    console.error('Error fetching drives:', error);
    res.status(500).json({ msg: 'Error fetching drives', error: error.message });
  }
};

// Get drive by ID
const getDriveById = async (req, res) => {
  try {
    const { driveId } = req.params;
    const drive = await PlacementDrive.findById(driveId)
      .populate('company')
      .populate('jobPostings')
      .populate('registeredStudents', 'first_name last_name email studentProfile')
      .populate('createdBy', 'first_name last_name email');

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    res.json({ drive });
  } catch (error) {
    console.error('Error fetching drive:', error);
    res.status(500).json({ msg: 'Error fetching drive', error: error.message });
  }
};

// Update drive
const updateDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const updateData = req.body;

    if (updateData.driveDate) updateData.driveDate = new Date(updateData.driveDate);
    if (updateData.registrationDeadline) updateData.registrationDeadline = new Date(updateData.registrationDeadline);
    
    updateData.updatedAt = new Date();

    const drive = await PlacementDrive.findByIdAndUpdate(
      driveId,
      updateData,
      { new: true }
    ).populate('company');

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    res.json({ msg: 'Drive updated successfully', drive });
  } catch (error) {
    console.error('Error updating drive:', error);
    res.status(500).json({ msg: 'Error updating drive', error: error.message });
  }
};

// Register student for drive
const registerForDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const studentId = req.user._id;

    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    // Check if already registered
    if (drive.registeredStudents.includes(studentId)) {
      return res.status(400).json({ msg: 'Already registered for this drive' });
    }

    // Check eligibility
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ msg: 'Invalid student' });
    }

    const eligibility = drive.eligibilityCriteria;
    if (eligibility.departments && eligibility.departments.length > 0) {
      if (!eligibility.departments.includes(student.studentProfile?.department)) {
        return res.status(400).json({ msg: 'Department not eligible' });
      }
    }

    if (eligibility.year && eligibility.year.length > 0) {
      if (!eligibility.year.includes(student.studentProfile?.year)) {
        return res.status(400).json({ msg: 'Year not eligible' });
      }
    }

    // Register student
    drive.registeredStudents.push(studentId);
    await drive.save();

    // Send automated email notification
    try {
      const driveWithCompany = await PlacementDrive.findById(driveId).populate('company');
      const studentName = `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Student';
      const companyName = driveWithCompany.company?.companyName || 'Company';
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #7c3aed; color: white; padding: 20px; text-align: center;">
            <h2>Placement Drive Registration Confirmed</h2>
          </div>
          <div style="padding: 30px; background-color: #f9fafb;">
            <p>Dear ${studentName},</p>
            <p>Your registration for the placement drive <strong>${drive.driveName}</strong> by <strong>${companyName}</strong> has been confirmed.</p>
            <p><strong>Drive Date:</strong> ${new Date(drive.driveDate).toLocaleDateString()}</p>
            ${drive.venue ? `<p><strong>Venue:</strong> ${drive.venue}</p>` : ''}
            <p>Please ensure you have your resume ready and meet all the eligibility criteria.</p>
            <p style="margin-top: 30px;">Best regards,<br>catalyst Team</p>
          </div>
        </div>
      `;
      await sendSimpleEmail(student.email, `Placement Drive Registration - ${drive.driveName}`, html);
    } catch (emailError) {
      console.log("Error sending placement drive registration email:", emailError);
      // Don't fail registration if email fails
    }

    res.json({ msg: 'Registered successfully for placement drive' });
  } catch (error) {
    console.error('Error registering for drive:', error);
    res.status(500).json({ msg: 'Error registering for drive', error: error.message });
  }
};

// Update selected students
const updateSelectedStudents = async (req, res) => {
  try {
    const { driveId } = req.params;
    const { selectedStudents } = req.body;

    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    drive.selectedStudents = selectedStudents || [];
    drive.updatedAt = new Date();
    await drive.save();

    res.json({ msg: 'Selected students updated', drive });
  } catch (error) {
    console.error('Error updating selected students:', error);
    res.status(500).json({ msg: 'Error updating selected students', error: error.message });
  }
};

module.exports = {
  createDrive,
  getAllDrives,
  getDriveById,
  updateDrive,
  registerForDrive,
  updateSelectedStudents
};

