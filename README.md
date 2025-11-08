# 🚀 catalyst

**was.is.will be.for students**

A cutting-edge, AI-powered placement management platform designed to revolutionize campus recruitment and student career development.

---

## 🎯 Project Title
**catalyst** - AI-Powered College Placement Management Portal

## 📌 Chosen Problem Statement
**Problem Statement 2: College Placement Management Portal**

Traditional college placement management systems face numerous challenges in efficiently managing the entire placement lifecycle. Manual processes, lack of real-time insights, and limited student support tools create bottlenecks in the placement process. catalyst addresses these challenges by providing a comprehensive, AI-powered solution that streamlines placement operations, enhances student readiness, and empowers institutions with data-driven insights.

### Key Problems Addressed:

1. **Inefficient Manual Processes**: Traditional systems require extensive manual work for job postings, application management, and interview scheduling, leading to delays and errors.

2. **Lack of Student Readiness Assessment**: Students struggle to understand their placement readiness and receive personalized guidance to improve their chances of placement.

3. **Limited Predictive Analytics**: Both students and institutions lack insights into placement probabilities and trends, making it difficult to make informed decisions.

4. **Fragmented Communication**: Communication between TPOs, students, and companies is scattered, leading to missed opportunities and coordination issues.

5. **No AI-Powered Career Guidance**: Students lack access to intelligent tools for interview preparation, resume optimization, and career path recommendations.

6. **Inadequate Reporting & Analytics**: Institutions struggle with generating comprehensive reports and analyzing placement data for strategic decision-making.

### Our Solution:
catalyst provides an all-in-one, AI-powered placement management platform that automates workflows, offers predictive analytics, delivers personalized career guidance, and enhances overall placement efficiency through advanced AI tools and modern web technologies.

---

## 📋 Table of Contents

- [Project Title](#-project-title)
- [Chosen Problem Statement](#-chosen-problem-statement)
- [Introduction](#-introduction)
- [Team Members & Roles](#-team-members--roles)
- [AI Tools Used](#-ai-tools-used)
- [Setup and Run Instructions](#-setup-and-run-instructions)
- [Key Features](#-key-features)
  - [UI/UX Enhancements](#-uiux-enhancements)
  - [Core Features](#core-features)
  - [AI-Powered Features](#ai-powered-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Installation](#-installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Design & UI/UX Features](#-design--uiux-features)
  - [Landing Page Enhancements](#landing-page-enhancements)
  - [Design System Components](#design-system-components)
  - [Recent Improvements](#recent-improvements)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Introduction

**catalyst** is a comprehensive, AI-driven placement management system that streamlines the entire campus recruitment process. Built with modern web technologies and powered by advanced AI, catalyst empowers educational institutions to manage placements efficiently while providing students with personalized career guidance and opportunities.

### Why catalyst?

- 🤖 **AI-Powered Insights**: Leverage advanced AI for interview simulation, placement prediction, and career matching
- 📊 **Data-Driven Decisions**: Comprehensive analytics and reporting for administrators
- 🎨 **Modern UI/UX**: Beautiful, responsive interface with glassmorphic design, custom animations, and theme-aware components
- 🎭 **Enhanced Landing Page**: Engaging pre-login experience with features showcase, stats, testimonials, and interactive demos
- 🔒 **Secure & Scalable**: Built with security best practices and scalable architecture
- 🚀 **All-in-One Platform**: Complete solution from job posting to offer letter management
- ✨ **Custom Design System**: Reusable UI components with Tailwind CSS, Framer Motion animations, and glassmorphic effects

---

## 👥 Team Members & Roles

| Name | Role | Key Responsibilities |
|------|------|---------------------|
| **M Krishna Prasad** | Backend Developer | • Backend API development & architecture<br>• Database design & MongoDB optimization<br>• AI integration with Groq API<br>• Server-side logic & middleware<br>• API endpoints & routing<br>• Authentication & authorization |
| **Aadishesh Gopal Padasalgi** | Frontend Developer | • React.js frontend development<br>• UI/UX design & implementation<br>• Theme system & animations<br>• Component development<br>• User interface optimization<br>• State management & routing |
| **Kshitij H** | Full-Stack Developer | • Feature development & integration<br>• API integration & testing<br>• Component development<br>• Bug fixes & optimization<br>• Cross-functional development<br>• End-to-end feature implementation |
| **Ganesh C** | UI/UX Designer & Developer | • UI/UX design & wireframing<br>• Frontend component styling<br>• Theme customization<br>• User interface enhancements<br>• Design system implementation<br>• User experience optimization |

---

## 🤖 AI Tools Used

### Groq API with Llama 3.3 70B Versatile Model

catalyst leverages **Groq API** powered by **Llama 3.3 70B Versatile** for all AI-powered features. Groq provides ultra-fast inference capabilities with minimal latency, making it ideal for real-time AI interactions in our placement management platform.

#### Why Groq API?

- ⚡ **Ultra-Fast Inference**: Sub-second response times enable real-time AI interactions
- 💰 **Cost-Effective**: Efficient API pricing suitable for educational and hackathon use
- 🔒 **No Model Training Required**: Uses pre-trained models (inference only, no training needed)
- 🚀 **Scalable**: Handles multiple concurrent requests efficiently
- 🎯 **High Accuracy**: Llama 3.3 70B provides excellent results for complex AI tasks
- 🌐 **Easy Integration**: Simple API integration with comprehensive documentation

#### AI Features Implemented:

1. **🎤 AI Interview Simulator**
   - **Purpose**: Help students practice interviews with AI-generated questions
   - **AI Functionality**: 
     - Generates context-aware interview questions based on job requirements
     - Provides real-time feedback on student answers
     - Analyzes communication skills, technical knowledge, and problem-solving abilities
     - Generates personalized improvement recommendations
   - **Technology**: Groq API (Llama 3.3 70B) for question generation and answer analysis

2. **📈 Placement Prediction**
   - **Purpose**: Predict student placement probability for specific jobs
   - **AI Functionality**: 
     - Analyzes student profile, resume, academic performance, and interview history
     - Predicts placement chances with confidence levels
     - Estimates salary package based on profile and job requirements
     - Provides factor breakdown and actionable recommendations
   - **Technology**: Groq API for predictive analysis and factor breakdown

3. **🎯 Placement Readiness Score (PRS)**
   - **Purpose**: Calculate comprehensive readiness score for students
   - **AI Functionality**: 
     - Analyzes multiple factors (academics, skills, attendance, achievements) using weighted formula
     - Provides AI-powered insights on contributing factors
     - Tracks PRS changes over time
     - Generates detailed breakdown and improvement suggestions
   - **Technology**: Groq API for factor analysis and score calculation

4. **🧬 Career DNA Profiler**
   - **Purpose**: Analyze student personality, work style, and values for career matching
   - **AI Functionality**: 
     - Personality trait analysis using Big Five model
     - Work style preferences identification (environment, collaboration, pace, location)
     - Values assessment and priorities identification
     - Career trajectory prediction with probability scores
   - **Technology**: Groq API for deep personality and career analysis

5. **💼 Culture Match Engine**
   - **Purpose**: Match students with companies based on culture compatibility
   - **AI Functionality**: 
     - Analyzes company culture and values
     - Compares student values with company culture
     - Provides compatibility scores and alignment insights
     - Helps students find companies that align with their values
   - **Technology**: Groq API for culture analysis and matching algorithms

6. **🔧 Intervention Engine**
   - **Purpose**: Recommend personalized interventions to improve placement readiness
   - **AI Functionality**: 
     - Suggests targeted interventions based on student profile
     - Simulates "what-if" scenarios for different interventions
     - Projects PRS changes based on intervention implementation
     - Prioritizes interventions based on impact and feasibility
   - **Technology**: Groq API for intervention recommendation and simulation

7. **📝 Resume Builder (AI-Enhanced)**
   - **Purpose**: Help students create optimized, ATS-friendly resumes
   - **AI Functionality**: 
     - Content suggestions for resume sections
     - Resume quality scoring and ATS optimization
     - Keyword extraction and optimization
     - Skill and achievement suggestions
   - **Technology**: Groq API for resume analysis and optimization

8. **🔍 Semantic Job Matching**
   - **Purpose**: Match students with relevant job opportunities
   - **AI Functionality**: 
     - Semantic keyword extraction from job descriptions
     - Concept-based similarity scoring
     - Personalized job recommendations
     - Skill gap analysis
   - **Technology**: Groq API for semantic analysis and matching

9. **📧 AI Email Generator**
   - **Purpose**: Generate professional email templates for notifications
   - **AI Functionality**: 
     - Context-aware email generation for interviews, offers, rejections, and notices
     - Maintains professional tone and formatting
     - Customizes content based on context
   - **Technology**: Groq API for natural language email generation

10. **📄 Resume Parser (AI)**
    - **Purpose**: Extract structured data from PDF resumes
    - **AI Functionality**: 
      - PDF parsing and text extraction
      - Structured data conversion to JSON
      - Skills, experience, and education extraction
      - ATS-compatible format conversion
    - **Technology**: Groq API combined with pdf-parse for resume data extraction

---

## 🚀 Setup and Run Instructions

### Prerequisites

Before starting, ensure you have the following installed:
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **MongoDB**: v6.0 or higher ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud database)
- **Groq API Key**: [Get your free API key](https://console.groq.com/)
- **Cloudinary Account**: [Sign up for free](https://cloudinary.com/) (for file storage)
- **Gmail/SMTP Account**: For email services (optional but recommended)

### Quick Start (5 Minutes)

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd catalyst
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file in `backend/` directory:
   ```env
   PORT=4518
   MONGODB_URL=mongodb://localhost:27017/catalyst_db
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GROQ_API_KEY=your_groq_api_key
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```
   
   Start the backend server:
   ```bash
   npm start
   ```
   Backend will run on `http://localhost:4518`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   
   Create `.env` file in `frontend/` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:4518
   ```
   
   Start the frontend development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Seed Dummy Data (Optional)**
   ```bash
   cd backend
   npm run seed
   ```
   This will create sample users, companies, and jobs for testing.

5. **Access the Application**
   - Open your browser and navigate to: `http://localhost:5173`
   - Register as a student or login with seeded credentials

### Getting API Keys

#### Groq API Key (Required for AI Features)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

#### Cloudinary (Required for File Uploads)
1. Visit [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy `Cloud Name`, `API Key`, and `API Secret` to your `.env` file

#### MongoDB (Choose one)
- **Local MongoDB**: Install MongoDB locally and use `mongodb://localhost:27017/catalyst_db`
- **MongoDB Atlas**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and use the connection string

### Troubleshooting

- **Backend won't start**: Check if MongoDB is running and `.env` file is configured correctly
- **Frontend can't connect**: Verify `VITE_BACKEND_URL` in frontend `.env` matches backend URL
- **AI features not working**: Ensure `GROQ_API_KEY` is set correctly in backend `.env`
- **File uploads failing**: Check Cloudinary credentials in backend `.env`

For detailed setup instructions, see the [Installation](#-installation) section below.

---

## ✨ Key Features

### 🎨 UI/UX Enhancements

#### Modern Landing Page
- **Enhanced Hero Section**: Animated background with gradient mesh, floating orbs, and particles
- **Features Showcase**: Interactive feature cards with glassmorphic design and hover effects
- **Statistics Section**: Animated counters showing platform metrics (students, companies, placement rate, satisfaction)
- **Demo/Preview Section**: Interactive tabbed interface showcasing platform features
- **Testimonials Carousel**: Auto-rotating testimonials with smooth animations
- **Enhanced About Section**: Role-based cards with gradient effects and animations
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)

#### Design System
- **Glassmorphic Components**: Reusable glass cards with backdrop blur and transparency effects
- **Custom Animations**: Framer Motion animations for smooth transitions and micro-interactions
- **Theme-Aware Components**: All components adapt to light/dark themes using CSS variables
- **Tailwind CSS Integration**: Custom utility classes, gradients, shadows, and animations
- **Animated Backgrounds**: Particle effects, mesh gradients, and floating orbs
- **Enhanced Input Fields**: Improved text visibility, focus states, and placeholder styling

#### Login Pages
- **Consistent Design**: Unified design across all login pages (Student, TPO, Management, HOD, Super Admin)
- **Enhanced Animations**: Gradient text, animated underlines, shimmer effects
- **Improved UX**: Better input field styling, error messages, and loading states
- **Accessibility**: High contrast text, clear focus indicators, and proper form validation

### Core Features

#### 👨‍🎓 Student Portal
- **Profile Management**: Complete profile with academic details, skills, and achievements
- **Resume Builder**: Drag-and-drop resume builder with multiple professional templates and AI suggestions
- **Job Applications**: Browse, search, and apply for job opportunities
- **Application Tracking**: Real-time status updates for all applications
- **Placement Drives**: Register and participate in campus placement drives
- **Internship Management**: Track and manage internship applications
- **Publications**: Add research papers and publications with weightage
- **Notifications**: Real-time notifications for new jobs, interviews, and updates
- **Enhanced Dashboard**: Modern dashboard with animated cards, statistics, and quick actions

#### 👔 TPO Admin Portal
- **Job Management**: Post, edit, and manage job listings with rich text editor
- **Application Review**: Review and manage student applications
- **Interview Scheduling**: Schedule and manage interview rounds
- **Offer Letters**: Upload and manage offer letters
- **Placement Drives**: Create and manage placement drives
- **Email Generation**: AI-powered email templates for notifications
- **Resume Filtering**: AI-assisted resume screening with match scores
- **Reports**: Generate comprehensive placement reports
- **Enhanced Forms**: Modern form components with validation and error handling

#### 🏛️ Management Portal
- **Analytics Dashboard**: Visual analytics and insights
- **Department Reports**: Department-wise placement statistics
- **Student Reports**: Individual student performance reports
- **Offer Reports**: Comprehensive offer and package analytics
- **Export Reports**: Export reports as Excel or PDF
- **System Monitoring**: Monitor overall system health and usage

#### 👑 Super Admin Portal
- **User Management**: Create and manage TPO and Management users
- **System Configuration**: Configure system-wide settings
- **Role Management**: Manage user roles and permissions
- **Full System Access**: Complete administrative control

#### 🎓 HOD (Head of Department) Portal
- **Department Overview**: View department-specific placement data
- **Student Approval**: Approve student profiles for placement
- **Department Reports**: Access department-wise analytics
- **Student Management**: Manage students within the department

### AI-Powered Features

#### 🎤 AI Interview Simulator
- **Real-Time Practice**: Practice interviews with AI-powered questions
- **Instant Feedback**: Get immediate feedback on answers
- **Performance Metrics**: Detailed analysis of communication, technical, and problem-solving skills
- **Recommendations**: Personalized improvement suggestions
- **Session History**: Track and review past interview sessions

#### 📈 Placement Prediction
- **Probability Analysis**: AI-powered placement probability prediction
- **Factor Breakdown**: Detailed analysis of contributing factors
- **Package Prediction**: Predicted salary package estimation
- **Recommendations**: Actionable recommendations to improve placement chances
- **Historical Tracking**: Track predictions over time

#### 🎯 Placement Readiness Score (PRS)
- **Comprehensive Scoring**: Multi-factor readiness assessment
- **Contributing Factors**: Detailed breakdown of PRS components
- **Attendance Tracking**: Integration with attendance data
- **Academic Performance**: GPA and academic achievements consideration
- **Skill Assessment**: Technical and soft skills evaluation
- **Progress Tracking**: Monitor PRS improvements over time

#### 🧬 Career DNA Profiler
- **Personality Analysis**: Deep personality trait analysis
- **Work Style Preferences**: Environment, collaboration, and pace preferences
- **Values Assessment**: Core values and priorities identification
- **Career Trajectory**: Predicted career paths and probabilities
- **Key Insights**: Actionable career insights and recommendations

#### 💼 Culture Match Engine
- **Company Culture Analysis**: Analyze company culture and values
- **Compatibility Scoring**: Match students with companies based on culture fit
- **Values Alignment**: Compare student values with company culture
- **Work Style Matching**: Match work preferences with company environment

#### 🔧 Intervention Engine
- **What-If Simulations**: Simulate impact of different interventions
- **PRS Projections**: Predict PRS changes based on interventions
- **Recommendations**: Personalized intervention recommendations
- **Priority Ranking**: Prioritized intervention suggestions
- **Progress Tracking**: Track intervention implementation and results

#### 📝 Resume Builder (AI-Enhanced)
- **Multiple Templates**: Modern, professional, classic, and creative templates
- **Drag & Drop**: Intuitive drag-and-drop interface
- **AI Suggestions**: AI-powered content suggestions
- **ATS Optimization**: ATS-friendly resume formatting
- **Resume Scoring**: AI-powered resume quality scoring
- **PDF Export**: Professional PDF export
- **Direct Job Submission**: Submit resumes directly to job postings

#### 🔍 Semantic Job Matching
- **AI-Powered Matching**: Advanced semantic matching algorithm
- **Keyword Extraction**: Intelligent keyword and concept extraction
- **Similarity Scoring**: Match score based on profile and job requirements
- **Personalized Recommendations**: Job recommendations based on profile
- **Skill Gap Analysis**: Identify missing skills for specific jobs

#### 📧 AI Email Generator
- **Template Generation**: AI-generated email templates
- **Multiple Types**: Interview, offer, rejection, and notice emails
- **Customization**: Personalized email content
- **Professional Tone**: Maintain professional communication standards

#### 📄 Resume Parser (AI)
- **PDF Parsing**: Extract data from PDF resumes
- **Structured Data**: Convert resumes to structured JSON
- **ATS Integration**: Parse resumes for ATS compatibility
- **Data Extraction**: Extract skills, experience, education automatically

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18.3+
- **Build Tool**: Vite 5.4+
- **Routing**: React Router DOM 6.26+
- **Styling**: 
  - Tailwind CSS 3.4+ (with custom components and animations)
  - Bootstrap 5.3+
  - Custom Theme System with CSS variables
  - Glassmorphic design components
- **Animations**: Framer Motion 11.0+ (smooth transitions and micro-interactions)
- **State Management**: React Context API
- **HTTP Client**: Axios 1.7+
- **UI Components**: 
  - React Bootstrap 2.10+
  - React Icons 5.3+
  - Custom UI Components (GlassCard, AnimatedBackground, Button, Card, Input, Skeleton, EmptyState)
- **Charts**: Recharts 3.3+
- **Drag & Drop**: React DnD 16.0+
- **PDF Generation**: jsPDF 3.0+, html2canvas 1.4+
- **Print**: react-to-print 3.2+
- **Editor**: Jodit React 3.0+ (rich text editor)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.20+
- **Database**: MongoDB with Mongoose 8.5+
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer 6.10+
- **AI Integration**: Groq SDK 0.34+ (Llama 3.3 70B)
- **PDF Processing**: 
  - Puppeteer 24.29+ (PDF generation)
  - pdf-parse 2.4+ (PDF parsing)
- **Excel Export**: ExcelJS 4.4+
- **File Upload**: Multer 1.4+
- **Security**: bcrypt 5.1+, express-rate-limit 8.2+

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes
- **Version Control**: Git
- **Package Manager**: npm

---

## 📁 Project Structure

```
catalyst/
├── frontend/
│   ├── public/
│   │   ├── catalyst.svg
│   │   └── ...
│   ├── src/
│   │   ├── assets/
│   │   │   ├── catalyst.png
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── AITools/
│   │   │   │   ├── EmailGenerator.jsx
│   │   │   │   └── ResumeFilter.jsx
│   │   │   ├── Analytics/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── CareerDNA/
│   │   │   │   ├── CareerDNADashboard.jsx
│   │   │   │   └── CultureMatch.jsx
│   │   │   ├── Intervention/
│   │   │   │   └── InterventionEngine.jsx
│   │   │   ├── InterviewSimulator/
│   │   │   │   └── InterviewSimulator.jsx
│   │   │   ├── LandingPages/
│   │   │   │   ├── LandNavbar.jsx
│   │   │   │   ├── LandHeroPage.jsx
│   │   │   │   ├── LandAbout.jsx
│   │   │   │   ├── LandFeatures.jsx
│   │   │   │   ├── LandStats.jsx
│   │   │   │   ├── LandDemo.jsx
│   │   │   │   ├── LandTestimonials.jsx
│   │   │   │   └── LandFooter.jsx
│   │   │   ├── UI/
│   │   │   │   ├── AnimatedBackground.jsx
│   │   │   │   ├── GlassCard.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   ├── PlacementDrive/
│   │   │   │   ├── CreateDrive.jsx
│   │   │   │   ├── DriveList.jsx
│   │   │   │   └── DriveDetails.jsx
│   │   │   ├── PredictiveAnalytics/
│   │   │   │   └── PredictiveDashboard.jsx
│   │   │   ├── PRS/
│   │   │   │   └── PRSDashboard.jsx
│   │   │   ├── Reports/
│   │   │   │   ├── DepartmentReport.jsx
│   │   │   │   ├── OfferReport.jsx
│   │   │   │   └── StudentReport.jsx
│   │   │   ├── ResumeBuilder/
│   │   │   │   ├── ResumeBuilder.jsx
│   │   │   │   ├── ResumeEditor.jsx
│   │   │   │   ├── ResumePreview.jsx
│   │   │   │   ├── TemplateSelector.jsx
│   │   │   │   ├── AISuggestions.jsx
│   │   │   │   └── DraggableSection.jsx
│   │   │   ├── Students/
│   │   │   │   ├── SidebarData.jsx
│   │   │   │   └── NotificationBox.jsx
│   │   │   ├── TPO/
│   │   │   │   └── SidebarData.jsx
│   │   │   ├── Management/
│   │   │   │   └── SidebarData.jsx
│   │   │   ├── HOD/
│   │   │   │   └── SidebarData.jsx
│   │   │   ├── SuperUser/
│   │   │   │   └── SidebarData.jsx
│   │   │   ├── Tutorial/
│   │   │   │   └── OnboardingGuide.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Submenu.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── userContext.jsx
│   │   │   └── themeContext.jsx
│   │   ├── pages/
│   │   │   ├── students/
│   │   │   ├── tpo/
│   │   │   ├── management/
│   │   │   ├── hod/
│   │   │   ├── admin/
│   │   │   └── LandingPage.jsx
│   │   ├── style/
│   │   │   └── index.css
│   │   ├── utility/
│   │   │   └── auth.utility.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── ...
├── backend/
│   ├── config/
│   │   ├── MongoDB.js
│   │   ├── Cloudinary.js
│   │   └── Groq.js
│   ├── controllers/
│   │   ├── AI/
│   │   │   ├── interview-simulator.controller.js
│   │   │   ├── predictive-analytics.controller.js
│   │   │   ├── resume-parser.controller.js
│   │   │   ├── resume-filter.controller.js
│   │   │   ├── email-generator.controller.js
│   │   │   └── summarize-results.controller.js
│   │   ├── Analytics/
│   │   │   └── dashboard.controller.js
│   │   ├── PlacementDrive/
│   │   │   └── placementDrive.controller.js
│   │   ├── Reports/
│   │   │   └── reports.controller.js
│   │   ├── ResumeBuilder/
│   │   │   └── resume.controller.js
│   │   ├── Student/
│   │   │   ├── login.controller.js
│   │   │   └── signup.controller.js
│   │   └── User/
│   │       └── tutorial.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   ├── company.model.js
│   │   ├── resume.model.js
│   │   ├── placementDrive.model.js
│   │   ├── interviewSession.model.js
│   │   ├── placementPrediction.model.js
│   │   └── ...
│   ├── routes/
│   │   ├── student.route.js
│   │   ├── tpo.route.js
│   │   ├── management.route.js
│   │   ├── hod.route.js
│   │   ├── user.route.js
│   │   ├── ai.route.js
│   │   ├── resume.route.js
│   │   ├── analytics.route.js
│   │   ├── reports.route.js
│   │   └── placementDrive.route.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── .env
│   ├── index.js
│   └── package.json
├── docker-compose.yaml
├── kubernetes/
│   └── ...
└── README.md
```

---

## 👥 User Roles

### 🎓 Student
- Register and complete profile
- Build and manage resumes
- Browse and apply for jobs
- Track application status
- Participate in placement drives
- Use AI Interview Simulator
- View placement predictions
- Monitor PRS (Placement Readiness Score)
- Access intervention recommendations
- View Career DNA profile
- Check culture match with companies
- Add publications and research papers

### 👔 TPO (Training & Placement Officer)
- Post and manage job listings
- Review student applications
- Schedule interviews
- Upload offer letters
- Create placement drives
- Generate AI email templates
- Filter resumes using AI
- View analytics and reports
- Manage company information
- Track placement statistics

### 🏛️ Management
- Access analytics dashboard
- View department-wise reports
- Generate student reports
- View offer reports
- Export reports (Excel/PDF)
- Monitor system performance
- Access comprehensive analytics
- View placement trends

### 🎓 HOD (Head of Department)
- Approve student profiles
- View department-specific data
- Access department reports
- Manage department students
- Monitor department placements

### 👑 Super Admin
- Create and manage users
- Configure system settings
- Manage roles and permissions
- Full system access
- System monitoring

---

## 🚀 Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0 or higher (local or Atlas)
- **Cloudinary Account**: For file storage
- **Groq API Key**: For AI features ([Get your API key](https://console.groq.com/))
- **Email Service**: Gmail or any SMTP service

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```env
   PORT=4518
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GROQ_API_KEY=your_groq_api_key
   SMTP_USER=your_email_id
   SMTP_PASS=your_app_password
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:4518`

5. **Seed dummy data (optional)**:
   ```bash
   npm run seed
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```env
   VITE_BACKEND_URL=http://localhost:4518
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will run on `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=4518

# Database
MONGODB_URL=mongodb://localhost:27017/catalyst_db
# OR for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/catalyst_db

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq AI (For AI Features)
GROQ_API_KEY=your_groq_api_key

# Email Service (Nodemailer)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env)

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:4518
```

---

## 📖 Usage

### Getting Started

1. **Start MongoDB** (if using local instance):
   ```bash
   mongod
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm start
   ```

3. **Start Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the Application**:
   - Open `http://localhost:5173` in your browser
   - Register as a student or login with existing credentials

### Default Login Credentials

After running the seed script, you can use:

- **Student**: Use the credentials created during registration
- **TPO**: Check seed data for TPO credentials
- **Management**: Check seed data for Management credentials
- **HOD**: 
  - Email: `hod@cpms.com`
  - Password: `hod123`
- **Super Admin**: 
  - Email: `admin@cpms.com`
  - Password: `admin123`

### Creating HOD User

If HOD login is not working, you can create a HOD user by running:
```bash
cd backend
node scripts/createHODUser.js
```

This will create/update a HOD user with the credentials above.

### Key Workflows

#### Student Workflow
1. Register/Login
2. Complete profile
3. Build resume using Resume Builder
4. Browse job listings
5. Apply for jobs
6. Use AI Interview Simulator for practice
7. Check Placement Prediction
8. Monitor PRS Dashboard
9. Follow Intervention recommendations
10. View Career DNA profile

#### TPO Workflow
1. Login to TPO portal
2. Post job listings
3. Review applications
4. Schedule interviews
5. Upload offer letters
6. Create placement drives
7. Generate reports
8. Use AI email generator

---

## 🐳 Deployment

### Docker Deployment

1. **Build and run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

2. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:4518`

### Kubernetes Deployment

Refer to the `kubernetes/` directory for Kubernetes deployment manifests.

---

## 🎨 Design & UI/UX Features

### Landing Page Enhancements

#### Hero Section
- Animated gradient background with floating orbs and particles
- Gradient text animation for brand name
- Email signup form with enhanced styling
- Feature highlights with badges (AI-Powered, Fast & Easy, 100% Free, Secure)
- Smooth scroll indicators and call-to-action buttons

#### Features Section
- 8 feature cards showcasing platform capabilities
- Glassmorphic card design with hover effects
- Gradient icons and animated transitions
- Responsive grid layout (1/2/4 columns)
- Call-to-action section with gradient buttons

#### Statistics Section
- Animated counters (10,000+ Students, 500+ Companies, 85% Placement Rate, 95% Satisfaction)
- Smooth counting animations with easing
- Progress bars with gradient fills
- Glass cards with hover effects

#### Demo/Preview Section
- Interactive tabbed interface (Resume Builder, Interview Simulator, Analytics Dashboard, Job Marketplace)
- Mock previews with floating elements
- Feature lists with checkmark icons
- Smooth transitions between tabs

#### Testimonials Section
- Auto-rotating carousel (4 testimonials)
- Star ratings display
- Navigation arrows and dot indicators
- Smooth slide animations
- Glass cards with gradients

### Design System Components

#### Custom UI Components
- **GlassCard**: Glassmorphic card with hover effects, glow, and gradient borders
- **AnimatedBackground**: Particle effects, mesh gradients, and floating orbs
- **Button**: Reusable button with variants, loading states, and icons
- **Card**: Glassmorphic card with hover effects and variants
- **Input**: Enhanced input with focus states, password toggle, and error handling
- **Skeleton**: Loading skeleton for various content types
- **EmptyState**: Empty state component for displaying when no data is available

#### Animation System
- **Framer Motion**: Smooth transitions, hover effects, and entrance animations
- **Custom Keyframes**: Shimmer, gradient shift, glow pulse, particle float, mesh gradient
- **Tailwind Animations**: Float, bounce, scale, slide, ripple effects
- **Performance Optimized**: Using `whileInView` and `once` triggers for efficient rendering

#### Theme System
- **CSS Variables**: Theme-aware colors using `var(--color-primary)`, `var(--color-text)`, etc.
- **Light/Dark Theme Support**: All components adapt to theme changes
- **Consistent Color Palette**: Unified color scheme across all pages
- **Accessibility**: High contrast ratios and proper color combinations

### Recent Improvements

#### Login Pages
- ✅ Unified design across all login pages (Student, TPO, Management, HOD, Super Admin)
- ✅ Enhanced animated backgrounds with gradient mesh and particles
- ✅ Improved input field styling with better text visibility
- ✅ Gradient buttons with shimmer effects
- ✅ Smooth animations and transitions
- ✅ Responsive design for all screen sizes

#### Form Improvements
- ✅ Fixed text visibility issues in input fields
- ✅ Enhanced placeholder styling
- ✅ Better error message display
- ✅ Improved focus states and validation feedback
- ✅ Consistent styling across all forms

#### Component Enhancements
- ✅ Glassmorphic design system implementation
- ✅ Custom Tailwind components and utilities
- ✅ Framer Motion animations integration
- ✅ Theme-aware component styling
- ✅ Improved loading states and error handling

## 🙏 Acknowledgments

We would like to express our gratitude to the following platforms, tools, and services that made this project possible:

### AI Platforms & Tools
- **Groq** for providing ultra-fast AI inference capabilities with Llama 3.3 70B model
- **Google Gemini** for inspiring advanced AI reasoning and multimodal capabilities
- **OpenAI ChatGPT** for groundbreaking conversational AI and language understanding
- **Anthropic Claude** for advanced AI safety and reasoning capabilities
- **AWS Bedrock** for comprehensive AI model access and enterprise-grade AI infrastructure
- **Llama Models (Meta)** for open-source large language models powering AI features

### Cloud & Infrastructure
- **Cloudinary** for reliable cloud-based file storage and image processing
- **MongoDB** for robust NoSQL database solutions and data management
- **MongoDB Atlas** for scalable cloud database hosting

### Development Tools & Libraries
- **React.js** for building modern, interactive user interfaces
- **Node.js** for server-side JavaScript runtime
- **Express.js** for robust backend API framework
- **Tailwind CSS** for utility-first CSS framework and custom design system
- **Bootstrap** for responsive UI components
- **Framer Motion** for smooth animations and micro-interactions
- **React Router DOM** for client-side routing
- **Axios** for HTTP client requests

### Design Inspiration
- **Glassmorphism Design**: Modern glassmorphic UI trends
- **Neumorphism**: Soft UI design principles
- **Material Design**: Google's material design guidelines
- **Modern Web Design**: Contemporary web design patterns and best practices

### Open Source Community
- All open-source contributors and library maintainers
- The JavaScript and web development community
- Educational institutions and students who inspire innovation

---

**Made with ❤️ for students**

**catalyst** - *was.is.will be.for students*
