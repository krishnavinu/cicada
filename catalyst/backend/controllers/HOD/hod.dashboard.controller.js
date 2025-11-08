const User = require('../../models/user.model');
const Job = require('../../models/job.model');

// Get department statistics
const getDepartmentStats = async (req, res) => {
  try {
    const hod = await User.findById(req.user._id);
    if (!hod || hod.role !== 'hod') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const department = hod.hodProfile?.department;
    if (!department) {
      return res.status(400).json({ msg: 'HOD department not set' });
    }

    // Get all students in department
    const students = await User.find({
      role: 'student',
      'studentProfile.department': department
    });

    // Calculate statistics
    const totalStudents = students.length;
    const approvedStudents = students.filter(s => s.studentProfile?.isApproved).length;
    const unapprovedStudents = totalStudents - approvedStudents;

    // Placement statistics
    const placedStudents = students.filter(s => {
      const placedJobs = s.studentProfile?.appliedJobs?.filter(j => j.status === 'hired') || [];
      return placedJobs.length > 0;
    }).length;

    const inProcessStudents = students.filter(s => {
      const inProcessJobs = s.studentProfile?.appliedJobs?.filter(
        j => j.status === 'interview' || j.status === 'applied'
      ) || [];
      return inProcessJobs.length > 0;
    }).length;

    const unplacedStudents = totalStudents - placedStudents - inProcessStudents;

    // Package statistics
    const packages = [];
    students.forEach(student => {
      const placedJobs = student.studentProfile?.appliedJobs?.filter(j => j.status === 'hired') || [];
      placedJobs.forEach(job => {
        if (job.package) packages.push(job.package);
      });
    });

    const averagePackage = packages.length > 0
      ? packages.reduce((a, b) => a + b, 0) / packages.length
      : 0;

    // Year-wise breakdown
    const yearWise = {};
    [1, 2, 3, 4].forEach(year => {
      const yearStudents = students.filter(s => s.studentProfile?.year === year);
      yearWise[year] = {
        total: yearStudents.length,
        approved: yearStudents.filter(s => s.studentProfile?.isApproved).length,
        placed: yearStudents.filter(s => {
          const placedJobs = s.studentProfile?.appliedJobs?.filter(j => j.status === 'hired') || [];
          return placedJobs.length > 0;
        }).length
      };
    });

    // Top companies
    const companyCounts = {};
    students.forEach(student => {
      const placedJobs = student.studentProfile?.appliedJobs?.filter(j => j.status === 'hired') || [];
      placedJobs.forEach(job => {
        Job.findById(job.jobId).populate('company').then(jobDoc => {
          if (jobDoc && jobDoc.company) {
            const companyName = jobDoc.company.companyName;
            companyCounts[companyName] = (companyCounts[companyName] || 0) + 1;
          }
        }).catch(() => {});
      });
    });

    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 500));

    const topCompanies = Object.entries(companyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      department,
      statistics: {
        totalStudents,
        approvedStudents,
        unapprovedStudents,
        placement: {
          placed: placedStudents,
          inProcess: inProcessStudents,
          unplaced: unplacedStudents,
          placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0
        },
        averagePackage: averagePackage.toFixed(2),
        yearWise,
        topCompanies
      }
    });
  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({ msg: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  getDepartmentStats
};

