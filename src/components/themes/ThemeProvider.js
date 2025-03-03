import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or use default
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('bedtimeStoriesTheme');
    return savedTheme || 'romance';
  });

  // Update CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Save theme to localStorage
    localStorage.setItem('bedtimeStoriesTheme', theme);
    
    // Define theme colors
    const themeColors = {
      romance: {
        primary: '#d53f8c',
        secondary: '#805ad5',
        gradient: 'linear-gradient(to right, #d53f8c, #805ad5)',
        light: '#fce7f3',
        dark: '#4a1d96'
      },
      sunset: {
        primary: '#ed8936',
        secondary: '#d53f8c',
        gradient: 'linear-gradient(to right, #ed8936, #d53f8c)',
        light: '#feebc8',
        dark: '#97266d'
      },
      ocean: {
        primary: '#4299e1',
        secondary: '#38b2ac',
        gradient: 'linear-gradient(to right, #4299e1, #38b2ac)',
        light: '#ebf8ff',
        dark: '#234e52'
      },
      forest: {
        primary: '#48bb78',
        secondary: '#38b2ac',
        gradient: 'linear-gradient(to right, #48bb78, #38b2ac)',
        light: '#f0fff4',
        dark: '#234e52'
      },
      lavender: {
        primary: '#9f7aea',
        secondary: '#667eea',
        gradient: 'linear-gradient(to right, #9f7aea, #667eea)',
        light: '#e9d8fd',
        dark: '#3c366b'
      }
    };
    
    // Apply theme colors to CSS variables
    const colors = themeColors[theme];
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-gradient', colors.gradient);
    root.style.setProperty('--color-light', colors.light);
    root.style.setProperty('--color-dark', colors.dark);
    
    // Add theme class to body
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 