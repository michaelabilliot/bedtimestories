import React, { createContext, useState, useContext, useEffect } from 'react';
import { useApp } from './AppContext';
import { useSettings } from './SettingsContext';

// Create context
const StoriesContext = createContext();

// Custom hook for using the context
export const useStories = () => useContext(StoriesContext);

// Provider component
export const StoriesProvider = ({ children }) => {
  const { showError } = useApp();
  const { setBackground } = useSettings();
  
  const [availableStories, setAvailableStories] = useState([]);
  const [storyPlaying, setStoryPlaying] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [audioElement, setAudioElement] = useState(null);
  const [preloadedImages, setPreloadedImages] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Initialize available stories
  useEffect(() => {
    // Get the base URL for the project
    const basePath = window.location.pathname.endsWith('/') ? 
      window.location.pathname : 
      window.location.pathname + '/';
      
    const stories = [
      { title: "Friends Tale", file: "friends-tale", cover: `${basePath}images/friends-tale/cover.jpg`, order: 1, today: false, description: "A heartwarming tale of friendship and love" },
      { title: "Little Sleepy Star", file: "sleepy-star", cover: `${basePath}images/sleepy-star/cover.jpg`, order: 2, today: true, description: "A magical bedtime adventure with a sleepy little star" },
      { title: "Cat", file: "cat", cover: `${basePath}images/cat/cover.jpg`, order: 3, today: false, description: "A story about a cat" }
    ];
    
    // Sort stories by order
    stories.sort((a, b) => a.order - b.order);
    setAvailableStories(stories);
    
    // Create audio element
    const audio = new Audio();
    audio.preload = "auto";
    setAudioElement(audio);
    
    // Clean up audio element on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);
  
  // Set up audio event listeners
  useEffect(() => {
    if (!audioElement) return;
    
    const handleTimeUpdate = () => {
      if (!currentStory || !audioElement) return;
      
      // Check if we need to auto-advance to the next scene
      const scene = currentStory[currentSceneIndex];
      if (scene && scene.end !== undefined && audioElement.currentTime >= scene.end) {
        if (currentSceneIndex < currentStory.length - 1) {
          showScene(currentSceneIndex + 1);
        }
      }
    };
    
    const handleEnded = () => {
      // Return to gallery after audio ends
      setTimeout(() => returnToGallery(), 5000);
    };
    
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);
    
    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [audioElement, currentStory, currentSceneIndex]);
  
  // Load story data
  const loadStory = async (storyFile) => {
    try {
      // Get the base URL for the project, works in both local and GitHub Pages environments
      const basePath = window.location.pathname.endsWith('/') ? 
        window.location.pathname : 
        window.location.pathname + '/';
      
      const path = `${basePath}stories/${storyFile}.json`;
      
      let response = await fetch(path);
      
      if (!response.ok) {
        // If the first approach fails, try a relative path
        console.log(`Failed to load from ${path}, trying relative path...`);
        response = await fetch(`stories/${storyFile}.json`);
      }
      
      if (!response.ok) {
        throw new Error("Failed to load story: " + response.statusText);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error loading story:", error);
      showError("Failed to load story. Please try again.");
      return null;
    }
  };
  
  // Load a story
  const playStory = async (storyFile) => {
    const storyData = await loadStory(storyFile);
    if (!storyData) return;
    
    const story = availableStories.find(s => s.file === storyFile);
    if (!story) return;
    
    // Preload images
    preloadStoryImages(storyData, storyFile);
    
    // Get the base URL for the project
    const basePath = window.location.pathname.endsWith('/') ? 
      window.location.pathname : 
      window.location.pathname + '/';
    
    // Set up audio
    if (audioElement) {
      audioElement.src = `${basePath}audios/${storyFile}/recording.mp3`;
      audioElement.load();
    }
    
    setCurrentStory(storyData);
    setCurrentSceneIndex(0);
    setStoryPlaying(true);
    
    // Show first scene
    showScene(0);
  };
  
  // Preload images for the story
  const preloadStoryImages = (storyData, folder) => {
    // Clear any existing preloaded images
    preloadedImages.forEach(img => { img.src = ""; });
    
    // Get the base URL for the project
    const basePath = window.location.pathname.endsWith('/') ? 
      window.location.pathname : 
      window.location.pathname + '/';
    
    const newImages = [];
    storyData.forEach(scene => {
      if (scene.image) {
        const img = new Image();
        img.src = `${basePath}images/${folder}/${scene.image}`;
        newImages.push(img);
      }
    });
    
    setPreloadedImages(newImages);
  };
  
  // Show a specific scene
  const showScene = (index) => {
    if (!currentStory || isTransitioning) return;
    
    const newIndex = Math.max(0, Math.min(currentStory.length - 1, index));
    setIsTransitioning(true);
    
    // Set current scene index
    setCurrentSceneIndex(newIndex);
    
    // If there's audio and we're moving to a new scene, seek to its start time
    if (audioElement && currentStory[newIndex].start !== undefined) {
      audioElement.currentTime = currentStory[newIndex].start;
      
      // Auto-play from this point
      if (audioElement.paused) {
        audioElement.play().catch(error => {
          console.error("Error playing audio:", error);
          showError("Could not play audio. Please try again.");
        });
      }
    }
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  // Return to gallery
  const returnToGallery = () => {
    // Stop audio if playing
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    
    // Clear all story states
    setStoryPlaying(false);
    setCurrentSceneIndex(0);
    setCurrentStory(null);
    
    // Unload preloaded images
    preloadedImages.forEach(img => { img.src = ""; });
    setPreloadedImages([]);
    
    // Set background back to gallery
    setBackground("images/gallery.jpg");
  };
  
  return (
    <StoriesContext.Provider value={{
      availableStories,
      storyPlaying,
      currentStory,
      currentSceneIndex,
      audioElement,
      isTransitioning,
      loadStory,
      playStory,
      showScene,
      returnToGallery
    }}>
      {children}
    </StoriesContext.Provider>
  );
}; 