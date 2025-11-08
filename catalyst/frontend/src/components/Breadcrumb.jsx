import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

function BreadcrumbExp({ header }) {
  const location = useLocation();
  let pathnames = location.pathname.split('/').filter(Boolean);
  const userIs = pathnames[0];
  pathnames = pathnames.slice(1);
  if (pathnames[0] === "dashboard") {
    pathnames = pathnames.slice(1);
  }

  return (
    <div className="flex justify-between items-center mb-6 animate-fadeInDown">
      <div className="flex items-center gap-3">
        <div 
          className="w-1 h-8 rounded-full"
          style={{
            background: `linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
          }}
        ></div>
        <h1 
          className="text-3xl font-bold gradient-text"
          style={{
            background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {header}
        </h1>
      </div>
      <Breadcrumb className="mb-0">
        <Breadcrumb.Item 
          linkAs={Link} 
          linkProps={{ 
            to: '/' + userIs + "/dashboard", 
            className: "px-3 py-1 no-underline transition-colors duration-300 flex items-center gap-1 rounded-lg",
            style: {
              color: 'var(--color-text-secondary)'
            },
            onMouseEnter: (e) => {
              e.target.style.color = 'var(--color-primary)';
              e.target.style.backgroundColor = `rgba(var(--color-primary-rgb), 0.1)`;
            },
            onMouseLeave: (e) => {
              e.target.style.color = 'var(--color-text-secondary)';
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          <FaHome className="text-sm" />
          <span>Home</span>
        </Breadcrumb.Item>
        {pathnames.length > 0 && (
          <>
            <Breadcrumb.Item className="px-2 flex items-center">
              <FaChevronRight className="text-xs" style={{ color: 'var(--color-text-secondary)' }} />
            </Breadcrumb.Item>
            <Breadcrumb.Item 
              active 
              className="px-3 py-1 font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              {pathnames[pathnames.length - 1].charAt(0).toUpperCase() + pathnames[pathnames.length - 1].slice(1)}
            </Breadcrumb.Item>
          </>
        )}
      </Breadcrumb>
    </div>
  );
}

export default BreadcrumbExp;