/**
 * Main JavaScript file for Bedtime Stories App
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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
  // Settings icon click event
  const settingsIcon = document.getElementById('settingsIcon');
  if (settingsIcon) {
    settingsIcon.addEventListener('click', () => {
      const settingsPanel = document.getElementById('settingsPanel');
      settingsPanel.classList.toggle('hidden');
      console.log('Settings panel toggled:', !settingsPanel.classList.contains('hidden'));
    });
  }
  
  // Close settings button
  const closeSettingsBtn = document.getElementById('closeSettings');
  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
      const settingsPanel = document.getElementById('settingsPanel');
      if (settingsPanel) {
        settingsPanel.classList.add('hidden');
      }
    });
  }
  
  // Background zoom slider
  const zoomSlider = document.getElementById('zoomSlider');
  if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => {
      updateBackgroundEffects();
    });
  }
  
  // Background blur slider
  const blurSlider = document.getElementById('blurSlider');
  if (blurSlider) {
    blurSlider.addEventListener('input', (e) => {
      updateBackgroundEffects();
    });
  }
  
  // Love note button
  const loveNoteBtn = document.getElementById('loveNoteButton');
  if (loveNoteBtn) {
    loveNoteBtn.addEventListener('click', () => {
      const loveNote = document.getElementById('loveNote');
      if (loveNote) {
        loveNote.classList.remove('hidden');
      }
    });
  }
  
  // Close love note button
  const closeLoveNoteBtn = document.getElementById('closeLoveNote');
  if (closeLoveNoteBtn) {
    closeLoveNoteBtn.addEventListener('click', () => {
      const loveNote = document.getElementById('loveNote');
      if (loveNote) {
        loveNote.classList.add('hidden');
      }
    });
  }
}

let currentStory = [];
let currentSceneIndex = 0;
let audioElement = null;
let volumeTimeout = null;
let preloadedImages = [];
let isTransitioning = false; // Flag to prevent multiple transitions at once
let transitionTimeouts = []; // Array to track active transition timeouts

/**
 * Helper function to clear all transition timeouts
 */
function clearTransitionTimeouts() {
  transitionTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  transitionTimeouts = [];
}

/**
 * Preloads all scene images for the chosen story.
 */
function preloadStoryImages(storyData, folder) {
  preloadedImages.forEach(img => { img.src = ""; });
  preloadedImages = [];
  storyData.forEach(scene => {
    if (scene.image) {
      const img = new Image();
      img.src = `images/${folder}/${scene.image}`;
      preloadedImages.push(img);
    }
  });
}

/**
 * Unloads preloaded images.
 */
function unloadStoryImages() {
  preloadedImages.forEach(img => { img.src = ""; });
  preloadedImages = [];
}

/**
 * Updates the global background's zoom and blur.
 * Automatically increases zoom slightly as blur increases to avoid white edges.
 */
function updateBackgroundEffects() {
  const zoomSlider = document.getElementById('zoomSlider');
  const blurSlider = document.getElementById('blurSlider');
  
  if (!zoomSlider || !blurSlider) return;
  
  const zoomVal = zoomSlider.value;
  const blurVal = blurSlider.value;
  
  // Calculate additional zoom based on blur value (higher blur = more zoom)
  // This helps prevent white edges from appearing
  const blurZoomCompensation = 1 + (blurVal / 100);
  
  const globalBg = document.getElementById('globalBackground');
  if (globalBg) {
    globalBg.style.backgroundSize = (zoomVal * 100 * blurZoomCompensation) + "%";
    globalBg.style.filter = `blur(${blurVal}px)`;
  }
}

/**
 * Loads a story into the game container and sets up the scene navigation.
 * @param {Array} storyData - The array of scene objects for the story
 * @param {string} folder - The folder name for the story's resources
 */
function loadStoryData(storyData, folder) {
  if (isTransitioning) return;
  isTransitioning = true;
  
  // Store story data globally
  currentStory = storyData.map(scene => ({ ...scene }));
  currentStory.folder = folder;
  currentSceneIndex = 0;
  
  // Clear any existing audio and preload images
  if (audioElement) {
    audioElement.pause();
    audioElement.src = "";
  }
  preloadStoryImages(storyData, folder);
  
  // Hide the gallery and show the game container with fade effect
  const gallery = document.getElementById("gallery");
  const gameContainer = document.getElementById("gameContainer");
  
  if (gallery && gameContainer) {
    // Gallery is already fading out (handled in storyLoader.js)
    
    // After gallery has faded out, show the game container
    setTimeout(() => {
      gameContainer.style.display = "flex";
      gameContainer.classList.remove("hidden");
      
      // Apply fade-in after a short delay
      setTimeout(() => {
        gameContainer.classList.add("fade-in");
        
        // Reset the transition flag after animation completes
        setTimeout(() => {
          isTransitioning = false;
        }, 500);
      }, 50);
      
      // Show the first scene
      showScene(0);
      
      // Set up audio player
      setupAudio();
      setupAudioPlayerControls();
    }, 500); // Match this with the CSS transition duration
  }
}

/**
 * Initialize the game content with the story data
 */
function initializeGameContent(storyData, folder) {
  // Setup the game container with necessary elements
  const gameDiv = document.getElementById("game");
  if (!gameDiv) return;
  
  // Clear any existing content
  gameDiv.innerHTML = '';
  
  // Set up scene container
  const sceneContainer = document.createElement('div');
  sceneContainer.className = 'scene';
  
  // Add scene content container
  const sceneContentContainer = document.createElement('div');
  sceneContentContainer.id = 'sceneContainer';
  sceneContainer.appendChild(sceneContentContainer);
  
  // Add navigation buttons
  const navButtonsContainer = document.createElement('div');
  navButtonsContainer.className = 'nav-buttons';
  
  const prevButton = document.createElement('button');
  prevButton.id = 'prevButton';
  prevButton.innerHTML = '<span class="material-icons">arrow_back</span>Previous';
  prevButton.addEventListener('click', () => {
    if (currentSceneIndex > 0) {
      showScene(currentSceneIndex - 1);
    }
  });
  
  const nextButton = document.createElement('button');
  nextButton.id = 'nextButton';
  nextButton.innerHTML = 'Next<span class="material-icons">arrow_forward</span>';
  nextButton.addEventListener('click', () => {
    if (currentSceneIndex < currentStory.length - 1) {
      showScene(currentSceneIndex + 1);
    }
  });
  
  navButtonsContainer.appendChild(prevButton);
  navButtonsContainer.appendChild(nextButton);
  sceneContainer.appendChild(navButtonsContainer);
  
  // Add audio player elements
  const audioPlayer = document.createElement('div');
  audioPlayer.id = 'audioPlayer';
  
  const audioProgress = document.createElement('div');
  audioProgress.id = 'audioProgress';
  
  const audioProgressBar = document.createElement('div');
  audioProgressBar.id = 'audioProgressBar';
  audioProgress.appendChild(audioProgressBar);
  
  const sceneIndicators = document.createElement('div');
  sceneIndicators.id = 'sceneIndicators';
  audioProgress.appendChild(sceneIndicators);
  
  audioPlayer.appendChild(audioProgress);
  
  const audioControls = document.createElement('div');
  audioControls.id = 'audioControls';
  audioControls.innerHTML = `
    <button id="goStart"><span class="material-icons">first_page</span></button>
    <button id="playPauseBtn"><span class="material-icons">play_arrow</span></button>
    <button id="goEnd"><span class="material-icons">last_page</span></button>
    <button id="volumeToggle"><span class="material-icons">volume_up</span></button>
  `;
  
  audioPlayer.appendChild(audioControls);
  
  const volumeControl = document.createElement('div');
  volumeControl.id = 'volumeControl';
  volumeControl.className = 'hidden';
  
  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.id = 'volumeSlider';
  volumeSlider.min = '0';
  volumeSlider.max = '1';
  volumeSlider.step = '0.01';
  volumeSlider.value = '0.5';
  
  volumeControl.appendChild(volumeSlider);
  audioPlayer.appendChild(volumeControl);
  
  sceneContainer.appendChild(audioPlayer);
  gameDiv.appendChild(sceneContainer);
  
  // Set background to first scene image
  if (storyData[0] && storyData[0].image) {
    document.getElementById('globalBackground').style.backgroundImage = 
      `url('images/${folder}/${storyData[0].image}')`;
  }
  
  // Show the first scene
  showScene(0);
  
  // Setup audio
  setupAudio();
  setupAudioPlayerControls();
}

/**
 * Returns to the gallery view from a story
 */
function returnToGallery() {
  if (isTransitioning) return;
  isTransitioning = true;
  
  // Fade out game container first
  const gameContainer = document.getElementById("gameContainer");
  const gallery = document.getElementById("gallery");
  
  if (gameContainer) {
    gameContainer.classList.remove("fade-in");
    
    // After fade-out animation completes, hide and reset
    setTimeout(() => {
      if (gameContainer) {
        gameContainer.classList.add("hidden");
        gameContainer.style.display = "none";
      }
      
      // Clear all story resources
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
      unloadStoryImages();
      
      // Show gallery with fade-in effect
      if (gallery) {
        gallery.style.display = "flex";
        gallery.classList.remove("hidden");
        gallery.classList.remove("fade-out");
        
        // Reset global background
        document.getElementById('globalBackground').style.backgroundImage = 
          "linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url('images/gallery.jpg')";
          
        updateBackgroundEffects();
        
        // Call setupGallery to ensure the layout is correct
        if (typeof setupGallery === 'function') {
          setupGallery();
        }
      }
      
      // Reset the transition flag after animation completes
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }, 500); // Match this with the CSS transition duration
  }
}

/**
 * Sets up the Audio element.
 */
function setupAudio() {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = "auto";
    audioElement.addEventListener("timeupdate", updateAudioProgress);
    audioElement.addEventListener("ended", () => {
      setTimeout(() => returnToGallery(), 5000);
    });
  }
  
  if (currentStory && currentStory.folder) {
    audioElement.src = `audios/${currentStory.folder}/recording.mp3`;
    audioElement.load();
  }
}

/**
 * Updates the audio progress bar and auto-advances scenes.
 * Uses the current scene's "end" property.
 */
function updateAudioProgress() {
  const progressBar = document.getElementById("audioProgressBar");
  if (audioElement && audioElement.duration) {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = percent + "%";
    updateSceneIndicators();
  }
  
  if (currentStory && currentStory[currentSceneIndex]) {
    const sceneEnd = currentStory[currentSceneIndex].end;
    if (sceneEnd !== undefined && audioElement.currentTime >= sceneEnd) {
      if (currentSceneIndex < currentStory.length - 1) {
        showScene(currentSceneIndex + 1);
      } else if (audioElement.currentTime >= audioElement.duration) {
        setTimeout(() => returnToGallery(), 5000);
      }
    }
  }
}

/**
 * Creates clickable triangle markers for each scene's "start" time (except scene0).
 */
function updateSceneIndicators() {
  const indicatorsContainer = document.getElementById("sceneIndicators");
  if (!indicatorsContainer) return;
  
  indicatorsContainer.innerHTML = "";
  
  if (audioElement && audioElement.duration && currentStory) {
    currentStory.forEach((scene, idx) => {
      if (idx > 0 && scene.start !== undefined) {
        const posPercent = (scene.start / audioElement.duration) * 100;
        const indicator = document.createElement("div");
        indicator.className = "scene-indicator";
        indicator.innerHTML = `<svg viewBox="0 0 10 10" width="10" height="10"><polygon points="5,0 10,10 0,10"/></svg>`;
        indicator.style.left = posPercent + "%";
        indicator.addEventListener("click", () => {
          showScene(idx);
          audioElement.currentTime = scene.start;
        });
        indicatorsContainer.appendChild(indicator);
      }
    });
  }
}

/**
 * Sets up the audio player controls.
 */
function setupAudioPlayerControls() {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const goStartBtn = document.getElementById("goStart");
  const goEndBtn = document.getElementById("goEnd");
  const volumeToggle = document.getElementById("volumeToggle");
  const volumeSlider = document.getElementById("volumeSlider");
  
  if (!playPauseBtn || !goStartBtn || !goEndBtn || !volumeToggle || !volumeSlider) return;

  playPauseBtn.addEventListener("click", togglePlayPause);
  goStartBtn.addEventListener("click", goToStart);
  goEndBtn.addEventListener("click", goToEnd);
  
  volumeToggle.addEventListener("click", () => {
    const volumeControl = document.getElementById("volumeControl");
    volumeControl.classList.toggle("hidden");
    
    // Hide volume slider after 3 seconds of inactivity
    clearTimeout(volumeTimeout);
    volumeTimeout = setTimeout(() => {
      volumeControl.classList.add("hidden");
    }, 3000);
  });
  
  volumeSlider.addEventListener("input", (e) => {
    if (audioElement) {
      audioElement.volume = e.target.value;
    }
    
    // Reset the auto-hide timeout while adjusting
    clearTimeout(volumeTimeout);
    volumeTimeout = setTimeout(() => {
      document.getElementById("volumeControl").classList.add("hidden");
    }, 3000);
  });
}

/**
 * Toggles play/pause state of the audio
 */
function togglePlayPause() {
  const playPauseBtn = document.getElementById("playPauseBtn");
  
  if (!audioElement || !playPauseBtn) return;
  
  if (audioElement.paused) {
    // If on scene0, skip to scene1 and seek to its "start" if defined
    if (currentSceneIndex === 0 && currentStory.length > 1 && currentStory[1].start !== undefined) {
      showScene(1);
      audioElement.currentTime = currentStory[1].start;
    }
    
    audioElement.play();
    playPauseBtn.innerHTML = '<span class="material-icons">pause</span>';
  } else {
    audioElement.pause();
    playPauseBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
  }
}

/**
 * Go to the beginning of the story
 */
function goToStart() {
  if (!audioElement) return;
  
  showScene(0);
  audioElement.currentTime = 0;
  audioElement.pause();
  
  const playPauseBtn = document.getElementById("playPauseBtn");
  if (playPauseBtn) {
    playPauseBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
  }
}

/**
 * Go to the end of the story
 */
function goToEnd() {
  if (!audioElement || !currentStory) return;
  
  const lastIndex = currentStory.length - 1;
  showScene(lastIndex);
  
  if (currentStory[lastIndex] && currentStory[lastIndex].start) {
    audioElement.currentTime = currentStory[lastIndex].start;
  }
}

/**
 * Shows a specific scene by index.
 */
function showScene(index) {
  if (!currentStory || index < 0 || index >= currentStory.length) return;
  
  currentSceneIndex = index;
  const scene = currentStory[index];
  const sceneContainer = document.getElementById('sceneContainer');
  
  if (!sceneContainer) return;
  
  // Update scene content
  sceneContainer.innerHTML = "";
  
  // Create scene content with fade in animation
  const sceneContent = document.createElement('div');
  sceneContent.className = 'scene-content';
  
  if (scene.title) {
    const title = document.createElement('h1');
    title.textContent = scene.title;
    sceneContent.appendChild(title);
  }
  
  if (scene.text) {
    const text = document.createElement('p');
    text.textContent = scene.text;
    sceneContent.appendChild(text);
  }
  
  if (scene.image) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    
    const img = document.createElement('img');
    img.className = 'scene-img';
    img.src = `images/${currentStory.folder}/${scene.image}`;
    img.alt = scene.title || `Scene ${index}`;
    
    imageContainer.appendChild(img);
    sceneContent.appendChild(imageContainer);
    
    // Update background to match current scene
    document.getElementById('globalBackground').style.backgroundImage = 
      `url('images/${currentStory.folder}/${scene.image}')`;
  }
  
  sceneContainer.appendChild(sceneContent);
  
  // Update button states
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  
  if (prevButton) {
    prevButton.disabled = index === 0;
  }
  
  if (nextButton) {
    nextButton.disabled = index === currentStory.length - 1;
  }
}

// Make functions available globally for use by other scripts
window.loadStoryData = loadStoryData;
window.returnToGallery = returnToGallery;
window.updateBackgroundEffects = updateBackgroundEffects;