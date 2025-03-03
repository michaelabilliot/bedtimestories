import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const ErrorMessage = ({ message }) => {
  const { showError } = useApp();
  
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      showError(null);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [message, showError]);
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
      <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md">
        <span className="material-icons">error</span>
        <p>{message}</p>
        <button 
          onClick={() => showError(null)}
          className="ml-auto text-white/80 hover:text-white focus:outline-none"
          aria-label="Dismiss error message"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage; 