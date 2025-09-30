import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '', text = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-16 h-16'
  };

  const dotSize = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  };

  return (
    <div className={`flex flex-col justify-center items-center ${className} animate-fade-in-scale`}>
      <div className="relative animate-bounce-in">
        {/* Outer static ring */}
        <div 
          className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}
        />
        
        {/* Multiple spinning rings */}
        <div 
          className={`${sizeClasses[size]} border-4 border-transparent border-t-blue-600 border-r-blue-400 rounded-full animate-spin absolute top-0 left-0`}
          role="status"
          aria-label="Loading"
          style={{ animationDuration: '1s' }}
        />
        <div 
          className={`${sizeClasses[size]} border-3 border-transparent border-t-purple-600 border-l-purple-400 rounded-full animate-spin absolute top-0 left-0`}
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        />
        
        {/* Center pulsing dot */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${dotSize[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse-glow`} />
        
        {/* Floating particles around spinner */}
        {size === 'large' && (
          <>
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60"></div>
            <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
            <div className="absolute -top-2 -right-2 w-1 h-1 bg-blue-300 rounded-full animate-float opacity-80" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-purple-300 rounded-full animate-float opacity-80" style={{animationDelay: '1.5s'}}></div>
          </>
        )}
        
        {size === 'medium' && (
          <>
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-70"></div>
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-400 rounded-full animate-float opacity-70" style={{animationDelay: '0.7s'}}></div>
          </>
        )}
        
        {/* Glow effect for large spinner */}
        {size === 'large' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse blur-sm"></div>
        )}
      </div>
      
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium animate-text-reveal">
          {text}
        </p>
      )}
      
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;