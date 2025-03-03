import React, { useState } from 'react';

const LoveNote = ({ isOpen, onClose }) => {
  const [currentNote, setCurrentNote] = useState(0);
  
  const loveNotes = [
    "Every moment with you feels like a beautiful dream I never want to wake up from.",
    "Your smile is my favorite sight in the world.",
    "I fall in love with you a little more every day.",
    "You make ordinary moments extraordinary just by being you.",
    "My heart belongs to you, today and always.",
    "You're the missing piece that makes my life complete.",
    "Being with you is the easiest decision I make every day.",
    "Your love is the greatest gift I've ever received.",
    "You're my favorite hello and my hardest goodbye.",
    "I love the way you make me feel like anything is possible."
  ];
  
  const handleNextNote = () => {
    setCurrentNote((prev) => (prev + 1) % loveNotes.length);
  };
  
  const handlePrevNote = () => {
    setCurrentNote((prev) => (prev - 1 + loveNotes.length) % loveNotes.length);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-transform duration-300">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 opacity-50"></div>
        
        <div className="relative p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-pink-600">Love Note</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close love note"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-inner mb-6">
            <p className="text-lg text-center italic text-gray-800 font-medium">
              "{loveNotes[currentNote]}"
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevNote}
              className="bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow hover:shadow-md transition-all"
              aria-label="Previous note"
            >
              <span className="material-icons text-pink-500">chevron_left</span>
            </button>
            
            <span className="text-sm text-gray-500">
              {currentNote + 1} / {loveNotes.length}
            </span>
            
            <button
              onClick={handleNextNote}
              className="bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow hover:shadow-md transition-all"
              aria-label="Next note"
            >
              <span className="material-icons text-pink-500">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoveNote; 