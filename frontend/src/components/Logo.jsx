import React from 'react';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large'
  };

  return (
    <div className={`logo ${sizeClasses[size]} ${className}`}>
      <div className="logo-container">
        <div className="logo-icon">
          <svg viewBox="0 0 32 32" className="logo-svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#b8941f" />
              </linearGradient>
            </defs>
            {/* Camera aperture-inspired design */}
            <circle cx="16" cy="16" r="14" fill="url(#logoGradient)" stroke="#2c3e50" strokeWidth="1"/>
            <circle cx="16" cy="16" r="8" fill="none" stroke="#2c3e50" strokeWidth="1.5"/>
            <path d="M16 8 L20 12 L16 16 L12 12 Z" fill="#2c3e50" opacity="0.8"/>
            <path d="M24 16 L20 12 L16 16 L20 20 Z" fill="#2c3e50" opacity="0.6"/>
            <path d="M16 24 L12 20 L16 16 L20 20 Z" fill="#2c3e50" opacity="0.8"/>
            <path d="M8 16 L12 12 L16 16 L12 20 Z" fill="#2c3e50" opacity="0.6"/>
          </svg>
        </div>
        <div className="logo-text">
          <span className="logo-primary">Kizirian</span>
          <span className="logo-secondary">Photography</span>
        </div>
      </div>
    </div>
  );
};

export default Logo;