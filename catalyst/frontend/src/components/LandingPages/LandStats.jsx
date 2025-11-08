import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import GlassCard from '../UI/GlassCard';

function LandStats() {
  const stats = [
    {
      number: 10000,
      suffix: '+',
      label: 'Active Students',
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Students actively using the platform'
    },
    {
      number: 500,
      suffix: '+',
      label: 'Companies',
      icon: '🏢',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Top companies recruiting through catalyst'
    },
    {
      number: 85,
      suffix: '%',
      label: 'Placement Rate',
      icon: '📈',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Average placement success rate'
    },
    {
      number: 95,
      suffix: '%',
      label: 'User Satisfaction',
      icon: '⭐',
      gradient: 'from-orange-500 to-red-500',
      description: 'Students satisfied with the platform'
    }
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const Counter = ({ end, suffix, duration = 2 }) => {
    const [count, setCount] = React.useState(0);
    const counterRef = useRef(null);
    const isInView = useInView(counterRef, { once: true });

    useEffect(() => {
      if (isInView) {
        let startTime = null;
        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
          
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentCount = Math.floor(easeOutQuart * end);
          
          setCount(currentCount);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(end);
          }
        };
        requestAnimationFrame(animate);
      }
    }, [isInView, end, duration]);

    return (
      <span ref={counterRef} className="text-5xl md:text-6xl font-extrabold gradient-text">
        {count}{suffix}
      </span>
    );
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated orbs */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl animate-float"
            style={{
              width: `${200 + Math.random() * 150}px`,
              height: `${200 + Math.random() * 150}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            Trusted by Thousands
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join the growing community of students and institutions transforming their placement experience
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
            >
              <GlassCard
                hoverable={true}
                glow={true}
                className="p-8 text-center group"
              >
                {/* Icon */}
                <div className="relative mb-4 inline-block">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-full opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}></div>
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    {stat.icon}
                  </div>
                </div>

                {/* Number */}
                <div className="mb-3">
                  <Counter end={stat.number} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {stat.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {stat.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stat.number}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                  />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default LandStats;

