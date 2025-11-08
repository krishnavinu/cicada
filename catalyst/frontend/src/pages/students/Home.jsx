import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoticeBox from '../../components/NoticeBox';
import NotificationBox from '../../components/Students/NotificationBox';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// student 
function Home() {
  // Set the page title
  document.title = 'catalyst | Student Dashboard';

  const [resumeStatus, setResumeStatus] = useState({ loading: true, exists: false, complete: false });

  useEffect(() => {
    checkResumeStatus();
  }, []);

  const checkResumeStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/resume/get`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.resume) {
        const resume = response.data.resume;
        const hasPersonalInfo = resume.sections?.personalInfo?.fullName && resume.sections?.personalInfo?.email;
        const hasEducation = resume.sections?.education && resume.sections.education.length > 0;
        const hasSkills = resume.sections?.skills && resume.sections.skills.length > 0;
        
        setResumeStatus({
          loading: false,
          exists: true,
          complete: hasPersonalInfo && (hasEducation || hasSkills)
        });
      } else {
        setResumeStatus({ loading: false, exists: false, complete: false });
      }
    } catch (error) {
      setResumeStatus({ loading: false, exists: false, complete: false });
    }
  };

  return (
    <>
      {/* Enhanced Resume Builder Prompt */}
      {!resumeStatus.loading && (!resumeStatus.exists || !resumeStatus.complete) && (
        <div 
          className="mb-6 p-6 border-2 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 animate-fadeInDown card-hover relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1) 0%, rgba(var(--color-secondary-rgb), 0.1) 100%)`,
            borderColor: 'var(--color-primary)',
            color: 'var(--color-text)'
          }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <i className="fa-solid fa-file-alt text-white text-2xl"></i>
              </div>
              <div>
                <h3 
                  className="text-xl font-bold transition-colors duration-300"
                  style={{ color: 'var(--color-text)' }}
                >
                  {!resumeStatus.exists ? 'Create Your Resume' : 'Complete Your Resume'}
                </h3>
                <p 
                  className="text-sm mt-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {!resumeStatus.exists 
                    ? 'Your resume has been created automatically! Fill it out to start applying for jobs.'
                    : 'Your resume is incomplete. Complete it to improve your job applications.'}
                </p>
              </div>
            </div>
            <Link
              to="/student/resume-builder"
              className="relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {!resumeStatus.exists ? 'Create Resume' : 'Complete Resume'}
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeInUp`}>
        <div className="transform transition-all duration-500 hover:scale-105">
          <NotificationBox />
        </div>
        <div className="transform transition-all duration-500 hover:scale-105">
          <NoticeBox />
        </div>
      </div>
    </>
  );
}

export default Home
