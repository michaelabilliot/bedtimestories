import React from 'react';
import { useStories } from '../../contexts/StoriesContext';
import StoryGallery from './StoryGallery';
import StoryPlayer from './StoryPlayer';

const StoriesPage = () => {
  const { storyPlaying } = useStories();
  
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4">
      {storyPlaying ? (
        <StoryPlayer />
      ) : (
        <StoryGallery />
      )}
    </div>
  );
};

export default StoriesPage; 