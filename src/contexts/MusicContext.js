import React, { createContext, useState, useContext, useEffect } from 'react';
import { useApp } from './AppContext';
import { useSettings } from './SettingsContext';

// Create context
const MusicContext = createContext();

// Custom hook for using the context
export const useMusic = () => useContext(MusicContext);

// Provider component
export const MusicProvider = ({ children }) => {
  const { showError } = useApp();
  const { setBackground } = useSettings();
  
  const [musicLibrary, setMusicLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicPlayer, setMusicPlayer] = useState(null);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  
  // Load music data on mount
  useEffect(() => {
    loadMusicData();
    
    // Create audio element
    const audio = new Audio();
    audio.preload = "auto";
    setMusicPlayer(audio);
    
    // Clean up on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);
  
  // Load music data from index.json
  const loadMusicData = async () => {
    try {
      setIsLoading(true);
      
      // Get the base URL for the project, works in both local and GitHub Pages environments
      const basePath = window.location.pathname.endsWith('/') ? 
        window.location.pathname : 
        window.location.pathname + '/';
      
      // Fetch the list of available music folders
      let response = await fetch(`${basePath}music/index.json`);
      
      if (!response.ok) {
        // If the first approach fails, try a relative path
        console.log(`Failed to load from ${basePath}music/index.json, trying relative path...`);
        response = await fetch('music/index.json');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load music index: ${response.status} ${response.statusText}`);
      }
      
      const musicIndex = await response.json();
      const tracks = musicIndex.tracks || [];
      
      // Sort the music by date (newest first)
      tracks.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setMusicLibrary(tracks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading music data:', error);
      showError("Failed to load music library. Please try again later.");
      setIsLoading(false);
    }
  };
  
  // Play a track
  const playTrack = (track) => {
    if (!track || !musicPlayer) return;
    
    setCurrentTrack(track);
    setShowMusicPlayer(true);
    
    // Get the base URL for the project
    const basePath = window.location.pathname.endsWith('/') ? 
      window.location.pathname : 
      window.location.pathname + '/';
    
    // Set the audio source
    musicPlayer.src = `${basePath}music/${track.folder}/music.mp3`;
    musicPlayer.load();
    
    // Play the track
    musicPlayer.play().catch(error => {
      console.error("Error playing track:", error);
      showError("Could not play music. Please try again.");
    });
    
    setIsPlaying(true);
    
    // Set a dark background for the music player
    setBackground(`linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(30,30,30,0.7)), url('${basePath}images/music-bg.jpg')`, false);
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!musicPlayer) return;
    
    if (isPlaying) {
      musicPlayer.pause();
    } else {
      musicPlayer.play().catch(error => {
        console.error("Error playing track:", error);
        showError("Could not play music. Please try again.");
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Close the music player and return to the gallery
  const returnToMusicGallery = () => {
    setShowMusicPlayer(false);
    
    // Pause the music
    if (musicPlayer) {
      musicPlayer.pause();
    }
    
    setIsPlaying(false);
  };
  
  // Format a date string to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <MusicContext.Provider value={{
      musicLibrary,
      isLoading,
      currentTrack,
      isPlaying,
      musicPlayer,
      showMusicPlayer,
      playTrack,
      togglePlayPause,
      returnToMusicGallery,
      formatDate
    }}>
      {children}
    </MusicContext.Provider>
  );
}; 