import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandFooter() {
  const navigate = useNavigate();

  const loginLinks = [
    { label: 'Login as TPO', path: '/tpo/login', icon: '🎓' },
    { label: 'Login as Management', path: '/management/login', icon: '👔' },
    { label: 'Login as Super Admin', path: '/admin', icon: '🛡️' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-16 mt-16 border-t border-purple-500/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Admin Login Buttons */}
        <div className="flex flex-wrap justify-center items-center max-md:gap-3 md:gap-6 mb-12">
          {loginLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => navigate(link.path)}
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-6 py-3 rounded-xl text-white text-sm font-medium shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">{link.icon}</span>
                {link.label}
                <i className="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          ))}
        </div>

        {/* Footer Text */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
          </div>
          <p className="text-base text-gray-300">
            © 2025 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-bold text-lg">catalyst</span>. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Copyrights reserved from 2025
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LandFooter;
