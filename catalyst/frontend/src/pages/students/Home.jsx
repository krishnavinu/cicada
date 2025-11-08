import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NoticeBox from '../../components/NoticeBox';
import NotificationBox from '../../components/Students/NotificationBox';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import AnimatedBackground from '../../components/UI/AnimatedBackground';
import GlassCard from '../../components/UI/GlassCard';
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
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <AnimatedBackground variant="default" intensity="medium" />
      
      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Enhanced Resume Builder Prompt with Custom Components */}
        <AnimatePresence>
          {!resumeStatus.loading && (!resumeStatus.exists || !resumeStatus.complete) && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="mb-6 sm:mb-8"
            >
              <GlassCard
                hoverable={true}
                glow={true}
                gradient={true}
                className="p-6 sm:p-8"
              >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                <div className="flex items-center gap-4 md:gap-6 flex-1">
                  <motion.div
                    className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl p-4 sm:p-5 shadow-lg ring-4 ring-blue-100/50 hover:ring-blue-200/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 12 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <i className="fa-solid fa-file-alt text-white text-2xl sm:text-3xl"></i>
                  </motion.div>
                  <div className="flex-1">
                    <h3
                      className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    >
                      {!resumeStatus.exists ? 'Create Your Resume' : 'Complete Your Resume'}
                    </h3>
                    <p
                      className="text-sm sm:text-base text-gray-600 leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {!resumeStatus.exists
                        ? 'Your resume has been created automatically! Fill it out to start applying for jobs.'
                        : 'Your resume is incomplete. Complete it to improve your job applications.'}
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-auto"
                >
                  <Link to="/student/resume-builder" className="block">
                    <Button
                      variant="primary"
                      icon={<i className="fa-solid fa-arrow-right"></i>}
                      iconPosition="right"
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-glow-lg transition-all duration-300"
                    >
                      {!resumeStatus.exists ? 'Create Resume' : 'Complete Resume'}
                    </Button>
                  </Link>
                </motion.div>
              </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Dashboard Cards Grid with Custom Components */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="floating-card"
          >
            <div className="glow-border">
              <NotificationBox />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
            className="floating-card"
          >
            <div className="glow-border">
              <NoticeBox />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home
