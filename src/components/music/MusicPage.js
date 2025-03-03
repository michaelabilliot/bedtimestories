import React, { useEffect } from 'react';
import { useMusic } from '../../contexts/MusicContext';
import { useSettings } from '../../contexts/SettingsContext';
import MusicGallery from './MusicGallery';
import MusicPlayer from './MusicPlayer';

const MusicPage = () => {
  const { showMusicPlayer } = useMusic();
  const { setBackground } = useSettings();
  
  // Set dark background for music page
  useEffect(() => {
    // Get the base URL for the project
    const basePath = window.location.pathname.endsWith('/') ? 
      window.location.pathname : 
      window.location.pathname + '/';
      
    setBackground(`linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(30,30,30,0.7)), url('${basePath}images/music-bg.jpg')`, false);
  }, [setBackground]);
  
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4">
      {showMusicPlayer ? (
        <MusicPlayer />
      ) : (
        <MusicGallery />
      )}
    </div>
  );
};

export default MusicPage; 