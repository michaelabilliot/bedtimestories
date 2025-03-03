import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const SettingsContext = createContext();

// Custom hook for using the context
export const useSettings = () => useContext(SettingsContext);

// Provider component
export const SettingsProvider = ({ children }) => {
  const [backgroundZoom, setBackgroundZoom] = useState(2);
  const [backgroundBlur, setBackgroundBlur] = useState(25);
  const [backgroundImage, setBackgroundImage] = useState("linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url('images/gallery.jpg')");
  
  // Update background effects when zoom or blur changes
  useEffect(() => {
    updateBackgroundEffects();
  }, [backgroundZoom, backgroundBlur, backgroundImage]);
  
  // Update background effects
  const updateBackgroundEffects = () => {
    // Calculate additional zoom based on blur value to prevent white edges
    const blurZoomCompensation = 1 + (backgroundBlur / 100);
    
    // Set global styles for background
    document.documentElement.style.setProperty(
      '--bg-size', 
      `${backgroundZoom * 100 * blurZoomCompensation}%`
    );
    
    document.documentElement.style.setProperty(
      '--bg-blur', 
      `${backgroundBlur}px`
    );
    
    document.documentElement.style.setProperty(
      '--bg-image', 
      backgroundImage
    );
  };
  
  // Set background image
  const setBackground = (image, withGradient = true) => {
    let bgImage = image;
    
    if (withGradient) {
      // Default gradient overlay for most backgrounds
      bgImage = `linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url('${image}')`;
    } else if (image.includes('linear-gradient')) {
      // Already has gradient
      bgImage = image;
    } else {
      // No gradient
      bgImage = `url('${image}')`;
    }
    
    setBackgroundImage(bgImage);
  };
  
  return (
    <SettingsContext.Provider value={{
      backgroundZoom,
      setBackgroundZoom,
      backgroundBlur,
      setBackgroundBlur,
      setBackground,
      updateBackgroundEffects
    }}>
      {children}
    </SettingsContext.Provider>
  );
}; 