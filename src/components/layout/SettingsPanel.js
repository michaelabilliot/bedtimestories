import React, { useState, useEffect } from 'react';
import { useTheme } from '../themes/ThemeProvider';

const SettingsPanel = ({ isOpen, onClose, onUpdateBackground }) => {
  const { theme, setTheme } = useTheme();
  const [zoom, setZoom] = useState(1.1);
  const [blur, setBlur] = useState(10);

  // Apply background changes when sliders are adjusted
  useEffect(() => {
    onUpdateBackground(zoom, blur);
  }, [zoom, blur, onUpdateBackground]);

  // Available themes
  const themes = [
    { id: 'romance', label: 'Romance', colors: 'from-pink-400 to-purple-500' },
    { id: 'sunset', label: 'Sunset', colors: 'from-orange-400 to-pink-500' },
    { id: 'ocean', label: 'Ocean', colors: 'from-blue-400 to-teal-500' },
    { id: 'forest', label: 'Forest', colors: 'from-green-400 to-teal-500' },
    { id: 'lavender', label: 'Lavender', colors: 'from-purple-400 to-indigo-500' }
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-transform duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close settings"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Theme selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Theme</h3>
              <div className="grid grid-cols-5 gap-2">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`h-12 rounded-lg bg-gradient-to-r ${t.colors} transition-all ${
                      theme === t.id ? 'ring-2 ring-offset-2 ring-purple-500 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`${t.label} theme`}
                    title={t.label}
                  ></button>
                ))}
              </div>
            </div>
            
            {/* Background controls */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Background</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor="zoom" className="text-sm text-gray-600">Zoom</label>
                    <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    id="zoom"
                    min="1"
                    max="1.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor="blur" className="text-sm text-gray-600">Blur</label>
                    <span className="text-sm text-gray-500">{blur}px</span>
                  </div>
                  <input
                    type="range"
                    id="blur"
                    min="0"
                    max="20"
                    step="1"
                    value={blur}
                    onChange={(e) => setBlur(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 