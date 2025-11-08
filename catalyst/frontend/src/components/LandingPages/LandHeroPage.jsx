import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  const handleScrollAbout = () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-indigo-900/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Animated orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              width: `${150 + Math.random() * 150}px`,
              height: `${150 + Math.random() * 150}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Enhanced particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 bg-white/40 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content with enhanced animations */}
      <div className="relative z-20 max-w-6xl text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="text-2xl">🚀</span>
            <span className="text-white font-semibold text-sm md:text-base">Next-Generation Placement Platform</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight drop-shadow-2xl mb-6"
        >
          Empower Your Career with <br />
          <motion.span
            animate={{
              backgroundPosition: ['0%', '200%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="bg-gradient-to-r from-blue-300 via-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] inline-block"
          >
            catalyst
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-gray-100 text-lg sm:text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed"
        >
          Discover opportunities, track progress, and connect with your TPO — all in one powerful platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <div className="relative group">
            <input
              type="email"
              className="px-6 py-4 w-80 sm:w-96 rounded-xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 text-gray-900 transition-all duration-300 border-2 border-transparent focus:border-blue-400 group-hover:shadow-blue-400/30 bg-white/95 backdrop-blur-sm text-lg"
              placeholder="Enter your email to get started..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateAccount()}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10"></div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-[length:200%_200%] animate-gradient-shift px-10 py-4 rounded-xl text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/50 group"
            onClick={handleCreateAccount}
          >
            <span className="relative z-10 flex items-center gap-3">
              Get Started Free
              <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform duration-300"></i>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </motion.button>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-6 text-white/90"
        >
          {[
            { icon: '✨', text: 'AI-Powered' },
            { icon: '🚀', text: 'Fast & Easy' },
            { icon: '🎯', text: '100% Free' },
            { icon: '🛡️', text: 'Secure' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + idx * 0.1, type: "spring" }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all cursor-default"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Call-to-action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12"
        >
          <motion.button
            whileHover={{ y: -5 }}
            onClick={handleScrollAbout}
            className="inline-flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300 group px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
          >
            <span className="text-sm font-medium">Explore Features</span>
            <motion.i
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="fa-solid fa-arrow-down text-lg"
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm bg-white/5"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default LandingHeroPage;
