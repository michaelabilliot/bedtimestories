import React from 'react';
import { useMusic } from '../../contexts/MusicContext';

const MusicGallery = () => {
  const { musicLibrary, isLoading, playTrack, formatDate } = useMusic();
  
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl flex items-center justify-center py-12">
        <div className="animate-pulse-slow text-xl text-white/80">
          Loading music collection...
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-dancing mb-2">Music Collection</h1>
        <p className="text-white/80">Relax and enjoy these special tunes</p>
      </div>
      
      {musicLibrary.length === 0 ? (
        <div className="text-center py-8 bg-black/30 backdrop-blur-sm rounded-lg">
          <p className="text-white/80">No music available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicLibrary.map((track) => (
            <button
              key={track.folder}
              onClick={() => playTrack(track)}
              className="bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-left"
              aria-label={`Play ${track.title} by ${track.artist || 'Unknown Artist'}`}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={`music/${track.folder}/album.jpg`} 
                  alt={`${track.title} Album Cover`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'images/default-album.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium truncate">{track.title}</h3>
                <p className="text-white/70 text-sm truncate">{track.artist || 'Unknown Artist'}</p>
                <p className="text-white/50 text-xs mt-1">{formatDate(track.date)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicGallery; 