import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Tailwind CSS classes will replace styled-components
const SidebarLink = ({ to, onClick, active, children, hasSubnav, tutorialId }) => (
  <Link
    to={to}
    onClick={onClick}
    data-tutorial={tutorialId || undefined}
    className={`flex items-center justify-between w-full px-4 h-14 text-base no-underline transition-all duration-300 ease-in-out group relative overflow-hidden ${
      active ? 'border-l-4 shadow-md' : 'hover:border-l-4'
    }`}
    style={{
      color: active ? 'var(--color-text)' : 'var(--color-text)',
      backgroundColor: active ? `rgba(var(--color-primary-rgb), 0.1)` : 'transparent',
      borderLeftColor: active ? 'var(--color-primary)' : 'transparent'
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = `rgba(var(--color-primary-rgb), 0.05)`;
        e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderLeftColor = 'transparent';
      }
    }}
  >
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
      style={{
        background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
      }}
    ></div>
    <span className="relative z-10 flex items-center w-full">{children}</span>
  </Link>
);

const SidebarLabel = ({ children }) => (
  <span className="ml-3">{children}</span>
);

const DropdownLink = ({ to, active, children, tutorialId }) => (
  <Link
    to={to}
    data-tutorial={tutorialId || undefined}
    className={`flex items-center h-12 pl-8 text-base no-underline transition-all duration-300 hover:translate-x-2 group relative overflow-hidden ${
      active ? 'border-l-4 shadow-md' : ''
    }`}
    style={{
      color: 'var(--color-text)',
      backgroundColor: active ? `rgba(var(--color-primary-rgb), 0.1)` : 'transparent',
      borderLeftColor: active ? 'var(--color-primary)' : 'transparent'
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = `rgba(var(--color-primary-rgb), 0.05)`;
        e.currentTarget.style.borderLeftWidth = '4px';
        e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderLeftWidth = '0';
      }
    }}
  >
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
      style={{
        background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
      }}
    ></div>
    <span className="relative z-10 flex items-center w-full">{children}</span>
  </Link>
);

const SubMenu = ({ item, currentPath }) => {
  const [subnav, setSubnav] = useState(false);

  useEffect(() => {
    if (item.subNav && item.subNav.some(subItem => currentPath.includes(subItem.path))) {
      setSubnav(true);
    } else {
      setSubnav(false);
    }
  }, [currentPath, item.subNav]);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink
        to={item.path || '#'}
        onClick={item.subNav && showSubnav}
        active={currentPath === item.path}
        hasSubnav={!!item.subNav}
        tutorialId={item.tutorialId}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg transform group-hover:scale-110 transition-transform duration-300">
            {item.icon}
          </span>
          <SidebarLabel className="group-hover:font-semibold transition-all duration-300">
            {item.title}
          </SidebarLabel>
        </div>
        <div className="transform transition-transform duration-300">
          {item.subNav && (
            <i className={`fa-solid fa-chevron-right text-xs transition-transform duration-300 ${
              subnav ? 'rotate-90' : ''
            }`}></i>
          )}
        </div>
      </SidebarLink>

      {subnav && (
        <div 
          className="overflow-hidden border-l-2"
          style={{
            animation: 'fadeInDown 0.3s ease-out',
            backgroundColor: `rgba(var(--color-primary-rgb), 0.03)`,
            borderLeftColor: 'var(--color-primary)'
          }}
        >
          {item.subNav.map((subItem, index) => (
            <DropdownLink
              to={subItem.path}
              key={index}
              active={currentPath === subItem.path}
              tutorialId={subItem.tutorialId}
            >
              <span className="text-base transform group-hover:scale-110 transition-transform duration-300">
                {subItem.icon}
              </span>
              <SidebarLabel className="group-hover:font-semibold transition-all duration-300">
                {subItem.title}
              </SidebarLabel>
            </DropdownLink>
          ))}
        </div>
      )}
    </>
  );
};

export default SubMenu;
