import React from 'react';

const PageTransition = ({ children, className = '' }) => {
  return (
    <div className={`animate-fade-in-scale ${className}`}>
      {children}
    </div>
  );
};

export default PageTransition;