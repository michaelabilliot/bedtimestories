import React, { useState, useEffect, useRef } from 'react';
import { useStories } from '../../contexts/StoriesContext';

const AudioControls = () => {
  const { audioElement, currentStory, currentSceneIndex, showScene } = useStories();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const volumeControlRef = useRef(null);
  
  // Update audio state when the audio element changes
  useEffect(() => {
    if (!audioElement) return;
    
    const handleTimeUpdate = () => {
      // Update progress
      if (audioElement.duration) {
        setProgress((audioElement.currentTime / audioElement.duration) * 100);
        setCurrentTime(formatTime(audioElement.currentTime));
      }
    };
    
    const handleDurationChange = () => {
      setDuration(formatTime(audioElement.duration));
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    // Set initial volume
    audioElement.volume = volume;
    
    // Add event listeners
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('durationchange', handleDurationChange);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    
    // Clean up
    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('durationchange', handleDurationChange);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
    };
  }, [audioElement, volume]);
  
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
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioElement) return;
    
    if (audioElement.paused) {
      // If on scene0, skip to scene1 and seek to its "start" if defined
      if (currentSceneIndex === 0 && currentStory && currentStory.length > 1) {
        showScene(1);
        if (currentStory[1].start !== undefined) {
          audioElement.currentTime = currentStory[1].start;
        }
      }
      
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    } else {
      audioElement.pause();
    }
  };
  
  // Go to start of story
  const goToStart = () => {
    if (!audioElement || !currentStory) return;
    
    // Go to first scene with defined start time (usually scene1)
    for (let i = 0; i < currentStory.length; i++) {
      if (currentStory[i].start !== undefined) {
        showScene(i);
        audioElement.currentTime = currentStory[i].start;
        break;
      }
    }
  };
  
  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!audioElement || !audioElement.duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * audioElement.duration;
    
    audioElement.currentTime = newTime;
    
    // Find the appropriate scene for this time
    if (currentStory) {
      for (let i = currentStory.length - 1; i >= 0; i--) {
        if (currentStory[i].start !== undefined && newTime >= currentStory[i].start) {
          showScene(i);
          break;
        }
      }
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioElement) {
      audioElement.volume = newVolume;
    }
  };
  
  return (
    <div className="w-full bg-black/50 backdrop-blur-sm rounded-lg p-3 shadow-lg">
      {/* Progress bar */}
      <div 
        className="w-full h-2 bg-gray-700 rounded-full mb-2 cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-soft-pink rounded-full"
          style={{ width: `${progress}%` }}
        />
        
        {/* Scene indicators */}
        {currentStory && currentStory.map((scene, idx) => {
          if (idx > 0 && scene.start !== undefined && audioElement && audioElement.duration) {
            const posPercent = (scene.start / audioElement.duration) * 100;
            return (
              <button
                key={idx}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full transform hover:scale-150 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ left: `${posPercent}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  showScene(idx);
                  if (audioElement) {
                    audioElement.currentTime = scene.start;
                  }
                }}
                aria-label={`Jump to scene ${idx + 1}`}
              />
            );
          }
          return null;
        })}
      </div>
      
      {/* Time display */}
      <div className="flex justify-between text-xs text-white/80 mb-3">
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goToStart}
          className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-1"
          aria-label="Go to start of story"
        >
          <span className="material-icons">skip_previous</span>
        </button>
        
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
  );
};

export default AudioControls; 