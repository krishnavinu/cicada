const groq = require('../../config/Groq');
const User = require('../../models/user.model');
const Job = require('../../models/job.model');
const PlacementDrive = require('../../models/placementDrive.model');

// Helper to calculate CGPA
const calculateCGPA = (sgpa) => {
  if (!sgpa) return 0;
  const semesters = Object.values(sgpa).filter(v => v && v > 0);
  if (semesters.length === 0) return 0;
  return (semesters.reduce((a, b) => a + b, 0) / semesters.length).toFixed(2);
};

const summarizePlacementResults = async (req, res) => {
  try {
    const { driveId, year, department } = req.query;
    
    // Get placement data
    let query = { role: 'student' };
    if (year) query['studentProfile.year'] = parseInt(year);
    if (department) query['studentProfile.department'] = department;
    
    const students = await User.find(query);
    const jobs = await Job.find().populate('company');
    
    const placementData = {
      totalStudents: students.length,
      placed: 0,
      unplaced: 0,
      departments: {},
      companies: {},
      packages: [],
      averagePackage: 0,
      maxPackage: 0,
      minPackage: Infinity
    };
    
    students.forEach(student => {
      const hiredJobs = student.studentProfile?.appliedJobs?.filter(j => j.status === 'hired') || [];
      if (hiredJobs.length > 0) {
        placementData.placed++;
        hiredJobs.forEach(job => {
          const jobData = jobs.find(j => j._id.toString() === job.jobId?.toString());
          if (jobData) {
            const companyName = jobData.company?.companyName || 'Unknown';
            if (!placementData.companies[companyName]) {
              placementData.companies[companyName] = 0;
            }
            placementData.companies[companyName]++;
            if (job.package) {
              placementData.packages.push(job.package);
              placementData.maxPackage = Math.max(placementData.maxPackage, job.package);
              placementData.minPackage = Math.min(placementData.minPackage, job.package);
            }
          }
        });
      } else {
        placementData.unplaced++;
      }
      
      const dept = student.studentProfile?.department || 'Unknown';
      if (!placementData.departments[dept]) {
        placementData.departments[dept] = { total: 0, placed: 0 };
      }
      placementData.departments[dept].total++;
      if (hiredJobs.length > 0) placementData.departments[dept].placed++;
    });
    
    // Calculate average package
    if (placementData.packages.length > 0) {
      placementData.averagePackage = (
        placementData.packages.reduce((a, b) => a + b, 0) / placementData.packages.length
      ).toFixed(2);
    }
    if (placementData.minPackage === Infinity) placementData.minPackage = 0;
    
    // Generate AI summary
    const prompt = `Summarize this placement data in a professional report format:
    
    Placement Statistics:
    ${JSON.stringify(placementData, null, 2)}
    
    Provide a comprehensive summary with:
    1. Executive Summary (2-3 sentences highlighting key achievements)
    2. Key Highlights (5-7 bullet points)
    3. Department-wise Performance (brief analysis)
    4. Top Recruiting Companies (list top 5)
    5. Package Statistics (average, max, min)
    6. Recommendations for improvement (3-4 actionable points)
    
    Format as a professional placement report. Be concise but comprehensive.`;
    
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a placement report writer. Create professional, data-driven summaries for college placement results. Be objective and analytical." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const summary = completion.choices[0].message.content;
    
    res.json({
      summary,
      data: placementData,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ msg: 'Error generating summary', error: error.message });
  }
};

module.exports = { summarizePlacementResults };

