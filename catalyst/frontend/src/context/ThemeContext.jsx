import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  light: {
    name: 'Light',
    primary: '#2563eb',        // Bright blue
    secondary: '#7c3aed',      // Purple
    accent: '#ec4899',         // Pink
    background: '#ffffff',     // Pure white
    surface: '#f8fafc',        // Light gray
    text: '#0f172a',           // Very dark blue-gray (high contrast)
    textSecondary: '#475569',  // Medium gray (good contrast)
    border: '#e2e8f0',         // Light gray border
    success: '#059669',        // Green
    warning: '#d97706',        // Orange
    error: '#dc2626',          // Red
    info: '#0284c7',           // Blue
    fontPrimary: 'Inter',
    fontSecondary: 'Poppins',
    fontHeading: 'Montserrat'
  },
  dark: {
    name: 'Dark',
    // Primary colors - Soft purple/indigo tones that complement the dark palette
    primary: '#8b5cf6',        // Vibrant purple (works well on dark backgrounds)
    secondary: '#a78bfa',      // Light purple
    accent: '#c084fc',         // Soft purple accent
    // Background colors - Using the sophisticated purple/indigo palette
    background: '#1a151f',     // Very dark purple/indigo (base background) - from palette
    surface: '#241e2a',        // Dark purple/indigo (cards, surfaces) - from palette
    surfaceElevated: '#2c2433', // Medium dark purple/indigo (elevated surfaces) - from palette
    // Text colors - Light colors with excellent contrast
    text: '#f1f5f9',           // Very light gray (high contrast, easy to read)
    textSecondary: '#e2e8f0',  // Light gray (good contrast for secondary text)
    textMuted: '#cbd5e1',      // Medium light gray (for muted/disabled text)
    // Border and divider colors
    border: '#393041',         // Lighter dark purple/indigo (from palette) - subtle borders
    borderLight: '#2c2433',    // Medium dark purple for subtle dividers
    // Status colors - Vibrant but not overwhelming
    success: '#34d399',        // Light green
    warning: '#fbbf24',        // Yellow/amber
    error: '#f87171',          // Light red
    info: '#60a5fa',           // Light blue
    fontPrimary: 'Inter',
    fontSecondary: 'Poppins',
    fontHeading: 'Montserrat'
  },
  ocean: {
    name: 'Ocean',
    primary: '#0369a1',        // Deep blue
    secondary: '#0284c7',      // Ocean blue
    accent: '#0ea5e9',         // Sky blue
    background: '#f0f9ff',     // Very light blue
    surface: '#e0f2fe',        // Light blue
    text: '#0c4a6e',           // Dark blue (high contrast)
    textSecondary: '#075985',  // Medium dark blue (good contrast)
    border: '#bae6fd',         // Light blue border
    success: '#059669',        // Green
    warning: '#d97706',        // Orange
    error: '#dc2626',          // Red
    info: '#0284c7',           // Blue
    fontPrimary: 'Open Sans',
    fontSecondary: 'Poppins',
    fontHeading: 'Montserrat'
  },
  sunset: {
    name: 'Sunset',
    primary: '#c2410c',        // Deep orange
    secondary: '#ea580c',      // Orange
    accent: '#f97316',         // Bright orange
    background: '#fff7ed',     // Very light orange
    surface: '#ffedd5',        // Light orange
    text: '#7c2d12',           // Dark brown-orange (high contrast)
    textSecondary: '#9a3412',  // Medium dark orange (good contrast)
    border: '#fed7aa',         // Light orange border
    success: '#059669',        // Green
    warning: '#d97706',        // Orange
    error: '#b91c1c',          // Dark red
    info: '#0369a1',           // Blue
    fontPrimary: 'Poppins',
    fontSecondary: 'Inter',
    fontHeading: 'Playfair Display'
  },
  forest: {
    name: 'Forest',
    primary: '#047857',        // Deep green
    secondary: '#059669',      // Green
    accent: '#10b981',         // Bright green
    background: '#f0fdf4',     // Very light green
    surface: '#dcfce7',        // Light green
    text: '#064e3b',           // Very dark green (high contrast)
    textSecondary: '#065f46',  // Dark green (good contrast)
    border: '#86efac',         // Light green border
    success: '#059669',        // Green
    warning: '#d97706',        // Orange
    error: '#b91c1c',          // Dark red
    info: '#0369a1',           // Blue
    fontPrimary: 'Open Sans',
    fontSecondary: 'Roboto',
    fontHeading: 'Montserrat'
  },
  purple: {
    name: 'Purple Dream',
    primary: '#6d28d9',        // Deep purple
    secondary: '#7c3aed',      // Purple
    accent: '#8b5cf6',         // Light purple
    background: '#faf5ff',     // Very light purple
    surface: '#f3e8ff',        // Light purple
    text: '#581c87',           // Very dark purple (high contrast)
    textSecondary: '#6b21a8',  // Dark purple (good contrast)
    border: '#d8b4fe',         // Light purple border
    success: '#059669',        // Green
    warning: '#d97706',        // Orange
    error: '#b91c1c',          // Dark red
    info: '#6366f1',           // Indigo
    fontPrimary: 'Inter',
    fontSecondary: 'Poppins',
    fontHeading: 'Playfair Display'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  const [fontFamily, setFontFamily] = useState(() => {
    const saved = localStorage.getItem('fontFamily');
    return saved || 'Inter';
  });

  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;
    const body = document.body;
    
    // Remove previous theme class
    body.classList.remove('theme-light', 'theme-dark', 'theme-ocean', 'theme-sunset', 'theme-forest', 'theme-purple');
    
    // Add current theme class
    body.classList.add(`theme-${currentTheme}`);
    
    // Set CSS variables
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    // Handle optional surfaceElevated for dark theme
    if (theme.surfaceElevated) {
      root.style.setProperty('--color-surface-elevated', theme.surfaceElevated);
    } else {
      root.style.setProperty('--color-surface-elevated', theme.surface);
    }
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    // Handle optional textMuted
    if (theme.textMuted) {
      root.style.setProperty('--color-text-muted', theme.textMuted);
    } else {
      root.style.setProperty('--color-text-muted', theme.textSecondary);
    }
    root.style.setProperty('--color-border', theme.border);
    // Handle optional borderLight
    if (theme.borderLight) {
      root.style.setProperty('--color-border-light', theme.borderLight);
    } else {
      root.style.setProperty('--color-border-light', theme.border);
    }
    root.style.setProperty('--color-success', theme.success);
    root.style.setProperty('--color-warning', theme.warning);
    root.style.setProperty('--color-error', theme.error);
    root.style.setProperty('--color-info', theme.info);
    root.style.setProperty('--font-primary', theme.fontPrimary);
    root.style.setProperty('--font-secondary', theme.fontSecondary);
    root.style.setProperty('--font-heading', theme.fontHeading);
    root.style.setProperty('--app-font-family', fontFamily);

    // Convert hex colors to RGB for rgba usage
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '0, 0, 0';
    };

    root.style.setProperty('--color-primary-rgb', hexToRgb(theme.primary));
    root.style.setProperty('--color-secondary-rgb', hexToRgb(theme.secondary));
    root.style.setProperty('--color-accent-rgb', hexToRgb(theme.accent));
    root.style.setProperty('--color-background-rgb', hexToRgb(theme.background));
    root.style.setProperty('--color-surface-rgb', hexToRgb(theme.surface));

    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('fontFamily', fontFamily);
  }, [currentTheme, fontFamily]);

  const toggleTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const toggleFont = (fontName) => {
    setFontFamily(fontName);
  };

  const value = {
    currentTheme,
    themes,
    theme: themes[currentTheme],
    toggleTheme,
    fontFamily,
    toggleFont,
    availableFonts: ['Inter', 'Poppins', 'Montserrat', 'Open Sans', 'Roboto', 'Playfair Display']
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
