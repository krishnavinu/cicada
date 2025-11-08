const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/user.model');
const Company = require('../models/company.model');
const Job = require('../models/job.model');
const PlacementDrive = require('../models/placementDrive.model');
const Resume = require('../models/resume.model');
const InterviewSession = require('../models/interviewSession.model');
const PlacementPrediction = require('../models/placementPrediction.model');
const CareerDNA = require('../models/careerDNA.model');
const Intervention = require('../models/intervention.model');
const Notice = require('../models/notice.model');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Company.deleteMany({});
    // await Job.deleteMany({});
    // await PlacementDrive.deleteMany({});
    // await Resume.deleteMany({});
    // await InterviewSession.deleteMany({});
    // await PlacementPrediction.deleteMany({});
    // await CareerDNA.deleteMany({});
    // await Intervention.deleteMany({});
    // await Notice.deleteMany({});

    // Create Companies
    const companies = [
      {
        companyName: 'Google',
        companyDescription: 'Leading technology company specializing in search, cloud computing, and AI.',
        companyWebsite: 'https://www.google.com',
        companyLocation: 'Mountain View, CA',
        companyDifficulty: 'Hard'
      },
      {
        companyName: 'Microsoft',
        companyDescription: 'Technology corporation developing software, services, and solutions.',
        companyWebsite: 'https://www.microsoft.com',
        companyLocation: 'Redmond, WA',
        companyDifficulty: 'Hard'
      },
      {
        companyName: 'Amazon',
        companyDescription: 'E-commerce and cloud computing company.',
        companyWebsite: 'https://www.amazon.com',
        companyLocation: 'Seattle, WA',
        companyDifficulty: 'Moderate'
      },
      {
        companyName: 'Infosys',
        companyDescription: 'Indian multinational information technology company.',
        companyWebsite: 'https://www.infosys.com',
        companyLocation: 'Bangalore, India',
        companyDifficulty: 'Moderate'
      },
      {
        companyName: 'TCS',
        companyDescription: 'Tata Consultancy Services - IT services and consulting.',
        companyWebsite: 'https://www.tcs.com',
        companyLocation: 'Mumbai, India',
        companyDifficulty: 'Moderate'
      },
      {
        companyName: 'Wipro',
        companyDescription: 'Information technology, consulting and business process services.',
        companyWebsite: 'https://www.wipro.com',
        companyLocation: 'Bangalore, India',
        companyDifficulty: 'Moderate'
      },
      {
        companyName: 'Accenture',
        companyDescription: 'Global professional services company.',
        companyWebsite: 'https://www.accenture.com',
        companyLocation: 'Dublin, Ireland',
        companyDifficulty: 'Moderate'
      },
      {
        companyName: 'Cognizant',
        companyDescription: 'Multinational technology company.',
        companyWebsite: 'https://www.cognizant.com',
        companyLocation: 'Teaneck, NJ',
        companyDifficulty: 'Moderate'
      },
      {
        companyName: 'Meta',
        companyDescription: 'Social media and technology company.',
        companyWebsite: 'https://www.meta.com',
        companyLocation: 'Menlo Park, CA',
        companyDifficulty: 'Hard'
      },
      {
        companyName: 'Apple',
        companyDescription: 'Technology company designing consumer electronics and software.',
        companyWebsite: 'https://www.apple.com',
        companyLocation: 'Cupertino, CA',
        companyDifficulty: 'Hard'
      }
    ];

    const createdCompanies = await Company.insertMany(companies);
    console.log(`Created ${createdCompanies.length} companies`);

    // Create Jobs
    const jobs = [
      {
        jobTitle: 'Software Development Engineer',
        jobDescription: 'Design and develop scalable software solutions. Work on cutting-edge technologies.',
        eligibility: 'B.Tech in Computer Science, CGPA > 7.5, No backlogs',
        salary: 15,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        company: createdCompanies[0]._id,
        postedAt: new Date()
      },
      {
        jobTitle: 'Full Stack Developer',
        jobDescription: 'Develop end-to-end web applications using modern frameworks.',
        eligibility: 'B.Tech in Computer Science/IT, CGPA > 7.0',
        salary: 12,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        company: createdCompanies[1]._id,
        postedAt: new Date()
      },
      {
        jobTitle: 'Cloud Engineer',
        jobDescription: 'Design and implement cloud infrastructure solutions.',
        eligibility: 'B.Tech in any branch, CGPA > 7.0, AWS/Azure knowledge preferred',
        salary: 10,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        company: createdCompanies[2]._id,
        postedAt: new Date()
      },
      {
        jobTitle: 'Associate Software Engineer',
        jobDescription: 'Entry-level position for software development.',
        eligibility: 'B.Tech in Computer Science/IT, CGPA > 6.5',
        salary: 4.5,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        company: createdCompanies[3]._id,
        postedAt: new Date()
      },
      {
        jobTitle: 'System Engineer',
        jobDescription: 'Maintain and improve system infrastructure.',
        eligibility: 'B.Tech in any branch, CGPA > 6.5',
        salary: 3.5,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        company: createdCompanies[4]._id,
        postedAt: new Date()
      },
      {
        jobTitle: 'Data Analyst',
        jobDescription: 'Analyze data and provide insights for business decisions.',
        eligibility: 'B.Tech in Computer Science/IT, CGPA > 7.0, Python/SQL knowledge',
        salary: 8,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        company: createdCompanies[5]._id,
        postedAt: new Date()
      },
      {
        jobTitle: 'DevOps Engineer',
        jobDescription: 'Automate deployment and infrastructure management.',
        eligibility: 'B.Tech in Computer Science/IT, CGPA > 7.0, Docker/Kubernetes knowledge',
        salary: 9,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        company: createdCompanies[6]._id,
        postedAt: new Date()
      },
      {
        jobTitle: 'Frontend Developer',
        jobDescription: 'Build responsive and interactive user interfaces.',
        eligibility: 'B.Tech in Computer Science/IT, CGPA > 7.0, React/Angular knowledge',
        salary: 7,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        company: createdCompanies[7]._id,
        postedAt: new Date()
      },
      {
        jobTitle: 'Backend Developer',
        jobDescription: 'Design and develop server-side applications and APIs.',
        eligibility: 'B.Tech in Computer Science/IT, CGPA > 7.5, Node.js/Python/Java',
        salary: 14,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        company: createdCompanies[8]._id,
        postedAt: new Date()
      },
      {
        jobTitle: 'iOS Developer',
        jobDescription: 'Develop mobile applications for iOS platform.',
        eligibility: 'B.Tech in Computer Science/IT, CGPA > 8.0, Swift/Objective-C',
        salary: 16,
        howToApply: 'Apply through CPMS portal',
        applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        company: createdCompanies[9]._id,
        postedAt: new Date()
      }
    ];

    const createdJobs = await Job.insertMany(jobs);
    console.log(`Created ${createdJobs.length} jobs`);

    // Create TPO Admin
    const tpoPassword = await bcrypt.hash('tpo123', 10);
    const tpo = await User.findOneAndUpdate(
      { email: 'tpo@cpms.com' },
      {
        first_name: 'TPO',
        last_name: 'Admin',
        email: 'tpo@cpms.com',
        password: tpoPassword,
        role: 'tpo_admin',
        number: 9876543210,
        isProfileCompleted: true,
        tpoProfile: { position: 'Training & Placement Officer' }
      },
      { upsert: true, new: true }
    );
    console.log('TPO Admin created:', tpo.email, 'Password: tpo123');

    // Create Super Admin
    const superAdminPassword = await bcrypt.hash('admin123', 10);
    const superAdmin = await User.findOneAndUpdate(
      { email: 'admin@cpms.com' },
      {
        first_name: 'Super',
        last_name: 'Admin',
        email: 'admin@cpms.com',
        password: superAdminPassword,
        role: 'superuser',
        number: 9876543210,
        isProfileCompleted: true
      },
      { upsert: true, new: true }
    );
    console.log('Super Admin created:', superAdmin.email, 'Password: admin123');

    // Create HOD users
    const hodPassword = await bcrypt.hash('hod123', 10);
    const departments = ['Computer', 'Civil', 'ECS', 'AIDS', 'Mechanical'];
    const hodUsers = [];
    
    for (const dept of departments) {
      const hod = await User.findOneAndUpdate(
        { email: `hod.${dept.toLowerCase()}@cpms.com` },
        {
          first_name: 'HOD',
          last_name: dept,
          email: `hod.${dept.toLowerCase()}@cpms.com`,
          password: hodPassword,
          role: 'hod',
          number: 9876543210,
          hodProfile: {
            department: dept,
            position: 'Head of Department'
          },
          isProfileCompleted: true
        },
        { upsert: true, new: true }
      );
      hodUsers.push(hod);
    }
    console.log('HOD users created. Email: hod.{department}@cpms.com, Password: hod123');

    // Create Management Admin
    const mgmtPassword = await bcrypt.hash('mgmt123', 10);
    const mgmt = await User.findOneAndUpdate(
      { email: 'management@cpms.com' },
      {
        first_name: 'Management',
        last_name: 'Admin',
        email: 'management@cpms.com',
        password: mgmtPassword,
        role: 'management_admin',
        number: 9876543210,
        isProfileCompleted: true,
        managementProfile: { position: 'Management Administrator' }
      },
      { upsert: true, new: true }
    );
    console.log('Management Admin created:', mgmt.email, 'Password: mgmt123');

    // Create Students with complete profiles
    const studentPassword = await bcrypt.hash('student123', 10);
    const departments_students = ['Computer', 'Computer', 'Computer', 'ECS', 'ECS', 'AIDS', 'AIDS', 'Civil', 'Mechanical'];
    const years = [4, 4, 3, 4, 3, 4, 3, 4, 4];
    const studentNames = [
      { first: 'Raj', last: 'Kumar', middle: '' },
      { first: 'Priya', last: 'Sharma', middle: 'Devi' },
      { first: 'Amit', last: 'Patel', middle: 'Kumar' },
      { first: 'Sneha', last: 'Reddy', middle: '' },
      { first: 'Vikram', last: 'Singh', middle: '' },
      { first: 'Anjali', last: 'Gupta', middle: 'Rani' },
      { first: 'Rohit', last: 'Verma', middle: '' },
      { first: 'Kavya', last: 'Nair', middle: '' },
      { first: 'Arjun', last: 'Menon', middle: 'Krishna' }
    ];

    const createdStudents = [];
    for (let i = 0; i < studentNames.length; i++) {
      const name = studentNames[i];
      const dept = departments_students[i];
      const year = years[i];
      const email = `student${i + 1}@cpms.com`;
      
      const student = await User.findOneAndUpdate(
        { email },
        {
          first_name: name.first,
          middle_name: name.middle,
          last_name: name.last,
          email,
          password: studentPassword,
          role: 'student',
          number: 9876500000 + i,
          gender: i % 2 === 0 ? 'Male' : 'Female',
          isProfileCompleted: true,
          studentProfile: {
            isApproved: true,
            rollNumber: 2020000 + i,
            UIN: `UIN${2020}${String(i + 1).padStart(3, '0')}`,
            department: dept,
            year,
            addmissionYear: 2020,
            gap: false,
            liveKT: 0,
            attendance: {
              overallPercentage: 75 + (i * 3),
              lastUpdated: new Date()
            },
            SGPA: {
              sem1: 7.5 + (i * 0.3),
              sem2: 7.8 + (i * 0.2),
              sem3: 8.0 + (i * 0.25),
              sem4: 8.2 + (i * 0.3),
              sem5: 8.5 + (i * 0.2),
              sem6: 8.7 + (i * 0.15),
              sem7: year === 4 ? 8.9 + (i * 0.1) : undefined,
              sem8: year === 4 ? 9.0 + (i * 0.1) : undefined
            },
            pastQualification: {
              ssc: { board: 'State Board', percentage: 85 + i, year: 2018 },
              hsc: { board: 'State Board', percentage: 80 + i, year: 2020 }
            },
            placementReadinessScore: {
              score: 70 + (i * 3),
              contributingFactors: [
                {
                  factor: 'Academic Performance',
                  weight: 0.30,
                  score: 85 + (i * 2),
                  impact: 25.5 + (i * 0.6),
                  details: `Average SGPA: ${(8.0 + i * 0.2).toFixed(2)}/10`
                },
                {
                  factor: 'Resume Quality',
                  weight: 0.25,
                  score: 75 + (i * 2),
                  impact: 18.75 + (i * 0.5),
                  details: 'AI Score: 75/100, Completeness: 85%'
                },
                {
                  factor: 'Mock Interview Performance',
                  weight: 0.25,
                  score: 70 + (i * 3),
                  impact: 17.5 + (i * 0.75),
                  details: 'Average Score: 70/100 (3 sessions)'
                },
                {
                  factor: 'Attendance',
                  weight: 0.20,
                  score: 75 + (i * 3),
                  impact: 15 + (i * 0.6),
                  details: `Attendance: ${75 + (i * 3)}%`
                }
              ],
              lastUpdated: new Date()
            },
            appliedJobs: i < 5 ? [{
              jobId: createdJobs[i]._id,
              status: i === 0 ? 'hired' : (i === 1 ? 'interview' : 'applied'),
              package: createdJobs[i].salary,
              appliedAt: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000))
            }] : []
          }
        },
        { upsert: true, new: true }
      );
      createdStudents.push(student);

      // Create Resume for each student
      const resume = await Resume.findOneAndUpdate(
        { userId: student._id },
        {
          userId: student._id,
          templateId: 'template-1',
          sections: {
            personalInfo: {
              fullName: `${name.first} ${name.middle} ${name.last}`.trim(),
              email,
              phone: `987650000${i}`,
              address: `${i + 1}, Sample Street, City, State`,
              linkedin: `https://linkedin.com/in/${name.first.toLowerCase()}${name.last.toLowerCase()}`,
              github: `https://github.com/${name.first.toLowerCase()}${name.last.toLowerCase()}`,
              portfolio: `https://${name.first.toLowerCase()}portfolio.com`
            },
            summary: `Motivated ${dept} Engineering student with strong foundation in software development. Experienced in building web applications and passionate about learning new technologies.`,
            education: [
              {
                degree: 'B.Tech in ' + dept,
                institution: 'College Name',
                year: `${2020 + year - 1} - ${2020 + year}`,
                gpa: (8.5 + i * 0.2).toFixed(2),
                achievements: ['Dean\'s List', 'Scholarship Recipient']
              }
            ],
            experience: i > 2 ? [{
              title: 'Software Development Intern',
              company: 'Tech Company',
              duration: '3 months',
              description: 'Developed web applications and worked on backend systems',
              achievements: ['Improved performance by 30%', 'Implemented new features']
            }] : [],
            skills: [
              {
                category: 'Programming Languages',
                items: ['Java', 'Python', 'JavaScript', 'C++']
              },
              {
                category: 'Web Technologies',
                items: ['React', 'Node.js', 'Express', 'MongoDB']
              },
              {
                category: 'Tools',
                items: ['Git', 'Docker', 'AWS', 'VS Code']
              }
            ],
            projects: [
              {
                name: 'E-commerce Platform',
                description: 'Full-stack web application for online shopping',
                technologies: ['React', 'Node.js', 'MongoDB'],
                link: `https://github.com/${name.first.toLowerCase()}/ecommerce`
              },
              {
                name: 'Task Management App',
                description: 'Collaborative task management tool',
                technologies: ['React', 'Firebase'],
                link: `https://github.com/${name.first.toLowerCase()}/taskmanager`
              }
            ],
            certifications: [
              {
                name: 'AWS Certified Developer',
                issuer: 'Amazon Web Services',
                date: '2023'
              },
              {
                name: 'Full Stack Web Development',
                issuer: 'Online Platform',
                date: '2023'
              }
            ],
            achievements: [
              'Won Hackathon 2023',
              'Published research paper',
              'Active contributor to open source'
            ],
            languages: [
              { language: 'English', proficiency: 'Fluent' },
              { language: 'Hindi', proficiency: 'Native' }
            ]
          },
          aiScore: 75 + (i * 2),
          jobMatchScores: i < 3 ? [{
            jobId: createdJobs[i]._id,
            matchPercentage: 80 + (i * 3),
            matchedSkills: ['Java', 'React', 'Node.js'],
            missingSkills: ['Docker']
          }] : []
        },
        { upsert: true, new: true }
      );

      // Create Interview Sessions for some students
      if (i < 6) {
        const interviewSession = await InterviewSession.create({
          userId: student._id,
          jobId: createdJobs[i % createdJobs.length]._id,
          roundType: 'Technical Interview',
          questions: [
            {
              question: 'Explain the concept of RESTful APIs',
              userAnswer: 'RESTful APIs are architectural style for designing web services that use HTTP methods to perform operations on resources.',
              aiFeedback: {
                score: 75 + (i * 3),
                strengths: ['Good understanding of concepts', 'Clear explanation'],
                improvements: ['Could add more examples', 'Mention HTTP status codes'],
                suggestedAnswer: 'RESTful APIs use standard HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs.',
                timestamp: new Date()
              },
              timestamp: new Date()
            },
            {
              question: 'What is the difference between SQL and NoSQL databases?',
              userAnswer: 'SQL databases are relational while NoSQL are non-relational and more flexible.',
              aiFeedback: {
                score: 70 + (i * 2),
                strengths: ['Basic understanding'],
                improvements: ['Provide more details', 'Give examples'],
                suggestedAnswer: 'SQL databases use structured schema and ACID properties, while NoSQL databases are schema-less and offer horizontal scalability.',
                timestamp: new Date()
              },
              timestamp: new Date()
            }
          ],
          overallScore: 72 + (i * 2.5),
          performanceMetrics: {
            communicationScore: 75 + (i * 2),
            technicalScore: 70 + (i * 3),
            confidenceScore: 75 + (i * 2),
            timeManagement: 70 + (i * 2)
          },
          aiRecommendations: [
            'Practice more technical questions',
            'Improve communication skills',
            'Work on time management'
          ],
          status: 'completed',
          completedAt: new Date()
        });
      }

      // Create Placement Predictions
      if (i < 5) {
        await PlacementPrediction.create({
          userId: student._id,
          jobId: createdJobs[i]._id,
          placementProbability: 75 + (i * 3),
          factors: {
            academicScore: 85 + (i * 2),
            interviewPerformance: 72 + (i * 2.5),
            resumeScore: 75 + (i * 2),
            skillsMatch: 80 + (i * 2),
            experienceLevel: 70 + (i * 3)
          },
          recommendations: [
            'Continue improving technical skills',
            'Practice more mock interviews',
            'Enhance project portfolio'
          ],
          predictedPackage: createdJobs[i].salary * 0.9,
          confidenceLevel: 75 + (i * 2)
        });
      }

      // Create Career DNA profiles
      if (i < 7) {
        await CareerDNA.create({
          userId: student._id,
          personality: {
            openness: 70 + (i * 3),
            conscientiousness: 75 + (i * 2),
            extraversion: 65 + (i * 2),
            agreeableness: 70 + (i * 2),
            neuroticism: 30 + (i * 2)
          },
          workStyle: {
            preferredEnvironment: i % 2 === 0 ? 'startup' : 'enterprise',
            collaborationPreference: i % 3 === 0 ? 'highly-collaborative' : 'moderate',
            pacePreference: i % 2 === 0 ? 'fast-paced' : 'moderate',
            workLocationPreference: i % 3 === 0 ? 'remote' : 'hybrid'
          },
          values: {
            workLifeBalance: 70 + (i * 2),
            innovation: 75 + (i * 2),
            stability: 60 + (i * 2),
            growthOpportunity: 80 + (i * 2),
            compensation: 70 + (i * 2),
            companyCulture: 75 + (i * 2)
          },
          communicationStyle: i % 2 === 0 ? 'direct' : 'balanced',
          careerTrajectory: {
            predictedPaths: [
              { path: 'Technical Lead', probability: 70 + (i * 2) },
              { path: 'Senior Developer', probability: 65 + (i * 2) },
              { path: 'Architect', probability: 60 + (i * 2) }
            ],
            preferredPath: 'Technical Lead'
          },
          insights: [
            {
              category: 'Work Style',
              insight: 'Prefers collaborative environments with moderate pace',
              confidence: 85
            },
            {
              category: 'Values',
              insight: 'Values innovation and growth opportunities',
              confidence: 80
            }
          ],
          analysisSource: {
            interviewSessions: [],
            resumeAnalysis: true,
            lastAnalyzed: new Date()
          }
        });
      }

      // Create Interventions
      if (i < 5) {
        await Intervention.create({
          userId: student._id,
          interventionType: i === 0 ? 'resume_improvement' : (i === 1 ? 'mock_interview' : 'skill_training'),
          description: i === 0 ? 'Improve resume with more projects and certifications' : 
                       (i === 1 ? 'Practice more mock interviews to improve confidence' : 'Learn new technologies to enhance skills'),
          projectedPRSDelta: 5 + (i * 2),
          status: i === 0 ? 'completed' : 'recommended',
          completedAt: i === 0 ? new Date() : undefined,
          createdAt: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000))
        });
      }

      // Add job applications to jobs
      if (i < 5) {
        await Job.findByIdAndUpdate(createdJobs[i]._id, {
          $push: {
            applicants: {
              studentId: student._id,
              currentRound: i === 0 ? 'HR Interview' : (i === 1 ? 'Technical Interview' : 'Aptitude Test'),
              roundStatus: i === 0 ? 'passed' : (i === 1 ? 'pending' : 'pending'),
              status: i === 0 ? 'hired' : (i === 1 ? 'interview' : 'applied'),
              appliedAt: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000))
            }
          }
        });
      }
    }
    console.log(`Created ${createdStudents.length} students with complete profiles`);

    // Create Placement Drives
    const drives = [
      {
        driveName: 'Google Campus Drive 2024',
        company: createdCompanies[0]._id,
        jobPostings: [createdJobs[0]._id],
        driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        venue: 'Main Auditorium',
        eligibilityCriteria: {
          departments: ['Computer', 'ECS', 'AIDS'],
          year: [4],
          minCGPA: 7.5
        },
        createdBy: tpo._id,
        status: 'upcoming',
        registeredStudents: createdStudents.slice(0, 3).map(s => s._id)
      },
      {
        driveName: 'Microsoft Recruitment Drive',
        company: createdCompanies[1]._id,
        jobPostings: [createdJobs[1]._id],
        driveDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        venue: 'Conference Hall',
        eligibilityCriteria: {
          departments: ['Computer', 'ECS'],
          year: [4],
          minCGPA: 7.0
        },
        createdBy: tpo._id,
        status: 'upcoming',
        registeredStudents: createdStudents.slice(1, 4).map(s => s._id)
      },
      {
        driveName: 'Infosys Campus Drive',
        company: createdCompanies[3]._id,
        jobPostings: [createdJobs[3]._id],
        driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        venue: 'Seminar Hall',
        eligibilityCriteria: {
          departments: ['Computer', 'ECS', 'AIDS', 'Civil', 'Mechanical'],
          year: [4, 3],
          minCGPA: 6.5
        },
        createdBy: tpo._id,
        status: 'upcoming',
        registeredStudents: createdStudents.slice(2, 6).map(s => s._id)
      }
    ];

    await PlacementDrive.insertMany(drives);
    console.log(`Created ${drives.length} placement drives`);

    // Create Notices
    const notices = [
      {
        sender: tpo._id,
        sender_role: 'tpo_admin',
        receiver_role: 'student',
        title: 'Upcoming Placement Drive',
        message: 'Google campus drive is scheduled for next week. All eligible students are requested to register.',
        createdAt: new Date()
      },
      {
        sender: tpo._id,
        sender_role: 'tpo_admin',
        receiver_role: 'student',
        title: 'Resume Submission Deadline',
        message: 'Last date to submit resumes for Microsoft drive is approaching. Please complete your resume soon.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        sender: mgmt._id,
        sender_role: 'management_admin',
        receiver_role: 'student',
        title: 'Important Announcement',
        message: 'All students are required to update their profiles and attendance records.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    await Notice.insertMany(notices);
    console.log(`Created ${notices.length} notices`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Super Admin: admin@cpms.com / admin123');
    console.log('TPO: tpo@cpms.com / tpo123');
    console.log('HOD: hod.computer@cpms.com / hod123 (or hod.{department}@cpms.com)');
    console.log('Management: management@cpms.com / mgmt123');
    console.log(`Students: student1@cpms.com to student${createdStudents.length}@cpms.com / student123`);
    console.log('\n📊 Data Created:');
    console.log(`- ${createdCompanies.length} Companies`);
    console.log(`- ${createdJobs.length} Jobs`);
    console.log(`- ${createdStudents.length} Students (with complete profiles, resumes, PRS, interviews, predictions, career DNA)`);
    console.log(`- ${drives.length} Placement Drives`);
    console.log(`- ${notices.length} Notices`);
    console.log('- Interview Sessions, Placement Predictions, Career DNA Profiles, Interventions');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
