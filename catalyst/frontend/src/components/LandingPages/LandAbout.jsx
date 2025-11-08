import React from 'react';
import Student from '../../assets/student.jpg';
import TPO from '../../assets/tpo.jpg';
import Management from '../../assets/management.jpg';
import Admin from '../../assets/admin.jpg';

function LandAbout() {
  const roles = [
    {
      title: "Student",
      image: Student,
      description:
        "Students can register, explore job opportunities, apply for jobs, and track application status with a personalized dashboard.",
      gradient: "from-blue-400 to-cyan-500",
      icon: "👤"
    },
    {
      title: "TPO (Training & Placement Officer)",
      image: TPO,
      description:
        "TPOs manage company data, job postings, application reviews, and generate insightful reports for placement tracking.",
      gradient: "from-purple-400 to-pink-500",
      icon: "🎓"
    },
    {
      title: "Management",
      image: Management,
      description:
        "Management can monitor overall placement activities, review analytics, and control system access and quality assurance.",
      gradient: "from-green-400 to-emerald-500",
      icon: "👔"
    },
    {
      title: "Super User (Admin)",
      image: Admin,
      description:
        "Admins handle all roles with super privileges—managing users, system settings, and ensuring smooth operations across modules.",
      gradient: "from-orange-400 to-red-500",
      icon: "🛡️"
    },
  ];

  return (
    <div
      id="about"
      className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-24 scroll-mt-24 relative overflow-hidden"
    >
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Additional particles */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-purple-300/30 to-pink-300/30 animate-float"
          style={{
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fadeInDown">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 playfair bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            About catalyst
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-md md:text-lg max-w-3xl mx-auto text-gray-700 leading-relaxed">
            catalyst is a powerful web-based platform designed to streamline and manage campus placements efficiently, empowering students and institutions with cutting-edge technology for seamless placement management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role, idx) => (
            <div
              key={idx}
              className="group relative bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-6 flex flex-col items-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl card-hover animate-fadeInUp"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icon badge */}
              <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${role.gradient} rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                {role.icon}
              </div>

              {/* Image with enhanced hover effect */}
              <div className="relative mt-4 mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`}></div>
                <img
                  src={role.image}
                  alt={role.title}
                  className="relative w-40 h-40 object-cover rounded-full border-4 border-white shadow-2xl group-hover:border-transparent transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                />
              </div>

              {/* Content */}
              <h3 className={`text-xl md:text-2xl font-bold mb-3 text-center bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                {role.title}
              </h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                {role.description}
              </p>

              {/* Decorative element */}
              <div className={`mt-4 w-16 h-1 bg-gradient-to-r ${role.gradient} rounded-full opacity-0 group-hover:opacity-100 group-hover:w-24 transition-all duration-500`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandAbout;
