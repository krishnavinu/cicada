const User = require('../../models/user.model');
const Job = require('../../models/job.model');
const PlacementDrive = require('../../models/placementDrive.model');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');

// Helper to calculate CGPA
const calculateCGPA = (sgpa) => {
  if (!sgpa) return 0;
  const semesters = Object.values(sgpa).filter(v => v && v > 0);
  if (semesters.length === 0) return 0;
  return parseFloat((semesters.reduce((a, b) => a + b, 0) / semesters.length).toFixed(2));
};

// Department-wise report
const getDepartmentWiseReport = async (req, res) => {
  try {
    const { year, department } = req.query;
    
    const query = { role: 'student' };
    if (year) query['studentProfile.year'] = parseInt(year);
    if (department) query['studentProfile.department'] = department;
    
    const students = await User.find(query);
    
    const report = {
      totalStudents: students.length,
      departments: {},
      placementStats: {
        placed: 0,
        unplaced: 0,
        inProcess: 0
      },
      averagePackage: 0,
      topRecruiters: []
    };
    
    // Group by department
    students.forEach(student => {
      const dept = student.studentProfile?.department || 'Unknown';
      if (!report.departments[dept]) {
        report.departments[dept] = {
          total: 0,
          placed: 0,
          unplaced: 0,
          packages: [],
          averagePackage: 0
        };
      }
      
      report.departments[dept].total++;
      
      const placedJobs = student.studentProfile?.appliedJobs?.filter(
        job => job.status === 'hired'
      ) || [];
      
      if (placedJobs.length > 0) {
        report.departments[dept].placed++;
        report.placementStats.placed++;
        placedJobs.forEach(job => {
          if (job.package) {
            report.departments[dept].packages.push(job.package);
          }
        });
      } else {
        const inProcessJobs = student.studentProfile?.appliedJobs?.filter(
          job => job.status === 'interview' || job.status === 'applied'
        ) || [];
        
        if (inProcessJobs.length > 0) {
          report.placementStats.inProcess++;
        } else {
          report.departments[dept].unplaced++;
          report.placementStats.unplaced++;
        }
      }
    });
    
    // Calculate averages
    const allPackages = [];
    Object.keys(report.departments).forEach(dept => {
      const packages = report.departments[dept].packages;
      if (packages.length > 0) {
        report.departments[dept].averagePackage = parseFloat(
          (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2)
        );
        allPackages.push(...packages);
      }
    });
    
    if (allPackages.length > 0) {
      report.averagePackage = parseFloat(
        (allPackages.reduce((a, b) => a + b, 0) / allPackages.length).toFixed(2)
      );
    }
    
    res.json({ report });
  } catch (error) {
    console.error('Error generating department report:', error);
    res.status(500).json({ msg: 'Error generating report', error: error.message });
  }
};

// Offer-wise report
const getOfferWiseReport = async (req, res) => {
  try {
    const jobs = await Job.find().populate('company');
    
    const report = {
      totalOffers: 0,
      offersByCompany: {},
      offersByPackage: {
        '0-5': 0,
        '5-10': 0,
        '10-15': 0,
        '15-20': 0,
        '20+': 0
      },
      offersByDepartment: {},
      timeline: []
    };
    
    jobs.forEach(job => {
      const hiredApplicants = job.applicants?.filter(a => a.status === 'hired') || [];
      report.totalOffers += hiredApplicants.length;
      
      const companyName = job.company?.companyName || 'Unknown';
      if (!report.offersByCompany[companyName]) {
        report.offersByCompany[companyName] = 0;
      }
      report.offersByCompany[companyName] += hiredApplicants.length;
      
      // Get package range
      const getPackageRange = (salary) => {
        if (!salary) return '0-5';
        if (salary < 5) return '0-5';
        if (salary < 10) return '5-10';
        if (salary < 15) return '10-15';
        if (salary < 20) return '15-20';
        return '20+';
      };
      
      hiredApplicants.forEach(applicant => {
        const packageRange = getPackageRange(job.salary);
        report.offersByPackage[packageRange]++;
        
        // Get student department
        User.findById(applicant.studentId).then(student => {
          if (student && student.studentProfile?.department) {
            const dept = student.studentProfile.department;
            if (!report.offersByDepartment[dept]) {
              report.offersByDepartment[dept] = 0;
            }
            report.offersByDepartment[dept]++;
          }
        }).catch(err => console.error(err));
      });
    });
    
    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ report });
  } catch (error) {
    console.error('Error generating offer report:', error);
    res.status(500).json({ msg: 'Error generating report', error: error.message });
  }
};

// Student-wise report
const getStudentWiseReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ msg: 'Student not found' });
    }
    
    const appliedJobIds = student.studentProfile?.appliedJobs?.map(j => j.jobId) || [];
    const appliedJobs = await Job.find({
      _id: { $in: appliedJobIds }
    }).populate('company');
    
    const report = {
      studentInfo: {
        name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
        email: student.email,
        department: student.studentProfile?.department || 'Unknown',
        year: student.studentProfile?.year || 0,
        cgpa: calculateCGPA(student.studentProfile?.SGPA),
        rollNumber: student.studentProfile?.rollNumber || 'N/A'
      },
      applicationStats: {
        totalApplied: student.studentProfile?.appliedJobs?.length || 0,
        interviews: student.studentProfile?.appliedJobs?.filter(j => j.status === 'interview').length || 0,
        hired: student.studentProfile?.appliedJobs?.filter(j => j.status === 'hired').length || 0,
        rejected: student.studentProfile?.appliedJobs?.filter(j => j.status === 'rejected').length || 0,
        pending: student.studentProfile?.appliedJobs?.filter(j => j.status === 'applied').length || 0
      },
      applications: appliedJobs.map(job => {
        const application = student.studentProfile?.appliedJobs?.find(
          aj => aj.jobId?.toString() === job._id.toString()
        );
        return {
          company: job.company?.companyName || 'Unknown',
          position: job.jobTitle,
          status: application?.status || 'applied',
          appliedDate: application?.appliedAt || new Date(),
          package: application?.package || job.salary || 0
        };
      })
    };
    
    res.json({ report });
  } catch (error) {
    console.error('Error generating student report:', error);
    res.status(500).json({ msg: 'Error generating report', error: error.message });
  }
};

// Export Department Report as Excel
const exportDepartmentReportExcel = async (req, res) => {
  try {
    const { year, department } = req.query;
    
    const query = { role: 'student' };
    if (year) query['studentProfile.year'] = parseInt(year);
    if (department) query['studentProfile.department'] = department;
    
    const students = await User.find(query);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Department Report');
    
    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Roll Number', key: 'rollNumber', width: 15 },
      { header: 'CGPA', key: 'cgpa', width: 10 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Package (LPA)', key: 'package', width: 15 }
    ];
    
    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    
    // Add student data
    students.forEach(student => {
      const placedJobs = student.studentProfile?.appliedJobs?.filter(j => j.status === 'hired') || [];
      const status = placedJobs.length > 0 ? 'Placed' : 
                    (student.studentProfile?.appliedJobs?.some(j => j.status === 'interview' || j.status === 'applied') ? 'In Process' : 'Unplaced');
      const packageAmount = placedJobs.length > 0 ? placedJobs[0].package || 0 : 0;
      
      worksheet.addRow({
        name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
        email: student.email,
        department: student.studentProfile?.department || 'Unknown',
        year: student.studentProfile?.year || 'N/A',
        rollNumber: student.studentProfile?.rollNumber || 'N/A',
        cgpa: calculateCGPA(student.studentProfile?.SGPA),
        status: status,
        package: packageAmount
      });
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=department-report-${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({ msg: 'Error exporting report', error: error.message });
  }
};

// Export Department Report as PDF
const exportDepartmentReportPDF = async (req, res) => {
  try {
    const { year, department } = req.query;
    
    const query = { role: 'student' };
    if (year) query['studentProfile.year'] = parseInt(year);
    if (department) query['studentProfile.department'] = department;
    
    const students = await User.find(query);
    
    // Generate HTML content
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #2563eb; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Department Placement Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total Students:</strong> ${students.length}</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>Roll Number</th>
              <th>CGPA</th>
              <th>Status</th>
              <th>Package (LPA)</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    students.forEach(student => {
      const placedJobs = student.studentProfile?.appliedJobs?.filter(j => j.status === 'hired') || [];
      const status = placedJobs.length > 0 ? 'Placed' : 
                    (student.studentProfile?.appliedJobs?.some(j => j.status === 'interview' || j.status === 'applied') ? 'In Process' : 'Unplaced');
      const packageAmount = placedJobs.length > 0 ? placedJobs[0].package || 0 : 0;
      
      html += `
        <tr>
          <td>${`${student.first_name || ''} ${student.last_name || ''}`.trim()}</td>
          <td>${student.email}</td>
          <td>${student.studentProfile?.department || 'Unknown'}</td>
          <td>${student.studentProfile?.year || 'N/A'}</td>
          <td>${student.studentProfile?.rollNumber || 'N/A'}</td>
          <td>${calculateCGPA(student.studentProfile?.SGPA)}</td>
          <td>${status}</td>
          <td>${packageAmount}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=department-report-${Date.now()}.pdf`);
    res.send(pdf);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ msg: 'Error exporting report', error: error.message });
  }
};

module.exports = {
  getDepartmentWiseReport,
  getOfferWiseReport,
  getStudentWiseReport,
  exportDepartmentReportExcel,
  exportDepartmentReportPDF
};

