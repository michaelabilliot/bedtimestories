import React, { useEffect } from 'react';
import { useStories } from '../../contexts/StoriesContext';
import { useSettings } from '../../contexts/SettingsContext';
import AudioControls from './AudioControls';

const StoryPlayer = () => {
  const { 
    currentStory, 
    currentSceneIndex, 
    returnToGallery, 
    showScene,
    isTransitioning
  } = useStories();
  
  const { setBackground } = useSettings();
  
  // Set background image based on current scene
  useEffect(() => {
    if (currentStory && currentStory[currentSceneIndex]) {
      const scene = currentStory[currentSceneIndex];
      if (scene.image) {
        // Extract folder name from the first scene's image path
        const folderMatch = scene.image.match(/^(.+?)\//);
        const folder = folderMatch ? folderMatch[1] : '';
        
        setBackground(`images/${folder}/${scene.image}`);
      }
    }
  }, [currentStory, currentSceneIndex, setBackground]);
  
  if (!currentStory || currentStory.length === 0) {
    return null;
  }
  
  const currentScene = currentStory[currentSceneIndex];
  
  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* Back button */}
      <div className="self-start mb-4">
        <button
          onClick={returnToGallery}
          className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Return to story gallery"
        >
          <span className="material-icons">arrow_back</span>
          <span>Back to Gallery</span>
        </button>
      </div>
      
      {/* Story content */}
      <div 
        className={`w-full bg-black/40 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: currentScene.content }}
        />
      </div>
      
      {/* Audio controls */}
      <div className="w-full mt-6">
        <AudioControls />
      </div>
      
      {/* Scene navigation */}
      {currentStory.length > 1 && (
        <div className="w-full mt-4 flex justify-center">
          <div className="flex gap-2">
            {currentStory.map((_, index) => (
              <button
                key={index}
                onClick={() => showScene(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  index === currentSceneIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to scene ${index + 1}`}
                aria-current={index === currentSceneIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryPlayer; 