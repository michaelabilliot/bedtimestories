import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-8 px-5 text-center">
      <div className="container mx-auto">
        <p className="text-sm opacity-70">
          Made with ❤️ for you | {currentYear}
        </p>
      </div>
    </footer>
  );
};

export default Footer; 