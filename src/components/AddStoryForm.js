import React, { useState } from 'react';

const AddStoryForm = ({ onAddStory }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Create new story object
    const newStory = {
      title,
      content,
      image: image.trim() || null
    };
    
    // Pass to parent component
    onAddStory(newStory);
    
    // Reset form
    setTitle('');
    setContent('');
    setImage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-center">Add a New Story</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter a title for your story"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Story
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="6"
            placeholder="Write your story here..."
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
            Image URL (optional)
          </label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter an image URL"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to use a random image based on your title
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow hover:shadow-lg transition-all duration-300"
          >
            Save Story
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStoryForm; 