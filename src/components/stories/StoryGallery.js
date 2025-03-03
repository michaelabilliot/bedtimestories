import React from 'react';
import { useStories } from '../../contexts/StoriesContext';

const StoryGallery = () => {
  const { availableStories, playStory } = useStories();
  
  // Separate today's stories from other stories
  const todaysStories = availableStories.filter(story => story.today);
  const otherStories = availableStories.filter(story => !story.today);
  
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-dancing text-center mb-2">Bedtime Stories</h1>
      <p className="text-center text-white/80 mb-8">Choose a story to drift away into dreamland together</p>
      
      <div className="space-y-12">
        {/* Today's Special Section */}
        {todaysStories.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-dancing text-center">Tonight's Special</h2>
            
            <div className="flex flex-col items-center">
              {todaysStories.map((story) => (
                <div key={story.file} className="w-full max-w-md">
                  <button
                    onClick={() => playStory(story.file)}
                    className="w-full bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={`Play ${story.title} story`}
                  >
                    <div className="relative aspect-video">
                      <img 
                        src={story.cover} 
                        alt={`${story.title} Cover`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <h3 className="text-xl font-medium text-white">{story.title}</h3>
                      </div>
                    </div>
                  </button>
                  
                  {story.description && (
                    <p className="mt-2 text-center text-white/80 px-4">{story.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* More Stories Section */}
        {otherStories.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-dancing text-center">More Sweet Dreams</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherStories.map((story) => (
                <button
                  key={story.file}
                  onClick={() => playStory(story.file)}
                  className="bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label={`Play ${story.title} story`}
                >
                  <div className="relative aspect-video">
                    <img 
                      src={story.cover} 
                      alt={`${story.title} Cover`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                      <h3 className="text-lg font-medium text-white">{story.title}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryGallery; 