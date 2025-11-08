// Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';

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
    <div 
      className={`h-20 sticky top-0 z-10 flex justify-between items-center border-b-2 transition-all duration-500 ${
        scrolled 
          ? 'backdrop-blur-md shadow-lg' 
          : 'shadow-sm'
      } ${isSidebarVisible ? 'ml-60 px-6' : 'ml-0 px-4'}`}
      style={{
        backgroundColor: scrolled ? `rgba(var(--color-background-rgb), 0.95)` : 'var(--color-background)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)'
      }}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg transition-all duration-300 hover:scale-110 group"
          style={{
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaBars 
            size={24} 
            className="transition-colors duration-300" 
            style={{
              color: 'var(--color-text-secondary)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold gradient-text" style={{
            background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {pageName}
          </h1>
          <div className="h-6 w-1 rounded-full" style={{
            background: `linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
          }}></div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-full transition-all duration-300 group"
            style={{
              backgroundColor: notificationOpen ? 'rgba(var(--color-primary-rgb), 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!notificationOpen) {
                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              }
            }}
            onMouseLeave={(e) => {
              if (!notificationOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <FaBell 
              size={20} 
              className="transition-colors duration-300"
              style={{ 
                color: notificationOpen ? 'var(--color-primary)' : 'var(--color-text-secondary)' 
              }}
            />
            {unreadCount > 0 && (
              <span 
                className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse"
                style={{ 
                  backgroundColor: 'var(--color-error)',
                  minWidth: '16px',
                  padding: '0 4px'
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <div 
              className="absolute right-0 mt-2 w-80 rounded-lg shadow-2xl border-2 z-50"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                maxHeight: '400px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
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
                    {currentUser?.role === 'student' ? (
                      // Student notifications - job postings
                      notifications.map((job, index) => (
                        <Link
                          key={index}
                          to={`/student/job/${job._id}`}
                          className="block p-3 rounded-lg mb-2 transition-all duration-300 hover:translate-x-1 no-underline border-l-4"
                          style={{
                            borderLeftColor: (new Date() - new Date(job?.postedAt)) / (1000 * 60 * 60 * 24) <= 2 
                              ? 'var(--color-success)' 
                              : 'transparent',
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
                                {(new Date() - new Date(job?.postedAt)) / (1000 * 60 * 60 * 24) <= 2 && (
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
                      ))
                    ) : (
                      // TPO/Management notifications - student applications
                      notifications.map((student, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg mb-2 border-l-4"
                          style={{
                            borderLeftColor: 'var(--color-warning)',
                            backgroundColor: 'rgba(var(--color-warning-rgb), 0.05)'
                          }}
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
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
                    <i className="fa-solid fa-inbox text-4xl mb-2"></i>
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 group"
            style={{
              backgroundColor: userMenuOpen ? 'rgba(var(--color-primary-rgb), 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!userMenuOpen) {
                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              }
            }}
            onMouseLeave={(e) => {
              if (!userMenuOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div className="relative">
              <img 
                src={userProfile}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 transition-all duration-300"
                style={{
                  borderColor: userMenuOpen ? 'var(--color-primary)' : 'transparent'
                }}
                onError={(e) => {
                  e.target.src = '/default-profile.png';
                }}
              />
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: 'var(--color-success)',
                  borderColor: 'var(--color-background)'
                }}
              ></div>
            </div>
            <span 
              className="hidden md:block text-sm font-medium transition-colors duration-300"
              style={{ 
                color: userMenuOpen ? 'var(--color-primary)' : 'var(--color-text-secondary)'
              }}
            >
              {userName.split(' ')[0] || 'User'}
            </span>
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-64 rounded-lg shadow-2xl border-2 z-50"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                overflow: 'hidden'
              }}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
