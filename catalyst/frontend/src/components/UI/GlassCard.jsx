import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hoverable = false, 
  glow = false,
  gradient = false,
  ...props 
}) => {
  const baseClasses = 'glass-card';
  const hoverClasses = hoverable ? 'glass-card-hover' : '';
  const glowClasses = glow ? 'card-glow' : '';
  const gradientClasses = gradient ? 'gradient-border' : '';
  
  const cardContent = (
    <div className={`${baseClasses} ${hoverClasses} ${glowClasses} ${gradientClasses} ${className}`} {...props}>
      {gradient ? (
        <div className="gradient-border-content">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={className}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default GlassCard;

