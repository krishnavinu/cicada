import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton Loader Component
 * @param {string} variant - 'text' | 'circular' | 'rectangular' | 'card'
 * @param {number} width - Width (px or %)
 * @param {number} height - Height (px)
 */
const Skeleton = ({ 
  variant = 'text', 
  width = '100%', 
  height = 20,
  className = '',
  count = 1 
}) => {
  const baseStyles = 'rounded bg-opacity-20';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-2xl',
  };

  const variantStyle = variants[variant] || variants.text;
  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: variant === 'circular' ? width : `${height}px`,
    background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%)',
    backgroundSize: '200% 100%',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`${baseStyles} ${variantStyle} ${className}`}
          style={skeletonStyle}
          animate={{
            backgroundPosition: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
};

/**
 * Skeleton Card Component for loading states
 */
export const SkeletonCard = () => (
  <div
    className="backdrop-blur-xl border-2 rounded-2xl p-6 shadow-xl"
    style={{
      background: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      backdropFilter: 'blur(20px)',
    }}
  >
    <div className="flex items-center gap-3 mb-4">
      <Skeleton variant="circular" width={40} />
      <Skeleton variant="text" width="60%" height={24} />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="80%" />
    </div>
  </div>
);

export default Skeleton;
