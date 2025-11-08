import React from 'react';

function Footer({ isSidebarVisible }) {
  return (
    <footer 
      className={`bottom-0 right-0 border-t-2 shadow-inner transition-all duration-300 flex justify-between items-center h-fit w-full max-md:py-4 md:py-6 max-sm:text-sm ${
        isSidebarVisible ? 'md:ml-60 md:w-[calc(100%-15rem)] px-10' : 'ml-0 px-4'
      }`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTopColor: 'var(--color-border)',
        color: 'var(--color-text-secondary)'
      }}
    >
      <div className="flex flex-col md:flex-row text-left md:items-center gap-2">
        <span className="font-semibold" style={{ color: 'var(--color-text)' }}>© 2024 catalyst</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center text-right gap-2">
        <span className="font-semibold" style={{ color: 'var(--color-text)' }}>Version</span>
        <span 
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
            color: '#ffffff' /* White text on colored gradient badge */
          }}
        >
          1.0.1
        </span>
      </div>
    </footer>
  );
}

export default Footer;
