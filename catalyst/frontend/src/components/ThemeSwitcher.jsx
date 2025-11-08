import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaPalette, FaFont, FaChevronDown } from 'react-icons/fa';

const ThemeSwitcher = () => {
  const { currentTheme, themes, toggleTheme, fontFamily, toggleFont, availableFonts } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.theme-switcher-container')) {
        setShowThemeMenu(false);
        setShowFontMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="theme-switcher-container fixed bottom-6 right-6 z-50 flex gap-3">
      {/* Theme Switcher */}
      <div className="relative">
        <button
          onClick={() => {
            setShowThemeMenu(!showThemeMenu);
            setShowFontMenu(false);
          }}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
          title="Change Theme"
        >
          <FaPalette className="text-lg group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-semibold hidden md:inline">{themes[currentTheme].name}</span>
          <FaChevronDown className={`text-sm transition-transform duration-300 ${showThemeMenu ? 'rotate-180' : ''}`} />
        </button>

        {showThemeMenu && (
          <div className="absolute bottom-full right-0 mb-3 w-56 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden animate-scaleIn">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">Themes</div>
              {Object.keys(themes).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => {
                    toggleTheme(themeKey);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 flex items-center justify-between group ${
                    currentTheme === themeKey ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full shadow-md border-2 border-white"
                      style={{
                        background: `linear-gradient(135deg, ${themes[themeKey].primary}, ${themes[themeKey].secondary})`
                      }}
                    />
                    <span className={`font-medium ${currentTheme === themeKey ? 'text-purple-600' : 'text-gray-700'}`}>
                      {themes[themeKey].name}
                    </span>
                  </div>
                  {currentTheme === themeKey && (
                    <i className="fa-solid fa-check text-purple-500 group-hover:scale-110 transition-transform"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Font Switcher */}
      <div className="relative">
        <button
          onClick={() => {
            setShowFontMenu(!showFontMenu);
            setShowThemeMenu(false);
          }}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
          title="Change Font"
        >
          <FaFont className="text-lg group-hover:scale-110 transition-transform duration-300" />
          <span className="font-semibold hidden md:inline">{fontFamily}</span>
          <FaChevronDown className={`text-sm transition-transform duration-300 ${showFontMenu ? 'rotate-180' : ''}`} />
        </button>

        {showFontMenu && (
          <div className="absolute bottom-full right-0 mb-3 w-56 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden animate-scaleIn">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">Fonts</div>
              {availableFonts.map((font) => (
                <button
                  key={font}
                  onClick={() => {
                    toggleFont(font);
                    setShowFontMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 flex items-center justify-between group ${
                    fontFamily === font ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  style={{ fontFamily: font }}
                >
                  <span className={`font-medium ${fontFamily === font ? 'text-blue-600' : 'text-gray-700'}`}>
                    {font}
                  </span>
                  {fontFamily === font && (
                    <i className="fa-solid fa-check text-blue-500 group-hover:scale-110 transition-transform"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
