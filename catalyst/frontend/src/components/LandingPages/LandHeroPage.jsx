import React, { useState } from 'react';
import HeroImg from '../../assets/heroImg.jpg';
import { useNavigate } from 'react-router-dom';

function LandingHeroPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleCreateAccount = () => {
    if (email.trim()) {
      navigate('/student/signup', {
        state: { prefillEmail: email }
      });
    } else {
      navigate('/student/signup');
    }
  }

  const handleScrollAbout = () => document.getElementById('about').scrollIntoView();

  return (
    <section
      id="home"
      className="relative h-[90vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/60 animate-gradient"></div>
      
      {/* Animated particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content with staggered animations */}
      <div className="relative z-20 max-w-5xl text-center px-4">
        <h1 className="text-white text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight drop-shadow-2xl animate-fadeInDown">
          Empower Your Career with <br />
          <span className="bg-gradient-to-r from-green-300 via-blue-400 to-purple-400 text-transparent bg-clip-text bg-300% animate-gradient inline-block">
            catalyst
          </span>
        </h1>

        <p className="mt-6 text-gray-200 text-lg sm:text-xl font-light animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          Discover opportunities, track progress, and connect with your TPO — all in one place.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="relative group">
            <input
              type="email"
              className="px-5 py-3 w-80 sm:w-96 rounded-xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-400/50 text-black transition-all duration-300 border-2 border-transparent focus:border-green-400 group-hover:shadow-green-400/20"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateAccount()}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10"></div>
          </div>
          <button
            type="button"
            className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 px-8 py-3 rounded-xl text-white font-semibold shadow-2xl hover:shadow-green-500/50 hover:scale-110 hover:-translate-y-1 group"
            onClick={handleCreateAccount}
          >
            <span className="relative z-10 flex items-center gap-2">
              Create Account
              <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform duration-300"></i>
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>
        </div>

        {/* Call-to-action with bounce animation */}
        <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <p
            className="inline-flex items-center gap-2 cursor-pointer mt-4 text-sm text-white/90 hover:text-white transition-all duration-300 underline underline-offset-4 group"
            onClick={handleScrollAbout}
          >
            Learn more about catalyst
            <i className="fa-solid fa-arrow-down group-hover:translate-y-1 group-hover:animate-bounce transition-transform duration-300"></i>
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

export default LandingHeroPage;
