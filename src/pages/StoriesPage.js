import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StoryCard from '../components/StoryCard';
import AddStoryForm from '../components/AddStoryForm';

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load stories from localStorage on component mount
  useEffect(() => {
    const savedStories = localStorage.getItem('bedtimeStories');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    }
  }, []);

  // Save stories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bedtimeStories', JSON.stringify(stories));
  }, [stories]);

  const addStory = (newStory) => {
    setStories([...stories, { ...newStory, id: Date.now(), date: new Date().toISOString() }]);
    setIsFormVisible(false);
  };

  const deleteStory = (id) => {
    setStories(stories.filter(story => story.id !== id));
  };

  return (
    <Layout>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Our Bedtime Stories</h2>
        <p className="text-lg mb-6">A collection of our special moments and dreams</p>
        
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {isFormVisible ? 'Cancel' : 'Add New Story'}
        </button>
      </div>

      {isFormVisible && (
        <div className="mb-10">
          <AddStoryForm onAddStory={addStory} />
        </div>
      )}

      {stories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No stories yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => (
            <StoryCard 
              key={story.id} 
              story={story} 
              onDelete={deleteStory} 
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default StoriesPage; 