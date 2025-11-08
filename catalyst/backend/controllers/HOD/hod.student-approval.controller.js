const User = require('../../models/user.model');

// Get all unapproved students in HOD's department
const getUnapprovedStudents = async (req, res) => {
  try {
    const hod = await User.findById(req.user._id);
    if (!hod || hod.role !== 'hod') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const department = hod.hodProfile?.department;
    if (!department) {
      return res.status(400).json({ msg: 'HOD department not set' });
    }

    const students = await User.find({
      role: 'student',
      'studentProfile.department': department,
      'studentProfile.isApproved': { $ne: true }
    }).select('first_name last_name email studentProfile');

    res.json({ students });
  } catch (error) {
    console.error('Error fetching unapproved students:', error);
    res.status(500).json({ msg: 'Internal Server Error', error: error.message });
  }
};

// Approve student
const approveStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const hod = await User.findById(req.user._id);
    
    if (!hod || hod.role !== 'hod') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Verify student is in HOD's department
    if (student.studentProfile?.department !== hod.hodProfile?.department) {
      return res.status(403).json({ msg: 'Student is not in your department' });
    }

    student.studentProfile.isApproved = true;
    await student.save();

    res.json({ msg: 'Student approved successfully' });
  } catch (error) {
    console.error('Error approving student:', error);
    res.status(500).json({ msg: 'Internal Server Error', error: error.message });
  }
};

// Reject student (set approval to false)
const rejectStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const hod = await User.findById(req.user._id);
    
    if (!hod || hod.role !== 'hod') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Verify student is in HOD's department
    if (student.studentProfile?.department !== hod.hodProfile?.department) {
      return res.status(403).json({ msg: 'Student is not in your department' });
    }

    student.studentProfile.isApproved = false;
    await student.save();

    res.json({ msg: 'Student rejected' });
  } catch (error) {
    console.error('Error rejecting student:', error);
    res.status(500).json({ msg: 'Internal Server Error', error: error.message });
  }
};

// Get all students in HOD's department
const getDepartmentStudents = async (req, res) => {
  try {
    const hod = await User.findById(req.user._id);
    if (!hod || hod.role !== 'hod') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const department = hod.hodProfile?.department;
    if (!department) {
      return res.status(400).json({ msg: 'HOD department not set' });
    }

    const { year, approved } = req.query;
    const query = {
      role: 'student',
      'studentProfile.department': department
    };

    if (year) {
      query['studentProfile.year'] = parseInt(year);
    }

    if (approved !== undefined) {
      query['studentProfile.isApproved'] = approved === 'true';
    }

    const students = await User.find(query)
      .select('first_name last_name email studentProfile')
      .sort({ createdAt: -1 });

    res.json({ students });
  } catch (error) {
    console.error('Error fetching department students:', error);
    res.status(500).json({ msg: 'Internal Server Error', error: error.message });
  }
};

// Update student profile (HOD can edit)
const updateStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;

    const hod = await User.findById(req.user._id);
    if (!hod || hod.role !== 'hod') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Verify student is in HOD's department
    if (student.studentProfile?.department !== hod.hodProfile?.department) {
      return res.status(403).json({ msg: 'Student is not in your department' });
    }

    // Update allowed fields
    if (updateData.first_name) student.first_name = updateData.first_name;
    if (updateData.last_name) student.last_name = updateData.last_name;
    if (updateData.email) student.email = updateData.email;
    if (updateData.number) student.number = updateData.number;

    if (updateData.studentProfile) {
      if (updateData.studentProfile.rollNumber !== undefined) {
        student.studentProfile.rollNumber = updateData.studentProfile.rollNumber;
      }
      if (updateData.studentProfile.UIN) {
        student.studentProfile.UIN = updateData.studentProfile.UIN;
      }
      if (updateData.studentProfile.year) {
        student.studentProfile.year = updateData.studentProfile.year;
      }
      if (updateData.studentProfile.SGPA) {
        student.studentProfile.SGPA = { ...student.studentProfile.SGPA, ...updateData.studentProfile.SGPA };
      }
    }

    await student.save();
    res.json({ msg: 'Student profile updated successfully', student });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ msg: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  getUnapprovedStudents,
  approveStudent,
  rejectStudent,
  getDepartmentStudents,
  updateStudentProfile
};

