import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Modern Input Component
 * @param {string} type - Input type
 * @param {string} icon - FontAwesome icon class (left side)
 * @param {React.ReactNode} rightIcon - Right side icon/button
 * @param {boolean} showPasswordToggle - Show password visibility toggle
 */
const Input = ({
  label,
  type = 'text',
  icon,
  rightIcon,
  showPasswordToggle = false,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label
          className="text-sm font-medium"
          style={{ color: 'var(--color-text)' }}
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      <motion.div
        className="relative group"
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {icon && (
          <div
            className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <i
              className={`${icon} transition-colors duration-300`}
              style={{
                color: isFocused ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            />
          </div>
        )}
        <input
          type={inputType}
          className={`form-control w-full rounded-xl border-2 transition-all duration-300 ${
            icon ? 'pl-12' : 'pl-4'
          } ${rightIcon || showPasswordToggle ? 'pr-12' : 'pr-4'} py-3 ${
            error ? 'border-red-500' : ''
          } ${className}`}
          style={{
            borderColor: isFocused
              ? 'var(--color-primary)'
              : error
              ? 'var(--color-error)'
              : 'var(--color-border)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text)',
            boxShadow: isFocused
              ? '0 0 0 4px rgba(var(--color-primary-rgb, 37, 99, 235), 0.1)'
              : 'none',
          }}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-300"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--color-text-secondary)';
            }}
          >
            <i
              className={`${
                showPassword ? 'fa-solid fa-eye' : 'fa-regular fa-eye-slash'
              } text-lg`}
            />
          </button>
        )}
        {rightIcon && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </motion.div>
      {error && (
        <motion.div
          className="flex items-center gap-1 text-sm text-red-500"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <i className="fa-solid fa-circle-exclamation text-xs" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default Input;
