import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  // Close dropdown when theme changes
  useEffect(() => {
    if (showSettings) {
      const timer = setTimeout(() => setShowSettings(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [theme, showSettings]);

  return (
    <div className="theme-toggle-container" ref={dropdownRef}>
      {/* Settings Button */}
      <button
        className="btn btn-outline-secondary btn-sm settings-btn"
        onClick={() => setShowSettings(!showSettings)}
        aria-label="Open theme settings"
        aria-expanded={showSettings}
      >
        ⚙️
      </button>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="settings-dropdown">
          <div className="settings-content">
            <h6 className="settings-title">Display Settings</h6>
            
            <div className="theme-option">
              <label className="form-label">Theme Mode:</label>
              <div className="theme-buttons">
                <button
                  className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                  aria-label="Switch to light theme"
                  disabled={theme === 'light'}
                >
                  ☀️ Light
                </button>
                <button
                  className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  aria-label="Switch to dark theme"
                  disabled={theme === 'dark'}
                >
                  🌙 Dark
                </button>
              </div>
            </div>

            <div className="settings-info">
              <small className="text-muted">
                {theme === 'light' 
                  ? '🌿 Light mode: Calming sage and cream tones for comfortable viewing'
                  : '🌙 Dark mode: Warm browns and gold accents for reduced eye strain'
                }
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;