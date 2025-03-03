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
    isTransitioning,
    currentStoryFile
  } = useStories();
  
  const { setBackground } = useSettings();
  
  // Set background image based on current scene
  useEffect(() => {
    if (currentStory && currentStory[currentSceneIndex]) {
      const scene = currentStory[currentSceneIndex];
      if (scene.image) {
        // Get the base URL for the project
        const basePath = window.location.pathname.endsWith('/') ? 
          window.location.pathname : 
          window.location.pathname + '/';
        
        // Use the currentStoryFile to get the correct folder
        setBackground(`${basePath}images/${currentStoryFile}/${scene.image}`);
      }
    }
  }, [currentStory, currentSceneIndex, setBackground, currentStoryFile]);
  
  if (!currentStory || currentStory.length === 0) {
    return null;
  }
  
  const currentScene = currentStory[currentSceneIndex];
  
  return (
    <div className={`story-player w-full max-w-4xl flex flex-col items-center ${isTransitioning ? 'fade-transition' : ''}`}>
      <div className="story-content bg-black/40 backdrop-blur-sm p-6 rounded-lg w-full mb-4">
        <div 
          className="story-text text-white"
          dangerouslySetInnerHTML={{ __html: currentScene.content }}
        />
      </div>
      
      <div className="story-controls flex items-center justify-between w-full">
        <button 
          onClick={() => returnToGallery()}
          className="btn-control flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 rounded-full"
        >
          <span className="material-icons">arrow_back</span>
        </button>
        
        <div className="navigation-controls flex items-center space-x-4">
          <button 
            onClick={() => showScene(currentSceneIndex - 1)}
            disabled={currentSceneIndex === 0}
            className={`btn-control flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 rounded-full ${currentSceneIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="material-icons">navigate_before</span>
          </button>
          
          <AudioControls />
          
          <button 
            onClick={() => showScene(currentSceneIndex + 1)}
            disabled={currentSceneIndex === currentStory.length - 1}
            className={`btn-control flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 rounded-full ${currentSceneIndex === currentStory.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="material-icons">navigate_next</span>
          </button>
        </div>
        
        <div className="w-10"></div> {/* Empty div for balance */}
      </div>
    </div>
  );
};

export default StoryPlayer; 