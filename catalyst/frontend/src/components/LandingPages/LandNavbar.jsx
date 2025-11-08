import React, { useEffect, useState, useRef } from 'react';
import Logo from '../../assets/catalyst.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function LandingNavbar() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [buttonSize, setButtonSize] = useState('lg');
  const [logoText, setLogoText] = useState('catalyst');
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setButtonSize('sm');
        setLogoText('catalyst');
      } else if (width <= 768) {
        setButtonSize('md');
        setLogoText('catalyst');
      } else {
        setButtonSize('lg');
        setLogoText('catalyst');
      }
    };

    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setShowLoginDropdown(true);
  };

  const handleMouseLeave = () => {
    // Set a delay before closing (300ms) to allow mouse to reach dropdown
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowLoginDropdown(false);
    }, 300);
  };

  return (
    <header
      className={`w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'backdrop-blur-xl bg-white/80 shadow-lg sticky top-0 py-2' 
          : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-4">
        {/* Logo Section with enhanced animation */}
        <div
          className="flex items-center max-md:gap-2 md:gap-4 cursor-pointer group animate-fadeInLeft"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <img
              src={Logo}
              alt="catalyst Logo"
              className="rounded-xl border-2 border-transparent group-hover:border-blue-500 w-16 h-16 md:w-20 md:h-20 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
          </div>
          <h1 className={`text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent bg-300% animate-gradient group-hover:scale-105 transition-transform duration-300`}>
            {logoText}
          </h1>
        </div>

        {/* Button Section with enhanced hover effects */}
        <div className="flex max-md:gap-1 md:gap-3 items-center animate-fadeInRight">
          <Button
            variant="outline-info"
            size={buttonSize}
            className="relative overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-translate-y-1 px-3 md:w-32 group border-2"
            onClick={() => navigate('/careers')}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Careers
              <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          {/* Login Dropdown with improved hover handling */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Button
              variant="outline-primary"
              size={buttonSize}
              className="relative overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-translate-y-1 px-3 md:w-32 group border-2"
              onClick={() => {
                setShowLoginDropdown(!showLoginDropdown);
                // Clear timeout when clicking
                if (dropdownTimeoutRef.current) {
                  clearTimeout(dropdownTimeoutRef.current);
                  dropdownTimeoutRef.current = null;
                }
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Login
                <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${showLoginDropdown ? 'rotate-180' : ''}`}></i>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            {showLoginDropdown && (
              <div 
                className="absolute right-0 top-full pt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl py-2 z-50 border border-gray-200 animate-scaleIn origin-top-right"
                style={{ animation: 'scaleIn 0.2s ease-out' }}
              >
                <button
                  onClick={() => {
                    navigate('/student/login');
                    setShowLoginDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:translate-x-2 hover:font-medium group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">👤</span>
                    <span className="group-hover:text-blue-600 transition-colors">Student Login</span>
                    <i className="fa-solid fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
                  </span>
                </button>
                <button
                  onClick={() => {
                    navigate('/tpo/login');
                    setShowLoginDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:translate-x-2 hover:font-medium group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">🎓</span>
                    <span className="group-hover:text-blue-600 transition-colors">TPO Login</span>
                    <i className="fa-solid fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
                  </span>
                </button>
                <button
                  onClick={() => {
                    navigate('/hod/login');
                    setShowLoginDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:translate-x-2 hover:font-medium group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">🏛️</span>
                    <span className="group-hover:text-blue-600 transition-colors">HOD Login</span>
                    <i className="fa-solid fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
                  </span>
                </button>
                <button
                  onClick={() => {
                    navigate('/management/login');
                    setShowLoginDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:translate-x-2 hover:font-medium group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">👔</span>
                    <span className="group-hover:text-blue-600 transition-colors">Management Login</span>
                    <i className="fa-solid fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
                  </span>
                </button>
              </div>
            )}
          </div>

          <Button
            variant="success"
            size={buttonSize}
            className="relative overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-translate-y-1 px-3 md:w-32 group btn-glow"
            onClick={() => navigate('/student/signup')}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Sign Up
              <i className="fa-solid fa-rocket group-hover:rotate-12 group-hover:translate-x-1 transition-transform duration-300"></i>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default LandingNavbar;
