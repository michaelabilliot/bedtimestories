import React from 'react';
import { useApp } from '../contexts/AppContext';

const NavigationTabs = () => {
  const { currentPage, navigateTo } = useApp();
  
  return (
    <nav className="flex justify-center items-center w-full py-4 px-6 z-10">
      <div className="flex bg-black/20 backdrop-blur-sm rounded-full overflow-hidden shadow-lg">
        {/* Stories Tab */}
        <button
          onClick={() => navigateTo('stories')}
          className={`flex items-center gap-2 px-5 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full ${
            currentPage === 'stories' 
              ? 'bg-soft-pink text-white' 
              : 'hover:bg-white/10 text-white/80'
          }`}
          aria-label="Switch to Stories page"
          aria-pressed={currentPage === 'stories'}
        >
          <span className="material-icons">auto_stories</span>
          <span className="hidden sm:inline">Stories</span>
        </button>
        
        {/* Music Tab */}
        <button
          onClick={() => navigateTo('music')}
          className={`flex items-center gap-2 px-5 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full ${
            currentPage === 'music' 
              ? 'bg-soft-pink text-white' 
              : 'hover:bg-white/10 text-white/80'
          }`}
          aria-label="Switch to Music page"
          aria-pressed={currentPage === 'music'}
        >
          <span className="material-icons">music_note</span>
          <span className="hidden sm:inline">Music</span>
        </button>
      </div>
    </nav>
  );
};

export default NavigationTabs; 