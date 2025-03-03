import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../../contexts/MusicContext';

const MusicPlayer = () => {
  const { 
    currentTrack, 
    musicPlayer, 
    isPlaying, 
    togglePlayPause, 
    returnToMusicGallery,
    formatDate
  } = useMusic();
  
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const volumeControlRef = useRef(null);
  
  // Update player state when the music player changes
  useEffect(() => {
    if (!musicPlayer) return;
    
    const handleTimeUpdate = () => {
      // Update progress
      if (musicPlayer.duration) {
        setProgress((musicPlayer.currentTime / musicPlayer.duration) * 100);
        setCurrentTime(formatTime(musicPlayer.currentTime));
      }
    };
    
    const handleDurationChange = () => {
      setDuration(formatTime(musicPlayer.duration));
    };
    
    // Set initial volume
    musicPlayer.volume = volume;
    
    // Add event listeners
    musicPlayer.addEventListener('timeupdate', handleTimeUpdate);
    musicPlayer.addEventListener('durationchange', handleDurationChange);
    
    // Clean up
    return () => {
      musicPlayer.removeEventListener('timeupdate', handleTimeUpdate);
      musicPlayer.removeEventListener('durationchange', handleDurationChange);
    };
  }, [musicPlayer, volume]);
  
  // Handle clicks outside volume control
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target)) {
        setShowVolumeControl(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Format time in MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!musicPlayer || !musicPlayer.duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * musicPlayer.duration;
    
    musicPlayer.currentTime = newTime;
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (musicPlayer) {
      musicPlayer.volume = newVolume;
    }
  };
  
  if (!currentTrack) {
    return null;
  }
  
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={returnToMusicGallery}
          className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Return to music gallery"
        >
          <span className="material-icons">arrow_back</span>
          <span>Back to Gallery</span>
        </button>
      </div>
      
      {/* Now playing */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
        <div className="md:flex">
          {/* Album cover */}
          <div className="md:w-1/3">
            <div className="aspect-square">
              <img 
                src={`music/${currentTrack.folder}/album.jpg`} 
                alt={`${currentTrack.title} Album Cover`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'images/default-album.jpg';
                }}
              />
            </div>
          </div>
          
          {/* Track info */}
          <div className="p-6 md:w-2/3 flex flex-col">
            <h2 className="text-2xl font-medium mb-2">{currentTrack.title}</h2>
            <p className="text-white/80 mb-1">{currentTrack.artist || 'Unknown Artist'}</p>
            {currentTrack.album && (
              <p className="text-white/70 text-sm mb-4">{currentTrack.album}</p>
            )}
            
            {currentTrack.description && (
              <p className="text-white/70 mb-4 flex-grow">{currentTrack.description}</p>
            )}
            
            <div className="mt-auto space-y-1 text-sm text-white/60">
              {currentTrack.producer && (
                <p>Producer: {currentTrack.producer}</p>
              )}
              <p>Released: {formatDate(currentTrack.date)}</p>
            </div>
          </div>
        </div>
        
        {/* Player controls */}
        <div className="p-4 bg-black/50">
          {/* Progress bar */}
          <div 
            className="w-full h-2 bg-gray-700 rounded-full mb-2 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-soft-pink rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Time display */}
          <div className="flex justify-between text-xs text-white/80 mb-4">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={togglePlayPause}
              className="bg-soft-pink w-12 h-12 rounded-full flex items-center justify-center hover:bg-soft-pink/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="material-icons">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            
            <div className="relative" ref={volumeControlRef}>
              <button
                onClick={() => setShowVolumeControl(!showVolumeControl)}
                className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-1"
                aria-label="Volume control"
                aria-expanded={showVolumeControl}
              >
                <span className="material-icons">
                  {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                </span>
              </button>
              
              {showVolumeControl && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg w-32">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    aria-label="Volume"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 