import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../UI/GlassCard';

function LandTestimonials() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Computer Engineering Student',
      image: '👩‍💻',
      rating: 5,
      text: 'catalyst transformed my placement journey! The AI resume builder helped me create a professional resume, and the interview simulator gave me the confidence I needed. I landed my dream job at Google!',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Raj Kumar',
      role: 'ECS Engineering Student',
      image: '👨‍💼',
      rating: 5,
      text: 'The placement prediction feature is incredibly accurate. It helped me understand my chances and focus on the right companies. The platform is intuitive and packed with useful features.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Anjali Gupta',
      role: 'AIDS Engineering Student',
      image: '👩‍🎓',
      rating: 5,
      text: 'I love how catalyst tracks everything in one place. From job applications to interview feedback, everything is organized. The Career DNA analysis helped me discover my career path.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Vikram Singh',
      role: 'Mechanical Engineering Student',
      image: '👨‍🔧',
      rating: 5,
      text: 'The Placement Readiness Score feature is amazing! It shows exactly where I need to improve. Thanks to catalyst, I improved my score from 65% to 85% and got placed in a top company.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated orbs */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-3xl animate-float"
            style={{
              width: `${180 + Math.random() * 120}px`,
              height: `${180 + Math.random() * 120}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200/50 mb-6">
            <span className="text-2xl">💬</span>
            <span className="text-sm font-semibold text-gray-700">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            Loved by Students
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            See what students are saying about their experience with catalyst
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <GlassCard
                hoverable={false}
                glow={true}
                gradient={true}
                className="p-8 md:p-12"
              >
                <div className="text-center">
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mb-6 inline-block"
                  >
                    <div className={`w-24 h-24 bg-gradient-to-br ${testimonials[currentIndex].gradient} rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white`}>
                      {testimonials[currentIndex].image}
                    </div>
                  </motion.div>

                  {/* Rating */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="text-2xl text-yellow-400"
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-700 italic mb-6 leading-relaxed"
                  >
                    "{testimonials[currentIndex].text}"
                  </motion.p>

                  {/* Author */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="text-xl font-bold text-gray-800">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[currentIndex].role}
                    </p>
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all hover:scale-110 border-2 border-gray-200"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all hover:scale-110 border-2 border-gray-200"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandTestimonials;

