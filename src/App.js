import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import StoriesPage from './pages/StoriesPage';
import MusicPage from './components/music/MusicPage';
import MemoriesPage from './components/memories/MemoriesPage';
import DreamsPage from './components/dreams/DreamsPage';
import CalendarPage from './components/calendar/CalendarPage';
import QuizPage from './components/quiz/QuizPage';
import SettingsPanel from './components/layout/SettingsPanel';
import LoveNote from './components/layout/LoveNote';
import Footer from './components/layout/Footer';
import ThemeProvider from './components/themes/ThemeProvider';
import Layout from './components/layout/Layout';
import StoryCard from './components/StoryCard';
import AddStoryForm from './components/AddStoryForm';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('stories');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loveNoteOpen, setLoveNoteOpen] = useState(false);
  const [stories, setStories] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Create a background blob effect
  const [backgroundStyle, setBackgroundStyle] = useState({
    backgroundImage: "linear-gradient(to bottom right, rgba(255,182,193,0.4), rgba(147,112,219,0.4)), url('/images/gallery.jpg')",
    backgroundSize: '110%',
    filter: 'blur(10px)',
    transform: 'scale(1)'
  });

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

  // Handle page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Set background image based on selected page
    const backgroundImageMap = {
      stories: "linear-gradient(to bottom right, rgba(255,182,193,0.4), rgba(147,112,219,0.4)), url('/images/gallery.jpg')",
      music: "linear-gradient(to bottom right, rgba(255,182,193,0.4), rgba(147,112,219,0.4)), url('/images/music-bg.jpg')",
      memories: "linear-gradient(to bottom right, rgba(255,180,190,0.4), rgba(180,144,202,0.4)), url('/images/memories-bg.jpg')",
      dreams: "linear-gradient(to bottom right, rgba(180,200,255,0.4), rgba(147,112,219,0.4)), url('/public/assets/dreams/dreams-bg.jpg')",
      calendar: "linear-gradient(to bottom right, rgba(255,182,193,0.4), rgba(180,144,202,0.4)), url('/public/assets/calendar/calendar-bg.jpg')",
      quiz: "linear-gradient(to bottom right, rgba(255,182,193,0.4), rgba(147,112,219,0.4)), url('/public/assets/quiz/quiz-bg.jpg')"
    };
    
    setBackgroundStyle(prev => ({
      ...prev,
      backgroundImage: backgroundImageMap[page] || backgroundImageMap.stories
    }));
  };
  
  // Toggle settings panel
  const toggleSettings = () => setSettingsOpen(prev => !prev);
  
  // Toggle love note
  const toggleLoveNote = () => setLoveNoteOpen(prev => !prev);
  
  // Update background style based on settings
  const updateBackgroundStyle = (zoom, blur) => {
    setBackgroundStyle(prev => ({
      ...prev,
      backgroundSize: `${zoom * 100}%`,
      filter: `blur(${blur}px)`,
      transform: `scale(${zoom})`
    }));
  };

  const addStory = (newStory) => {
    setStories([...stories, { ...newStory, id: Date.now(), date: new Date().toISOString() }]);
    setIsFormVisible(false);
  };

  const deleteStory = (id) => {
    setStories(stories.filter(story => story.id !== id));
  };

  return (
    <ThemeProvider>
      <div className="App min-h-screen relative overflow-hidden">
        {/* Global background */}
        <div 
          id="globalBackground" 
          className="fixed top-0 left-0 w-full h-full bg-center bg-no-repeat z-[-2] overflow-hidden"
          style={backgroundStyle}
        ></div>
        
        {/* Global noise overlay */}
        <div 
          id="globalNoise" 
          className="fixed top-0 left-0 w-full h-full bg-repeat opacity-20 mix-blend-overlay z-[-1]"
        ></div>
        
        <Header />
        
        <Navigation 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
        />
        
        {/* Page content */}
        <div className="container mx-auto px-4 relative z-10">
          {currentPage === 'stories' && (
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
          )}
          {currentPage === 'music' && <MusicPage />}
          {currentPage === 'memories' && <MemoriesPage />}
          {currentPage === 'dreams' && <DreamsPage />}
          {currentPage === 'calendar' && <CalendarPage />}
          {currentPage === 'quiz' && <QuizPage />}
        </div>
        
        {/* Settings icon */}
        <button 
          className="fixed top-4 right-4 bg-romance-600/60 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer z-50 shadow-md backdrop-blur-sm transition-all hover:rotate-12"
          onClick={toggleSettings}
          aria-label="Open settings"
        >
          <span className="material-icons text-white drop-shadow-md">settings</span>
        </button>
        
        {/* Love note button */}
        <button 
          className="fixed bottom-4 right-4 bg-romance-600/60 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer z-50 shadow-md backdrop-blur-sm transition-all animate-pulse-slow"
          onClick={toggleLoveNote}
          aria-label="Open love note"
        >
          <span className="material-icons text-white drop-shadow-md">favorite</span>
        </button>
        
        {/* Settings panel */}
        <SettingsPanel 
          isOpen={settingsOpen} 
          onClose={() => setSettingsOpen(false)}
          onUpdateBackground={updateBackgroundStyle}
        />
        
        {/* Love note */}
        <LoveNote 
          isOpen={loveNoteOpen} 
          onClose={() => setLoveNoteOpen(false)} 
        />
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App; 