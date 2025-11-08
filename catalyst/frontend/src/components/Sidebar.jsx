import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import axios from 'axios';
import Logo from '../assets/catalyst.png';
import SubMenu from './Submenu';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Sidebar = ({ isSidebarVisible }) => {
  const [sidebar, setSidebar] = useState(isSidebarVisible);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebar(isSidebarVisible);
  }, [isSidebarVisible]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (loadData.role === 'student') navigate('../student/login');
    else if (loadData.role === 'tpo_admin') navigate('../tpo/login');
    else if (loadData.role === 'management_admin') navigate('../management/login');
    else if (loadData.role === 'hod') navigate('../hod/login');
    else if (loadData.role === 'superuser') navigate('../admin');
  };

  const [loadData, setLoadData] = useState({
    name: 'Not Found',
    email: 'Not Found',
    profile: 'Profile Img',
    role: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // No token, redirect to login
      navigate('../student/login');
      return;
    }

    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setLoadData({
          name: `${res.data?.first_name || ''} ${res.data?.middle_name || ''} ${res.data?.last_name || ''}`.trim() || 'User',
          email: res.data.email || 'No email',
          profile: res.data.profile || '/default-profile.png',
          role: res.data.role || '',
        });
      })
      .catch(err => {
        console.error('Error fetching user details:', err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          const dataToPass = {
            showToastPass: true,
            toastMessagePass: err.response.data?.msg || 'Session expired. Please login again.',
          };
          navigate('../student/login', { state: dataToPass });
        } else if (err.code === 'ERR_NETWORK' || !err.response) {
          // Network error or backend not running
          console.error('Backend connection error. Check if backend is running and VITE_BACKEND_URL is correct.');
          setLoadData({
            name: 'Connection Error',
            email: 'Backend not reachable',
            profile: '/default-profile.png',
            role: '', // This will keep showing Loading...
          });
        } else {
          // Other errors
          console.error('Unexpected error:', err.response?.data || err.message);
        }
      });
  }, [navigate]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [SidebarData, setSidebarData] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const fetchSidebarData = async () => {
    try {
      const role = loadData.role?.trim(); // Trim whitespace
      console.log('Loading sidebar for role:', role);
      
      if (role === 'superuser') {
        const { SidebarData } = await import('./SuperUser/SidebarData');
        setSidebarData(SidebarData);
      } else if (role === 'management_admin') {
        const { SidebarData } = await import('./Management/SidebarData');
        setSidebarData(SidebarData);
      } else if (role === 'tpo_admin') {
        const { SidebarData } = await import('./TPO/SidebarData');
        setSidebarData(SidebarData);
      } else if (role === 'hod') {
        const { SidebarData } = await import('./HOD/SidebarData');
        setSidebarData(SidebarData);
      } else if (role === 'student') {
        const { SidebarData } = await import('./Students/SidebarData');
        setSidebarData(SidebarData);
      } else {
        console.error('Unknown role:', role);
        // Fallback: try to load student sidebar as default
        try {
          const { SidebarData } = await import('./Students/SidebarData');
          setSidebarData(SidebarData);
        } catch (fallbackError) {
          console.error('Fallback sidebar load failed:', fallbackError);
        }
      }
    } catch (error) {
      console.error('Error loading sidebar data:', error);
      // Fallback: try to load student sidebar as default
      try {
        const { SidebarData } = await import('./Students/SidebarData');
        setSidebarData(SidebarData);
      } catch (fallbackError) {
        console.error('Fallback sidebar load failed:', fallbackError);
      }
    }
  };

  useEffect(() => {
    if (loadData.role) {
      fetchSidebarData();
    }
  }, [loadData.role]);


  return (
    <>
      <nav 
        data-tutorial="sidebar" 
        className={`w-[240px] h-screen z-20 flex flex-col fixed top-0 left-0 transition-all duration-500 ease-in-out ${
          sidebar ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } lg:w-[260px] navbar-container`}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRight: `1px solid var(--color-border)`,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Enhanced Logo Section */}
        <div 
          className="flex items-center px-4 py-6 gap-3 relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
            flexShrink: 0
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)`
            }}
          ></div>
          <img 
            className="relative z-10 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" 
            src={Logo} 
            alt="Logo Image" 
            width="75" 
            height="75" 
          />
          <h1 className="relative z-10 text-2xl font-bold drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300" style={{ color: '#ffffff' }}>
            {loadData.role === 'superuser' && <Link to="/admin/dashboard" className="no-underline transition-colors" style={{ color: '#ffffff' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fef08a'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>catalyst</Link>}
            {loadData.role === 'management_admin' && <Link to="/management/dashboard" className="no-underline transition-colors" style={{ color: '#ffffff' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fef08a'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>catalyst</Link>}
            {loadData.role === 'tpo_admin' && <Link to="/tpo/dashboard" className="no-underline transition-colors" style={{ color: '#ffffff' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fef08a'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>catalyst</Link>}
            {loadData.role === 'hod' && <Link to="/hod/dashboard" className="no-underline transition-colors" style={{ color: '#ffffff' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fef08a'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>catalyst</Link>}
            {loadData.role === 'student' && <Link to="/student/dashboard" className="no-underline transition-colors" style={{ color: '#ffffff' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fef08a'} onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>catalyst</Link>}
          </h1>
        </div>

        {/* Main body */}
        <div 
          className="sidebar-content"
          style={{ 
            flex: '1 1 auto',
            overflowY: 'auto',
            overflowX: 'hidden',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="flex flex-col justify-center w-full">
            {SidebarData.length > 0 ? (
              SidebarData.map((item, index) => (
                <SubMenu item={item} key={index} currentPath={location.pathname} />
              ))
            ) : loadData.role ? (
              <p className="text-center p-4" style={{ color: 'var(--color-text-secondary)' }}>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                Loading menu...
              </p>
            ) : (
              <div className="text-center p-4" style={{ color: 'var(--color-text-secondary)' }}>
                <p className="mb-2">Unable to load menu</p>
                <p className="text-xs" style={{ color: 'var(--color-error)' }}>Check backend connection</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-3 py-1 rounded text-sm text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
                  }}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Menu - Always visible at bottom */}
        <div 
          className="bottom-profile-section"
          style={{ 
            flexShrink: 0,
            width: '100%',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            position: 'relative',
            marginTop: 'auto'
          }}
        >
          {/* Enhanced Dropdown Menu */}
          {dropdownOpen && (
            <div 
              className="w-full rounded-t-md border-t-2 shadow-2xl"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderTopColor: 'var(--color-border)',
                borderTopWidth: '2px',
                zIndex: 50
              }}
            >
              {/* Conditional rendering based on role */}
              {loadData.role === 'student' && (
                <Link 
                  to={`../student/account`} 
                  className="flex items-center rounded-t-md no-underline transition-all duration-300 hover:translate-x-2 group w-full"
                  style={{
                    color: 'var(--color-text)',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `rgba(var(--color-primary-rgb), 0.15)`;
                    e.currentTarget.style.fontWeight = '600';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.fontWeight = '500';
                  }}
                >
                  <FaCog size={18} className="mr-3 group-hover:rotate-90 transition-transform duration-300" style={{ minWidth: '18px' }} /> 
                  <span className="group-hover:font-semibold transition-all duration-300">Account Settings</span>
                </Link>
              )}
              {loadData.role === 'tpo_admin' && (
                <Link 
                  to={`../tpo/account`} 
                  className="flex items-center rounded-t-md no-underline transition-all duration-300 hover:translate-x-2 group w-full"
                  style={{
                    color: 'var(--color-text)',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `rgba(var(--color-primary-rgb), 0.15)`;
                    e.currentTarget.style.fontWeight = '600';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.fontWeight = '500';
                  }}
                >
                  <FaCog size={18} className="mr-3 group-hover:rotate-90 transition-transform duration-300" style={{ minWidth: '18px' }} /> 
                  <span className="group-hover:font-semibold transition-all duration-300">Account Settings</span>
                </Link>
              )}
              {loadData.role === 'management_admin' && (
                <Link 
                  to={`../management/account`} 
                  className="flex items-center rounded-t-md no-underline transition-all duration-300 hover:translate-x-2 group w-full"
                  style={{
                    color: 'var(--color-text)',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `rgba(var(--color-primary-rgb), 0.15)`;
                    e.currentTarget.style.fontWeight = '600';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.fontWeight = '500';
                  }}
                >
                  <FaCog size={18} className="mr-3 group-hover:rotate-90 transition-transform duration-300" style={{ minWidth: '18px' }} /> 
                  <span className="group-hover:font-semibold transition-all duration-300">Account Settings</span>
                </Link>
              )}
              {loadData.role === 'hod' && (
                <Link 
                  to={`../hod/account`} 
                  className="flex items-center rounded-t-md no-underline transition-all duration-300 hover:translate-x-2 group w-full"
                  style={{
                    color: 'var(--color-text)',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `rgba(var(--color-primary-rgb), 0.15)`;
                    e.currentTarget.style.fontWeight = '600';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.fontWeight = '500';
                  }}
                >
                  <FaCog size={18} className="mr-3 group-hover:rotate-90 transition-transform duration-300" style={{ minWidth: '18px' }} /> 
                  <span className="group-hover:font-semibold transition-all duration-300">Account Settings</span>
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="flex items-center rounded-t-md w-full transition-all duration-300 hover:translate-x-2 group"
                style={{
                  color: 'var(--color-error)',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `rgba(var(--color-error-rgb, 239, 68, 68), 0.15)`;
                  e.currentTarget.style.fontWeight = '700';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.fontWeight = '600';
                }}
              >
                <FaSignOutAlt size={18} className="mr-3 group-hover:translate-x-1 transition-transform duration-300" style={{ minWidth: '18px' }} /> 
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Enhanced User Profile */}
          <div 
            className="flex items-center cursor-pointer transition-all duration-300 group w-full" 
            onClick={toggleDropdown}
            style={{
              background: `linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1) 0%, rgba(var(--color-secondary-rgb), 0.1) 100%)`,
              padding: '14px 16px',
              minHeight: '75px',
              alignItems: 'center',
              display: 'flex',
              visibility: 'visible',
              opacity: 1,
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.2) 0%, rgba(var(--color-secondary-rgb), 0.2) 100%)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1) 0%, rgba(var(--color-secondary-rgb), 0.1) 100%)`;
            }}
          >
            <div className="relative flex-shrink-0" style={{ marginRight: '12px' }}>
              <img 
                src={loadData.profile} 
                alt="Profile Img" 
                width="48" 
                height="48"
                className="rounded-2xl transition-all duration-300 shadow-lg group-hover:scale-110" 
                style={{
                  outline: 'none',
                  width: '48px',
                  height: '48px',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.outline = `2px solid var(--color-primary)`;
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              />
              <div 
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 animate-pulse"
                style={{
                  backgroundColor: 'var(--color-success)',
                  borderColor: 'var(--color-surface)'
                }}
              ></div>
            </div>
            <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 
                className="font-semibold transition-colors duration-300 truncate"
                style={{
                  color: 'var(--color-text)',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  margin: 0,
                  marginBottom: '4px',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text)'}
              >
                {loadData.name}
              </h2>
              <p 
                className="transition-colors duration-300 truncate"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  margin: 0,
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {loadData.email}
              </p>
            </div>
            <div className="flex-shrink-0" style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
              <IoIosArrowDropdownCircle 
                size={26} 
                className={`transition-all duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                style={{
                  color: dropdownOpen ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  minWidth: '26px',
                  minHeight: '26px',
                  display: 'block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = dropdownOpen ? 'var(--color-primary)' : 'var(--color-text-secondary)';
                }}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
