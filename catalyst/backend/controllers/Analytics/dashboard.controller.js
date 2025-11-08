const User = require('../../models/user.model');
const Job = require('../../models/job.model');
const Company = require('../../models/company.model');
const PlacementDrive = require('../../models/placementDrive.model');

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalDrives = await PlacementDrive.countDocuments();
    
    // Placement statistics
    const students = await User.find({ role: 'student' });
    let placedStudents = 0;
    let totalPackages = [];
    
    students.forEach(student => {
      const hiredJobs = student.studentProfile?.appliedJobs?.filter(
        job => job.status === 'hired'
      ) || [];
      if (hiredJobs.length > 0) {
        placedStudents++;
        hiredJobs.forEach(job => {
          if (job.package) {
            totalPackages.push(job.package);
          }
        });
      }
    });
    
    const placementRate = totalStudents > 0 ? 
      parseFloat(((placedStudents / totalStudents) * 100).toFixed(2)) : 0;
    
    // Department-wise stats
    const deptStats = {};
    students.forEach(student => {
      const dept = student.studentProfile?.department || 'Unknown';
      if (!deptStats[dept]) {
        deptStats[dept] = {
          total: 0,
          placed: 0,
          unplaced: 0
        };
      }
      deptStats[dept].total++;
      
      const hasHiredJob = student.studentProfile?.appliedJobs?.some(
        job => job.status === 'hired'
      );
      if (hasHiredJob) {
        deptStats[dept].placed++;
      } else {
        deptStats[dept].unplaced++;
      }
    });
    
    // Recent activity
    const recentJobs = await Job.find()
      .sort({ postedAt: -1 })
      .limit(5)
      .populate('company')
      .select('jobTitle company postedAt salary');
    
    const upcomingDrives = await PlacementDrive.find({
      status: 'upcoming',
      driveDate: { $gte: new Date() }
    })
      .sort({ driveDate: 1 })
      .limit(5)
      .populate('company')
      .select('driveName company driveDate');
    
    // Package distribution
    const allJobs = await Job.find({ salary: { $exists: true, $ne: null } });
    let avgPackage = 0;
    let maxPackage = 0;
    let minPackage = Infinity;
    
    if (allJobs.length > 0) {
      const salaries = allJobs.map(j => j.salary).filter(s => s > 0);
      if (salaries.length > 0) {
        avgPackage = parseFloat((salaries.reduce((a, b) => a + b, 0) / salaries.length).toFixed(2));
        maxPackage = Math.max(...salaries);
        minPackage = Math.min(...salaries);
      }
    }
    if (minPackage === Infinity) minPackage = 0;
    
    // Year-wise stats
    const yearStats = {};
    students.forEach(student => {
      const year = student.studentProfile?.year || 0;
      if (!yearStats[year]) {
        yearStats[year] = { total: 0, placed: 0 };
      }
      yearStats[year].total++;
      const hasHiredJob = student.studentProfile?.appliedJobs?.some(
        job => job.status === 'hired'
      );
      if (hasHiredJob) yearStats[year].placed++;
    });
    
    res.json({
      overview: {
        totalStudents,
        totalJobs,
        totalCompanies,
        totalDrives,
        placedStudents,
        placementRate,
        averagePackage: totalPackages.length > 0 ? 
          parseFloat((totalPackages.reduce((a, b) => a + b, 0) / totalPackages.length).toFixed(2)) : 0
      },
      departmentStats: Object.keys(deptStats).map(dept => ({
        department: dept,
        ...deptStats[dept]
      })),
      yearStats: Object.keys(yearStats).map(year => ({
        year: parseInt(year),
        ...yearStats[year]
      })),
      packageStats: {
        average: avgPackage,
        max: maxPackage,
        min: minPackage
      },
      recentJobs: recentJobs.map(job => ({
        title: job.jobTitle,
        company: job.company?.companyName || 'Unknown',
        postedAt: job.postedAt,
        salary: job.salary
      })),
      upcomingDrives: upcomingDrives.map(drive => ({
        name: drive.driveName,
        company: drive.company?.companyName || 'Unknown',
        date: drive.driveDate
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ msg: 'Error fetching dashboard stats', error: error.message });
  }
};

module.exports = { getDashboardStats };

