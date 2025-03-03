import React, { useState } from 'react';
import { format } from 'date-fns';

const StoryCard = ({ story, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formattedDate = story.date 
    ? format(new Date(story.date), 'MMMM d, yyyy')
    : 'Unknown date';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div 
        className="h-40 bg-cover bg-center" 
        style={{ 
          backgroundImage: story.image 
            ? `url(${story.image})` 
            : `url('https://source.unsplash.com/random/300x200/?${encodeURIComponent(story.title || 'love')}')` 
        }}
      ></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{story.title}</h3>
          <button 
            onClick={() => onDelete(story.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete story"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">{formattedDate}</p>
        
        <div className={`text-gray-700 overflow-hidden ${isExpanded ? '' : 'line-clamp-3'}`}>
          {story.content}
        </div>
        
        {story.content && story.content.length > 150 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryCard; 