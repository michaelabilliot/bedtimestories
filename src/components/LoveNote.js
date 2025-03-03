import React from 'react';
import { useApp } from '../contexts/AppContext';

const LoveNote = ({ isVisible }) => {
  const { setShowLoveNote } = useApp();
  
  return (
    <>
      {/* Love Note Button */}
      <button 
        onClick={() => setShowLoveNote(true)}
        className="fixed bottom-4 right-4 bg-soft-pink/65 rounded-full w-11 h-11 flex items-center justify-center cursor-pointer z-30 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-soft-pink focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Show love note"
      >
        <span className="material-icons text-white filter drop-shadow">favorite</span>
      </button>
      
      {/* Love Note Panel */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fade-in-down">
          <h2 className="text-2xl font-dancing mb-4 text-center">A Little Note For You</h2>
          
          <div className="space-y-4 text-center">
            <p className="text-white/90">
              I hope these stories bring you sweet dreams and peaceful sleep. I love sharing these moments with you.
            </p>
            <p className="font-dancing text-xl text-soft-pink">With all my love ♥</p>
          </div>
          
          <button 
            onClick={() => setShowLoveNote(false)}
            className="mt-6 w-full py-2 bg-soft-pink hover:bg-soft-pink/80 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close love note"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default LoveNote; 