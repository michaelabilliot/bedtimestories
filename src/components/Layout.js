import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useSettings } from '../contexts/SettingsContext';
import NavigationTabs from './NavigationTabs';
import StoriesPage from './stories/StoriesPage';
import MusicPage from './music/MusicPage';
import SettingsPanel from './SettingsPanel';
import LoveNote from './LoveNote';
import ErrorMessage from './ErrorMessage';

const Layout = () => {
  const { currentPage, showSettings, showLoveNote, errorMessage } = useApp();
  
  // Add CSS variables for background effects
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      {/* Global background */}
      <div 
        className="fixed inset-0 bg-center bg-no-repeat z-[-2] transition-all duration-500 clip-inset-0"
        style={{
          backgroundImage: 'var(--bg-image, linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url("images/gallery.jpg"))',
          backgroundSize: 'var(--bg-size, 200%)',
          filter: 'blur(var(--bg-blur, 10px))'
        }}
      />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Navigation tabs */}
      <NavigationTabs />
      
      {/* Page content */}
      <main className="flex-1 flex flex-col items-center">
        {/* Only one page is shown at a time */}
        {currentPage === 'stories' ? (
          <StoriesPage />
        ) : currentPage === 'music' ? (
          <MusicPage />
        ) : null}
      </main>
      
      {/* Settings panel */}
      <SettingsPanel isVisible={showSettings} />
      
      {/* Love note */}
      <LoveNote isVisible={showLoveNote} />
      
      {/* Error message */}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
};

export default Layout; 