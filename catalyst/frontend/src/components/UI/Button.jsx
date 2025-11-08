import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern Button Component with animations
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Show loading state
 * @param {React.ReactNode} icon - Icon component
 * @param {boolean} fullWidth - Full width button
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'relative overflow-hidden font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl',
    outline: 'border-2 text-current hover:bg-current hover:text-white',
    ghost: 'hover:bg-opacity-10 text-current',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;
  const widthStyle = fullWidth ? 'w-full' : '';

  // Outline variant needs border color
  const outlineStyles = variant === 'outline' 
    ? 'border-current' 
    : '';

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyle} ${outlineStyles} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      style={{
        borderColor: variant === 'outline' ? 'var(--color-primary)' : undefined,
        color: variant === 'outline' || variant === 'ghost' ? 'var(--color-primary)' : undefined,
      }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.i
            className="fa-solid fa-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </span>
      {variant === 'primary' || variant === 'secondary' || variant === 'danger' ? (
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: 'left' }}
        />
      ) : null}
    </motion.button>
  );
};

export default Button;
