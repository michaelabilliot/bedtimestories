import React from 'react';

const Header = () => {
  return (
    <header className="relative w-full text-center py-10 px-5 md:py-16 md:px-5 overflow-hidden">
      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="heart heart-1 w-8 h-8 absolute top-[20%] left-[15%] animate-float" style={{animationDuration: '18s'}}></div>
        <div className="heart heart-2 w-5 h-5 absolute top-[30%] left-[75%] animate-float" style={{animationDuration: '15s', animationDelay: '2s'}}></div>
        <div className="heart heart-3 w-6 h-6 absolute top-[50%] left-[30%] animate-float" style={{animationDuration: '20s', animationDelay: '1s'}}></div>
        <div className="heart heart-4 w-4 h-4 absolute top-[25%] left-[50%] animate-float" style={{animationDuration: '12s', animationDelay: '3s'}}></div>
        <div className="heart heart-5 w-9 h-9 absolute top-[60%] left-[80%] animate-float" style={{animationDuration: '17s', animationDelay: '4s'}}></div>
      </div>
      
      <h1 className="site-title animate-fadeInDown mt-0 mb-2 opacity-0" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
        For My Love
      </h1>
      <p className="site-subtitle animate-fadeInDown opacity-0" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
        Every moment with you is a treasure
      </p>
    </header>
  );
};

export default Header; 