import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

/**
 * Empty State Component
 * @param {string} icon - FontAwesome icon class
 * @param {string} title - Empty state title
 * @param {string} description - Empty state description
 * @param {React.ReactNode} action - Action button/link
 */
const EmptyState = ({
  icon = 'fa-inbox',
  title = 'No data found',
  description = 'There are no items to display at this time.',
  action,
  className = '',
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-4"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <i
          className={`fa-solid ${icon} text-6xl`}
          style={{ color: 'var(--color-text-secondary)', opacity: 0.5 }}
        />
      </motion.div>
      <motion.h3
        className="text-xl font-bold mb-2"
        style={{ color: 'var(--color-text)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-sm text-center mb-6 max-w-md"
        style={{ color: 'var(--color-text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
