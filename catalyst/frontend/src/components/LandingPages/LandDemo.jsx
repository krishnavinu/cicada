import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../UI/GlassCard';

function LandDemo() {
  const [activeTab, setActiveTab] = useState(0);

  const demoSections = [
    {
      title: 'Resume Builder',
      icon: '📝',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        'AI-powered content suggestions',
        'Multiple professional templates',
        'Real-time preview and editing',
        'Export to PDF with one click'
      ],
      image: '🎨'
    },
    {
      title: 'Interview Simulator',
      icon: '🎤',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Practice with AI interviewer',
        'Get instant feedback on answers',
        'Improve communication skills',
        'Track progress over time'
      ],
      image: '🤖'
    },
    {
      title: 'Analytics Dashboard',
      icon: '📊',
      gradient: 'from-green-500 to-emerald-500',
      features: [
        'Real-time placement readiness score',
        'Comprehensive analytics and insights',
        'Performance tracking and trends',
        'Personalized recommendations'
      ],
      image: '📈'
    },
    {
      title: 'Job Marketplace',
      icon: '💼',
      gradient: 'from-orange-500 to-red-500',
      features: [
        'Browse hundreds of job opportunities',
        'AI-powered job matching',
        'One-click application process',
        'Track application status'
      ],
      image: '🎯'
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Background particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-300/20 to-purple-300/20 animate-float"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200/50 mb-6">
            <span className="text-2xl">🚀</span>
            <span className="text-sm font-semibold text-gray-700">Platform Preview</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            See catalyst in Action
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our powerful features and see how catalyst can transform your placement journey
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {demoSections.map((section, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === index
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white border-2 border-gray-200'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span>{section.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard
              hoverable={false}
              glow={true}
              gradient={true}
              className="p-8 md:p-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Features */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${demoSections[activeTab].gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                      {demoSections[activeTab].icon}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold gradient-text">
                      {demoSections[activeTab].title}
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {demoSections[activeTab].features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-6 h-6 bg-gradient-to-br ${demoSections[activeTab].gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <i className="fa-solid fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700 text-lg">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`mt-8 gradient-button px-6 py-3 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2 group`}
                  >
                    <span>Try it Now</span>
                    <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                  </motion.button>
                </div>

                {/* Right Side - Preview */}
                <div className="relative">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-2xl border-2 border-gray-200">
                    {/* Mock Preview */}
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${demoSections[activeTab].gradient} rounded-lg flex items-center justify-center text-2xl`}>
                          {demoSections[activeTab].image}
                        </div>
                        <div>
                          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-24 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                        <div className="mt-4 flex gap-2">
                          <div className={`h-8 flex-1 bg-gradient-to-r ${demoSections[activeTab].gradient} rounded-lg opacity-80`}></div>
                          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"
                    />
                    <motion.div
                      animate={{
                        y: [0, 10, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                      className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-20 blur-xl"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default LandDemo;

