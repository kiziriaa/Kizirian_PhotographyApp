import React from 'react';
import logo2 from '../assets/logo2.png';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large'
  };

  return (
    <div className={`logo ${sizeClasses[size]} ${className}`}>
      <div className="logo-icon">
        <img src={logo2} alt="Kizirian Photography Logo" className="logo-image" />
      </div>
      <div className="logo-text">
        <span className="logo-primary">Kizirian</span>
        <span className="logo-secondary">Photography</span>
      </div>
    </div>
  );
};

export default Logo;