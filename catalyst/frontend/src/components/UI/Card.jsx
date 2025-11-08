import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern Glassmorphic Card Component
 * @param {boolean} hoverable - Enable hover effects
 * @param {string} variant - 'default' | 'gradient' | 'bordered'
 * @param {React.ReactNode} icon - Icon in header
 * @param {string} title - Card title
 * @param {React.ReactNode} action - Action element (button/link) in header
 */
const Card = ({
  children,
  className = '',
  hoverable = true,
  variant = 'default',
  icon,
  title,
  action,
  onClick,
  ...props
}) => {
  const baseStyles = 'backdrop-blur-xl border-2 rounded-2xl shadow-xl transition-all duration-500 relative overflow-hidden';
  
  const variants = {
    default: {
      background: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
    gradient: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
      borderColor: 'var(--color-border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
    bordered: {
      background: 'var(--color-surface)',
      borderColor: 'var(--color-primary)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
  };

  const cardStyle = variants[variant] || variants.default;
  const cursorStyle = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseStyles} ${cursorStyle} ${className}`}
      style={cardStyle}
      onClick={onClick}
      whileHover={hoverable ? { 
        scale: 1.02,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
      } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Animated background gradient on hover */}
      {hoverable && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 pointer-events-none"
          whileHover={{ opacity: 0.05 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Card Header */}
      {(icon || title || action) && (
        <div className="flex justify-between items-center mb-4 p-4 pb-0">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.div>
            )}
            {title && (
              <h3
                className="font-bold text-xl"
                style={{ color: 'var(--color-text)' }}
              >
                {title}
              </h3>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
