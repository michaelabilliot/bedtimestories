/**
 * Main JavaScript file for Bedtime Stories App
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize page handler
  if (typeof initPageHandler === 'function') {
    initPageHandler();
  }
  
  // Set up event listeners for settings
  setupSettingsListeners();
  
  // Initialize the gallery
  if (typeof setupGallery === 'function') {
    setupGallery();
  }
});

/**
 * Set up event listeners for settings panel
 */
function setupSettingsListeners() {
  // Close settings button
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
      const settingsPanel = document.getElementById('settingsPanel');
      if (settingsPanel) {
        settingsPanel.classList.add('hidden');
      }
    });
  }
  
  // Background music volume
  const bgMusicVolumeSlider = document.getElementById('bgMusicVolume');
  if (bgMusicVolumeSlider) {
    // Load saved volume or use default
    const savedVolume = localStorage.getItem('bgMusicVolume');
    if (savedVolume !== null) {
      bgMusicVolumeSlider.value = savedVolume;
      updateBackgroundMusicVolume(savedVolume);
    }
    
    // Update volume when slider changes
    bgMusicVolumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value;
      updateBackgroundMusicVolume(volume);
      localStorage.setItem('bgMusicVolume', volume);
    });
  }
  
  // Sound effects volume
  const sfxVolumeSlider = document.getElementById('sfxVolume');
  if (sfxVolumeSlider) {
    // Load saved volume or use default
    const savedVolume = localStorage.getItem('sfxVolume');
    if (savedVolume !== null) {
      sfxVolumeSlider.value = savedVolume;
      updateSoundEffectsVolume(savedVolume);
    }
    
    // Update volume when slider changes
    sfxVolumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value;
      updateSoundEffectsVolume(volume);
      localStorage.setItem('sfxVolume', volume);
    });
  }
}

/**
 * Update background music volume
 * @param {number} volume - Volume level (0-1)
 */
function updateBackgroundMusicVolume(volume) {
  // Update background music volume if audio player exists
  const bgMusic = document.getElementById('backgroundMusic');
  if (bgMusic) {
    bgMusic.volume = volume;
  }
}

/**
 * Update sound effects volume
 * @param {number} volume - Volume level (0-1)
 */
function updateSoundEffectsVolume(volume) {
  // Store the volume setting for sound effects
  window.sfxVolume = volume;
}

/**
 * Load story data and initialize the game
 * @param {string} storyId - ID of the story to load
 */
function loadStoryData(storyId) {
  // Hide the gallery and navigation tabs
  const gallery = document.getElementById('gallery');
  const navigationTabs = document.getElementById('navigationTabs');
  
  if (gallery) {
    gallery.classList.add('hidden');
    gallery.style.display = 'none';
  }
  
  if (navigationTabs) {
    navigationTabs.classList.add('hidden');
  }
  
  // Show the game container
  const gameContainer = document.getElementById('gameContainer');
  if (gameContainer) {
    gameContainer.classList.remove('hidden');
    gameContainer.style.display = 'flex';
  }
  
  // Fetch the story data
  fetch(`stories/${storyId}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load story data');
      }
      return response.json();
    })
    .then(data => {
      // Store the story data globally
      window.storyData = data;
      
      // Set the story title
      const storyTitle = document.getElementById('storyTitle');
      if (storyTitle) {
        storyTitle.textContent = data.title;
      }
      
      // Update the background image if provided
      if (data.backgroundImage) {
        document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('images/${data.backgroundImage}')`;
      }
      
      // Show the first scene
      showScene(0);
      
      // Set up audio
      setupAudio();
      setupAudioPlayerControls();
    })
    .catch(error => {
      console.error('Error loading story:', error);
      alert('Failed to load the story. Please try again later.');
    });
}

/**
 * Return to the gallery view
 */
function returnToGallery() {
  // Hide the game container
  const gameContainer = document.getElementById('gameContainer');
  if (gameContainer) {
    gameContainer.classList.add('hidden');
    gameContainer.style.display = 'none';
  }
  
  // Show the gallery and navigation tabs
  const gallery = document.getElementById('gallery');
  const navigationTabs = document.getElementById('navigationTabs');
  
  if (gallery) {
    gallery.classList.remove('hidden');
    gallery.style.display = 'flex';
  }
  
  if (navigationTabs) {
    navigationTabs.classList.remove('hidden');
  }
  
  // Reset the background
  const storiesTheme = localStorage.getItem('bedtimeStoriesTheme') || 'pink';
  if (typeof setPageBackground === 'function') {
    setPageBackground(storiesTheme, true);
  }
  
  // Stop any playing audio
  const audio = document.getElementById('sceneAudio');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

// Make functions available globally
window.loadStoryData = loadStoryData;
window.returnToGallery = returnToGallery;