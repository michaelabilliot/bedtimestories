// main.js

let currentStory = [];
let currentSceneIndex = 0;
let audioElement = null;
let volumeTimeout = null;
let preloadedImages = [];

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
  const zoomVal = zoomSlider.value;
  const blurVal = blurSlider.value;
  
  // Calculate additional zoom based on blur value (higher blur = more zoom)
  // This helps prevent white edges from appearing
  const blurZoomCompensation = 1 + (blurVal / 100);
  
  const globalBg = document.getElementById('globalBackground');
  globalBg.style.backgroundSize = (zoomVal * 100 * blurZoomCompensation) + "%";
  globalBg.style.filter = `blur(${blurVal}px)`;
}

/* Attach slider events */
document.getElementById('zoomSlider').addEventListener('input', updateBackgroundEffects);
document.getElementById('blurSlider').addEventListener('input', updateBackgroundEffects);

/* Toggle settings panel */
document.getElementById('settingsIcon').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.toggle('hidden');
});

/* Close settings panel */
document.getElementById('closeSettings').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.add('hidden');
});

/* Toggle love note panel */
document.getElementById('loveNoteButton').addEventListener('click', () => {
  document.getElementById('loveNote').classList.toggle('hidden');
});

/* Close love note panel */
document.getElementById('closeLoveNote').addEventListener('click', () => {
  document.getElementById('loveNote').classList.add('hidden');
});

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
  audioElement.src = `audios/${currentStory.folder}/recording.mp3`;
  audioElement.load();
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
  
  const sceneEnd = currentStory[currentSceneIndex].end;
  if (sceneEnd !== undefined && audioElement.currentTime >= sceneEnd) {
    if (currentSceneIndex < currentStory.length - 1) {
      showScene(currentSceneIndex + 1);
    } else if (audioElement.currentTime >= audioElement.duration) {
      setTimeout(() => returnToGallery(), 5000);
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
  if (audioElement && audioElement.duration) {
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

  playPauseBtn.addEventListener("click", () => {
    if (audioElement.paused) {
      // If on scene0, skip to scene1 and seek to its "start" if defined
      if (currentSceneIndex === 0 && currentStory.length > 1) {
        showScene(1);
        if (currentStory[1].start !== undefined) {
          audioElement.currentTime = currentStory[1].start;
        }
      }
      audioElement.play();
      playPauseBtn.innerHTML = `<span class="material-icons">pause</span>`;
    } else {
      audioElement.pause();
      playPauseBtn.innerHTML = `<span class="material-icons">play_arrow</span>`;
    }
  });

  goStartBtn.addEventListener("click", () => {
    const sceneStart = currentStory[currentSceneIndex].start;
    audioElement.currentTime = sceneStart !== undefined ? sceneStart : 0;
  });
  goEndBtn.addEventListener("click", () => {
    const sceneEnd = currentStory[currentSceneIndex].end;
    audioElement.currentTime = sceneEnd !== undefined ? sceneEnd : audioElement.duration;
  });

  volumeToggle.addEventListener("click", () => {
    const volCtrl = document.getElementById("volumeControl");
    volCtrl.classList.toggle("hidden");
    if (!volCtrl.classList.contains("hidden")) {
      if (volumeTimeout) clearTimeout(volumeTimeout);
      volumeTimeout = setTimeout(() => { volCtrl.classList.add("hidden"); }, 3000);
    }
  });
  volumeSlider.addEventListener("input", (e) => {
    audioElement.volume = e.target.value;
    const volCtrl = document.getElementById("volumeControl");
    if (volumeTimeout) clearTimeout(volumeTimeout);
    volumeTimeout = setTimeout(() => { volCtrl.classList.add("hidden"); }, 3000);
  });
}

/**
 * Displays a scene by index.
 */
function showScene(index) {
  if (index < 0 || index >= currentStory.length) return;
  
  // Remember the previous scene index for comparison
  const prevSceneIndex = currentSceneIndex;
  currentSceneIndex = index;
  
  // Update background image if the scene has one.
  if (currentStory[index].image) {
    document.getElementById('globalBackground').style.backgroundImage = `url('images/${currentStory.folder}/${currentStory[index].image}')`;
  }
  
  const gameDiv = document.getElementById("game");
  
  // If this is the first scene (index 0), or we're coming back from the gallery, 
  // build the entire scene container
  if (prevSceneIndex === -1 || !gameDiv.querySelector('.scene')) {
    // Build the complete scene HTML from scratch
    let html = `<div class="scene">`;
    
    // Scene image
    if (currentStory[index].image) {
      html += `<img class="scene-img" src="images/${currentStory.folder}/${currentStory[index].image}" alt="Scene ${index + 1}">`;
    }
    
    // Scene content with a frame
    html += `<div class="scene-content">
      <div class="content-frame">
        ${currentStory[index].content}
        ${index === currentStory.length - 1 ? '<p class="ending-message">The End <span class="heart-icon">♥</span></p>' : ''}
      </div>
    </div>`;
    
    // Navigation buttons
    html += `<div class="nav-buttons">`;
    if (index > 0) {
      html += `<button id="prevBtn"><span class="material-icons">arrow_back</span>Previous</button>`;
    }
    if (index < currentStory.length - 1) {
      html += `<button id="nextBtn">Next<span class="material-icons">arrow_forward</span></button>`;
    } else {
      html += `<button id="restartBtn"><span class="material-icons">home</span>Back to Gallery</button>`;
    }
    html += `</div>`; // End nav-buttons

    // Audio Player UI
    html += `
      <div id="audioPlayer">
        <div id="audioProgress">
          <div id="audioProgressBar"></div>
          <div id="sceneIndicators"></div>
        </div>
        <div id="audioControls">
          <button id="goStart"><span class="material-icons">first_page</span></button>
          <button id="playPauseBtn"><span class="material-icons">play_arrow</span></button>
          <button id="goEnd"><span class="material-icons">last_page</span></button>
          <button id="volumeToggle"><span class="material-icons">volume_up</span></button>
        </div>
        <div id="volumeControl" class="hidden">
          <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="0.5">
        </div>
      </div>
    `;
    
    html += `</div>`; // End .scene
    gameDiv.innerHTML = html;
  } else {
    // If we're just changing scenes, update only the image and content
    // First, fade out the current content frame
    const currentFrame = gameDiv.querySelector('.content-frame');
    const currentImg = gameDiv.querySelector('.scene-img');
    
    // Create a fade out effect for current elements
    if (currentFrame) {
      currentFrame.style.opacity = '0';
      currentFrame.style.transform = 'translateY(10px)';
    }
    
    // Update the image with a smooth transition
    if (currentImg && currentStory[index].image) {
      // Create a new image element
      const newImg = document.createElement('img');
      newImg.className = 'scene-img';
      newImg.src = `images/${currentStory.folder}/${currentStory[index].image}`;
      newImg.alt = `Scene ${index + 1}`;
      newImg.style.opacity = '0';
      
      // Insert the new image before the current one
      currentImg.parentNode.insertBefore(newImg, currentImg);
      
      // Fade in the new image and remove the old one after transition
      setTimeout(() => {
        newImg.style.opacity = '1';
        currentImg.style.opacity = '0';
        setTimeout(() => {
          currentImg.remove();
        }, 500);
      }, 50);
    }
    
    // Update navigation buttons
    const navButtons = gameDiv.querySelector('.nav-buttons');
    if (navButtons) {
      let navHtml = '';
      if (index > 0) {
        navHtml += `<button id="prevBtn"><span class="material-icons">arrow_back</span>Previous</button>`;
      }
      if (index < currentStory.length - 1) {
        navHtml += `<button id="nextBtn">Next<span class="material-icons">arrow_forward</span></button>`;
      } else {
        navHtml += `<button id="restartBtn"><span class="material-icons">home</span>Back to Gallery</button>`;
      }
      navButtons.innerHTML = navHtml;
    }
    
    // Create and add the new content frame after a short delay
    setTimeout(() => {
      const sceneContent = gameDiv.querySelector('.scene-content');
      if (sceneContent) {
        sceneContent.innerHTML = `
          <div class="content-frame">
            ${currentStory[index].content}
            ${index === currentStory.length - 1 ? '<p class="ending-message">The End <span class="heart-icon">♥</span></p>' : ''}
          </div>
        `;
      }
    }, 300); // Time to wait for the fade out
  }

  // Attach navigation events
  setTimeout(() => {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const restartBtn = document.getElementById("restartBtn");
    if (prevBtn) { prevBtn.addEventListener("click", () => showScene(index - 1)); }
    if (nextBtn) { nextBtn.addEventListener("click", () => showScene(index + 1)); }
    if (restartBtn) { restartBtn.addEventListener("click", () => returnToGallery()); }
  }, 50);

  setupAudioPlayerControls();
  updateBackgroundEffects();
}

/**
 * Returns to the gallery view and unloads preloaded images.
 */
function returnToGallery() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  unloadStoryImages();
  
  // Force the gallery to be visible
  const gallery = document.getElementById("gallery");
  const gameContainer = document.getElementById("gameContainer");
  
  // Make sure the game container is hidden
  gameContainer.classList.add("hidden");
  gameContainer.style.display = "none";
  
  // Make sure the gallery is visible
  gallery.classList.remove("hidden");
  gallery.style.display = "flex";
  
  document.getElementById('globalBackground').style.backgroundImage = "linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url('images/gallery.jpg')";
  updateBackgroundEffects(); // Apply zoom and blur settings
}

/**
 * Loads story data (JSON), preloads images, and sets up audio.
 */
function loadStoryData(storyData, folder) {
  currentStory = storyData.sort((a, b) => a.order - b.order);
  currentStory.folder = folder;
  currentSceneIndex = -1; // Set to -1 first so the showScene function knows to build the entire scene
  preloadStoryImages(currentStory, folder);
  
  // Force the gallery to be hidden before showing game container
  const gallery = document.getElementById("gallery");
  const gameContainer = document.getElementById("gameContainer");
  
  // Make sure we remove the gallery completely from view
  gallery.classList.add("hidden");
  gallery.style.display = "none";
  
  // Make sure the game container is visible
  gameContainer.classList.remove("hidden");
  gameContainer.style.display = "flex";
  
  showScene(0);
  setupAudio();
  setupAudioPlayerControls();
}

/**
 * Builds the gallery with available stories.
 * If a story has "today: true", it is displayed in a separate "Today's Story" section.
 */
function setupGallery() {
  const availableStories = [
    { title: "Friends Tale", file: "friends-tale", cover: "images/friends-tale/scene0.jpg", order: 1, description: "A heartwarming tale of friendship and love" },
    { title: "Little Sleepy Star", file: "sleepy-star", cover: "images/sleepy-star/scene0.jpg", order: 2, today: true, description: "A magical bedtime adventure with a sleepy little star" }
  ];
  availableStories.sort((a, b) => a.order - b.order);
  
  // Set global background to gallery image with a romantic gradient overlay
  document.getElementById('globalBackground').style.backgroundImage = "linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url('images/gallery.jpg')";
  
  const storyCardsContainer = document.getElementById("storyCards");
  storyCardsContainer.innerHTML = "";
  
  // Create container for Today's Story (if any)
  const todaysStories = availableStories.filter(story => story.today);
  const otherStories = availableStories.filter(story => !story.today);
  
  if (todaysStories.length > 0) {
    const todaysSection = document.createElement("div");
    todaysSection.className = "todays-story-section";
    todaysSection.innerHTML = "<h2>Tonight's Special</h2>";
    todaysStories.forEach(story => {
      const card = document.createElement("div");
      card.className = "story-card todays-story";
      card.innerHTML = `
        <img src="${story.cover ? story.cover : 'images/' + story.file + '/scene0.jpg'}" alt="${story.title} Cover">
        <div class="story-title">${story.title}</div>
      `;
      card.addEventListener("click", () => {
        loadStory(story.file)
          .then(data => { loadStoryData(data, story.file); })
          .catch(err => { console.error("Error loading story:", err); });
      });
      todaysSection.appendChild(card);
      
      // Add description below the card
      if (story.description) {
        const descriptionEl = document.createElement("p");
        descriptionEl.className = "story-description";
        descriptionEl.textContent = story.description;
        todaysSection.appendChild(descriptionEl);
      }
    });
    storyCardsContainer.appendChild(todaysSection);
  }
  
  if (otherStories.length > 0) {
    const otherSection = document.createElement("div");
    otherSection.className = "other-stories-section";
    otherSection.innerHTML = "<h2>More Sweet Dreams</h2>";
    
    // Create a container for the cards to display them in a row
    const cardsContainer = document.createElement("div");
    cardsContainer.className = "story-cards-row";
    
    otherStories.forEach(story => {
      const card = document.createElement("div");
      card.className = "story-card";
      card.innerHTML = `
        <img src="${story.cover ? story.cover : 'images/' + story.file + '/scene0.jpg'}" alt="${story.title} Cover">
        <div class="story-title">${story.title}</div>
      `;
      card.addEventListener("click", () => {
        loadStory(story.file)
          .then(data => { loadStoryData(data, story.file); })
          .catch(err => { console.error("Error loading story:", err); });
      });
      cardsContainer.appendChild(card);
    });
    
    otherSection.appendChild(cardsContainer);
    storyCardsContainer.appendChild(otherSection);
  }
}

/* Keyboard shortcuts:
   Space: Toggle play/pause.
   Left/Right Arrow: Previous/Next scene.
*/
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    const playPauseBtn = document.getElementById("playPauseBtn");
    if (playPauseBtn) playPauseBtn.click();
  } else if (e.code === "ArrowLeft") {
    if (currentSceneIndex > 0) showScene(currentSceneIndex - 1);
  } else if (e.code === "ArrowRight") {
    if (currentSceneIndex < currentStory.length - 1) showScene(currentSceneIndex + 1);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the gallery and ensure proper visibility
  setupGallery();
  
  // Make sure initial state is correct
  const gallery = document.getElementById("gallery");
  const gameContainer = document.getElementById("gameContainer");
  
  gallery.classList.remove("hidden");
  gallery.style.display = "flex";
  
  gameContainer.classList.add("hidden");
  gameContainer.style.display = "none";
  
  // Initial background setup
  updateBackgroundEffects();
});