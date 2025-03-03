import React, { createContext, useState, useContext } from 'react';

// Create context
const AppContext = createContext();

// Custom hook for using the context
export const useApp = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('stories');
  const [showLoveNote, setShowLoveNote] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Switch between pages (stories/music)
  const navigateTo = (page) => {
    if (page === 'stories' || page === 'music') {
      setCurrentPage(page);
    }
  };

  // Show error message
  const showError = (message) => {
    setErrorMessage(message);
    
    // Auto-dismiss error after 5 seconds
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  return (
    <AppContext.Provider value={{
      currentPage,
      navigateTo,
      showLoveNote,
      setShowLoveNote,
      showSettings,
      setShowSettings,
      errorMessage,
      showError
    }}>
      {children}
    </AppContext.Provider>
  );
}; 