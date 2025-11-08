import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';

function LandFeatures() {
  const features = [
    {
      icon: '🎯',
      title: 'AI-Powered Resume Builder',
      description: 'Create professional resumes with AI suggestions and templates. Get real-time feedback and optimize your profile for better opportunities.',
      gradient: 'from-blue-500 to-cyan-500',
      color: 'blue'
    },
    {
      icon: '🤖',
      title: 'AI Interview Simulator',
      description: 'Practice interviews with our AI-powered simulator. Get instant feedback on your responses and improve your interview skills.',
      gradient: 'from-purple-500 to-pink-500',
      color: 'purple'
    },
    {
      icon: '📊',
      title: 'Placement Readiness Score',
      description: 'Track your placement readiness with comprehensive analytics. Identify strengths and areas for improvement.',
      gradient: 'from-green-500 to-emerald-500',
      color: 'green'
    },
    {
      icon: '🔮',
      title: 'Placement Prediction',
      description: 'Get AI-powered predictions about your placement probability. Understand your chances with different companies.',
      gradient: 'from-orange-500 to-red-500',
      color: 'orange'
    },
    {
      icon: '🧬',
      title: 'Career DNA Analysis',
      description: 'Discover your career personality and find the best job matches based on your work style and values.',
      gradient: 'from-indigo-500 to-purple-500',
      color: 'indigo'
    },
    {
      icon: '💡',
      title: 'Intervention Engine',
      description: 'Get personalized recommendations and interventions to improve your placement chances and career growth.',
      gradient: 'from-pink-500 to-rose-500',
      color: 'pink'
    },
    {
      icon: '📈',
      title: 'Real-time Analytics',
      description: 'Monitor your progress with detailed analytics and insights. Track applications, interviews, and placements.',
      gradient: 'from-teal-500 to-cyan-500',
      color: 'teal'
    },
    {
      icon: '🎓',
      title: 'Company Insights',
      description: 'Explore company profiles, difficulty levels, and placement statistics. Make informed decisions about applications.',
      gradient: 'from-amber-500 to-yellow-500',
      color: 'amber'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      <AnimatedBackground intensity="low" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-6">
            <span className="text-2xl">✨</span>
            <span className="text-sm font-semibold text-gray-700">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools and AI-powered features designed to elevate your placement journey
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mt-6 shadow-lg animate-shimmer-slide"></div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
            >
              <GlassCard
                hoverable={true}
                glow={true}
                className="h-full p-6 group cursor-pointer"
              >
                {/* Icon */}
                <div className="relative mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 bounce-icon`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>

                {/* Decorative line */}
                <div className={`mt-4 w-0 h-0.5 bg-gradient-to-r ${feature.gradient} group-hover:w-full transition-all duration-500 rounded-full`}></div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <GlassCard
            hoverable={false}
            glow={true}
            gradient={true}
            className="p-8 md:p-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Ready to Transform Your Career?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of students already using catalyst to accelerate their placement journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gradient-button px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg flex items-center gap-2 group"
              >
                <span>Get Started Free</span>
                <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-blue-300 text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2 group"
              >
                <span>Learn More</span>
                <i className="fa-solid fa-book group-hover:rotate-12 transition-transform"></i>
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

// Temporary AnimatedBackground component for this file
const AnimatedBackground = ({ intensity = 'medium' }) => {
  const particleCount = intensity === 'high' ? 40 : intensity === 'medium' ? 25 : 15;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20"></div>
      
      {/* Particles */}
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-300/30 to-purple-300/30 animate-float"
          style={{
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default LandFeatures;

