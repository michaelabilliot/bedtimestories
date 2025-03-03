import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useSettings } from '../contexts/SettingsContext';

const SettingsPanel = ({ isVisible }) => {
  const { setShowSettings } = useApp();
  const { 
    backgroundZoom, 
    setBackgroundZoom, 
    backgroundBlur, 
    setBackgroundBlur 
  } = useSettings();
  
  return (
    <>
      {/* Settings Icon */}
      <button 
        onClick={() => setShowSettings(true)}
        className="fixed top-4 right-4 bg-soft-pink/65 rounded-full w-11 h-11 flex items-center justify-center cursor-pointer z-30 shadow-lg transition-all duration-300 hover:rotate-12 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Open settings"
      >
        <span className="material-icons text-white filter drop-shadow">settings</span>
      </button>
      
      {/* Settings Panel */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fade-in-down">
          <h2 className="text-2xl font-dancing mb-6 text-center">Customize Your Experience</h2>
          
          <div className="space-y-6">
            {/* Background Zoom */}
            <div className="space-y-2">
              <label htmlFor="zoomSlider" className="block text-sm font-medium">
                Background Zoom: {backgroundZoom.toFixed(2)}
              </label>
              <input 
                type="range" 
                id="zoomSlider" 
                min="0.5" 
                max="2" 
                step="0.01" 
                value={backgroundZoom}
                onChange={(e) => setBackgroundZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                aria-valuemin="0.5"
                aria-valuemax="2"
                aria-valuenow={backgroundZoom}
              />
            </div>
            
            {/* Background Blur */}
            <div className="space-y-2">
              <label htmlFor="blurSlider" className="block text-sm font-medium">
                Background Blur: {backgroundBlur.toFixed(1)}px
              </label>
              <input 
                type="range" 
                id="blurSlider" 
                min="0" 
                max="30" 
                step="0.1" 
                value={backgroundBlur}
                onChange={(e) => setBackgroundBlur(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                aria-valuemin="0"
                aria-valuemax="30"
                aria-valuenow={backgroundBlur}
              />
            </div>
          </div>
          
          <button 
            onClick={() => setShowSettings(false)}
            className="mt-8 w-full py-2 bg-soft-pink hover:bg-soft-pink/80 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close settings"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel; 