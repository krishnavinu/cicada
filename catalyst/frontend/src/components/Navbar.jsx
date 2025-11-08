// Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Navbar({ isSidebarVisible, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userProfile, setUserProfile] = useState('/default-profile.png');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Fetch user role and details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCurrentUser(response.data);
        // Set user details
        const name = `${response.data?.first_name || ''} ${response.data?.middle_name || ''} ${response.data?.last_name || ''}`.trim() || 'User';
        setUserName(name);
        setUserEmail(response.data?.email || '');
        setUserProfile(response.data?.profile || '/default-profile.png');
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (currentUser?.role === 'student') navigate('/student/login');
    else if (currentUser?.role === 'tpo_admin') navigate('/tpo/login');
    else if (currentUser?.role === 'management_admin') navigate('/management/login');
    else if (currentUser?.role === 'hod') navigate('/hod/login');
    else if (currentUser?.role === 'superuser') navigate('/admin');
    else navigate('/student/login');
  };

  // Fetch notifications
  useEffect(() => {
    if (notificationOpen && currentUser) {
      fetchNotifications();
    }
  }, [notificationOpen, currentUser]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      let response;
      if (currentUser?.role === 'student') {
        response = await axios.get(`${BASE_URL}/tpo/jobs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data?.data) {
          const jobs = response.data.data
            .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
            .slice(0, 10);
          setNotifications(jobs);
          // Count new jobs (posted within last 2 days)
          const newJobsCount = jobs.filter(job => 
            (new Date() - new Date(job?.postedAt)) / (1000 * 60 * 60 * 24) <= 2
          ).length;
          setUnreadCount(newJobsCount);
        }
      } else if (currentUser?.role === 'tpo_admin' || currentUser?.role === 'management_admin') {
        response = await axios.get(`${BASE_URL}/user/get-all-jobs-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data?.data) {
          setNotifications(response.data.data);
          setUnreadCount(response.data.data.length);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  let pageName = location.pathname.split('/').filter(Boolean).pop();
  if (pageName === 'dashboard') pageName = "home";
  if (pageName === 'tpo') pageName = "TPO";
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <motion.div 
      className={`h-20 sticky top-0 z-10 flex justify-between items-center border-b-2 ${
        isSidebarVisible ? 'ml-60 px-6' : 'ml-0 px-4'
      }`}
      style={{
        backgroundColor: scrolled ? `rgba(var(--color-background-rgb), 0.95)` : 'var(--color-background)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
      animate={{
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <motion.button
          onClick={toggleSidebar}
          className="p-2 rounded-lg"
          style={{
            backgroundColor: 'transparent'
          }}
          whileHover={{ scale: 1.1, backgroundColor: 'var(--color-surface)' }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isSidebarVisible ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaBars 
              size={24} 
              style={{
                color: 'var(--color-text-secondary)'
              }}
            />
          </motion.div>
        </motion.button>
        <div className="flex items-center gap-3">
          <motion.h1
            className="text-2xl font-bold"
            style={{
              background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {pageName}
          </motion.h1>
          <motion.div
            className="h-6 w-1 rounded-full"
            style={{
              background: `linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-full"
            style={{
              backgroundColor: notificationOpen ? 'rgba(var(--color-primary-rgb), 0.1)' : 'transparent'
            }}
            whileHover={{ scale: 1.1, backgroundColor: 'var(--color-surface)' }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: notificationOpen ? [0, -10, 10, -10, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaBell 
                size={20} 
                style={{ 
                  color: notificationOpen ? 'var(--color-primary)' : 'var(--color-text-secondary)' 
                }}
              />
            </motion.div>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  className="absolute top-0 right-0 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ 
                    backgroundColor: 'var(--color-error)',
                    minWidth: '16px',
                    padding: '0 4px',
                    height: '16px',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {notificationOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-80 rounded-lg shadow-2xl border-2 z-50"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  maxHeight: '400px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
              <div 
                className="px-4 py-3 border-b-2 flex justify-between items-center"
                style={{
                  borderBottomColor: 'var(--color-border)',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
                }}
              >
                <h3 className="font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-bell"></i>
                  Notifications
                </h3>
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              
              <div 
                className="overflow-y-auto flex-1"
                style={{ maxHeight: '320px' }}
              >
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <i className="fa-solid fa-spinner fa-spin text-2xl" style={{ color: 'var(--color-primary)' }}></i>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="p-2">
                    <AnimatePresence>
                      {currentUser?.role === 'student' ? (
                        // Student notifications - job postings
                        notifications.map((job, index) => {
                          const isNew = (new Date() - new Date(job?.postedAt)) / (1000 * 60 * 60 * 24) <= 2;
                          return (
                            <motion.div
                              key={job._id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <motion.div
                                whileHover={{ x: 4 }}
                              >
                                <Link
                                  to={`/student/job/${job._id}`}
                                  className="block p-3 rounded-lg mb-2 no-underline border-l-4 transition-colors duration-300"
                                  style={{
                                    borderLeftColor: isNew ? 'var(--color-success)' : 'transparent',
                                    backgroundColor: 'transparent'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <div className="flex items-start gap-2">
                                    <i className="fa-solid fa-briefcase mt-1" style={{ color: 'var(--color-primary)' }}></i>
                                    <div className="flex-1">
                                      <p className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                                        {job.jobTitle}
                                        {isNew && (
                                          <Badge className="ml-2" style={{ 
                                            background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                                            color: '#ffffff'
                                          }}>
                                            New
                                          </Badge>
                                        )}
                                      </p>
                                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                        {job.company?.companyName || 'Company'}
                                      </p>
                                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                                        {new Date(job.postedAt).toLocaleDateString()} {new Date(job.postedAt).toLocaleTimeString()}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            </motion.div>
                          );
                        })
                      ) : (
                      // TPO/Management notifications - student applications
                      notifications.map((student, index) => (
                        <motion.div
                          key={index}
                          className="p-3 rounded-lg mb-2 border-l-4"
                          style={{
                            borderLeftColor: 'var(--color-warning)',
                            backgroundColor: 'rgba(var(--color-warning-rgb), 0.05)'
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <p className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                            {student.studentName}
                          </p>
                          <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            {student.department} - {student.year === 1 ? 'First' : student.year === 2 ? 'Second' : student.year === 3 ? 'Third' : 'Fourth'} Year
                          </p>
                          {student.jobs?.map((job, jobIndex) => (
                            <Link
                              key={jobIndex}
                              to={currentUser?.role === 'tpo_admin' ? `/tpo/job/${job.jobId}` : `/management/job/${job.jobId}`}
                              className="block text-sm p-2 rounded mb-1 no-underline transition-all duration-300"
                              style={{ color: 'var(--color-primary)' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              {job.jobTitle} - {job.status}
                            </Link>
                          ))}
                        </motion.div>
                      ))
                    )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
                    <i className="fa-solid fa-inbox text-4xl mb-2"></i>
                    <p>No notifications</p>
                  </div>
                )}
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <motion.button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-lg"
            style={{
              backgroundColor: userMenuOpen ? 'rgba(var(--color-primary-rgb), 0.1)' : 'transparent'
            }}
            whileHover={{ scale: 1.05, backgroundColor: 'var(--color-surface)' }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <motion.img
                src={userProfile}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2"
                style={{
                  borderColor: userMenuOpen ? 'var(--color-primary)' : 'transparent'
                }}
                onError={(e) => {
                  e.target.src = '/default-profile.png';
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              />
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: 'var(--color-success)',
                  borderColor: 'var(--color-background)'
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span
              className="hidden md:block text-sm font-medium"
              style={{
                color: userMenuOpen ? 'var(--color-primary)' : 'var(--color-text-secondary)'
              }}
            >
              {userName.split(' ')[0] || 'User'}
            </span>
          </motion.button>

          {/* User Menu Dropdown */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-64 rounded-lg shadow-2xl border-2 z-50"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  overflow: 'hidden'
                }}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
              {/* User Info Header */}
              <div 
                className="px-4 py-3 border-b-2"
                style={{
                  borderBottomColor: 'var(--color-border)',
                  background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1) 0%, rgba(var(--color-secondary-rgb), 0.1) 100%)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={userProfile}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2"
                      style={{
                        borderColor: 'var(--color-primary)'
                      }}
                      onError={(e) => {
                        e.target.src = '/default-profile.png';
                      }}
                    />
                    <div 
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 animate-pulse"
                      style={{
                        backgroundColor: 'var(--color-success)',
                        borderColor: 'var(--color-surface)'
                      }}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="font-semibold truncate"
                      style={{ color: 'var(--color-text)' }}
                      title={userName}
                    >
                      {userName}
                    </p>
                    <p 
                      className="text-xs truncate"
                      style={{ color: 'var(--color-text-secondary)' }}
                      title={userEmail}
                    >
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* Account Settings */}
                {(currentUser?.role === 'student' || 
                  currentUser?.role === 'tpo_admin' || 
                  currentUser?.role === 'management_admin' || 
                  currentUser?.role === 'hod') && (
                  <Link
                    to={
                      currentUser?.role === 'student' ? '/student/account' :
                      currentUser?.role === 'tpo_admin' ? '/tpo/account' :
                      currentUser?.role === 'management_admin' ? '/management/account' :
                      currentUser?.role === 'hod' ? '/hod/account' : '#'
                    }
                    className="flex items-center gap-3 px-4 py-3 no-underline transition-all duration-300 group"
                    style={{
                      color: 'var(--color-text)',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
                      e.currentTarget.style.paddingLeft = '20px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.paddingLeft = '16px';
                    }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <i className="fa-solid fa-cog group-hover:rotate-90 transition-transform duration-300" style={{ color: 'var(--color-primary)' }}></i>
                    <span className="font-medium">Account Settings</span>
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left transition-all duration-300 group border-t-2"
                  style={{
                    color: 'var(--color-error)',
                    borderTopColor: 'var(--color-border)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderTop: '2px solid var(--color-border)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-error-rgb, 239, 68, 68), 0.1)';
                    e.currentTarget.style.paddingLeft = '20px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.paddingLeft = '16px';
                  }}
                >
                  <i className="fa-solid fa-sign-out-alt group-hover:translate-x-1 transition-transform duration-300"></i>
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default Navbar;
