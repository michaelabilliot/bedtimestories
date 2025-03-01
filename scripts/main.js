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
 */
function updateBackgroundEffects() {
  const zoomVal = document.getElementById('zoomSlider').value;
  const blurVal = document.getElementById('blurSlider').value;
  const globalBg = document.getElementById('globalBackground');
  globalBg.style.backgroundSize = (zoomVal * 100) + "%";
  globalBg.style.filter = `blur(${blurVal}px)`;
}

/* Attach slider events */
document.getElementById('zoomSlider').addEventListener('input', updateBackgroundEffects);
document.getElementById('blurSlider').addEventListener('input', updateBackgroundEffects);

/* Toggle settings panel */
document.getElementById('settingsIcon').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.toggle('hidden');
});
document.getElementById('closeSettings').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.add('hidden');
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
 */
function updateAudioProgress() {
  const progressBar = document.getElementById("audioProgressBar");
  if (audioElement && audioElement.duration) {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = percent + "%";
    updateSceneIndicators();
  }
  
  const sceneTimestamp = currentStory[currentSceneIndex].timestamp;
  if (sceneTimestamp !== undefined && audioElement.currentTime >= sceneTimestamp) {
    // Only auto-advance if not manually overridden (i.e. if the user hasn't paused, etc.)
    if (currentSceneIndex < currentStory.length - 1 && !currentStory[currentSceneIndex].interactive) {
      showScene(currentSceneIndex + 1);
    } else if (audioElement.currentTime >= audioElement.duration) {
      setTimeout(() => returnToGallery(), 5000);
    }
  }
}

/**
 * Creates triangle markers for each scene's timestamp.
 * Also, attaches click events to allow jumping to that scene.
 */
function updateSceneIndicators() {
  const indicatorsContainer = document.getElementById("sceneIndicators");
  if (!indicatorsContainer) return;
  indicatorsContainer.innerHTML = "";
  if (audioElement && audioElement.duration) {
    currentStory.forEach((scene, idx) => {
      if (idx > 0 && scene.timestamp !== undefined) {
        const posPercent = (scene.timestamp / audioElement.duration) * 100;
        const indicator = document.createElement("div");
        indicator.className = "scene-indicator";
        indicator.innerHTML = `<svg viewBox="0 0 10 10" width="10" height="10"><polygon points="5,0 10,10 0,10"/></svg>`;
        indicator.style.left = posPercent + "%";
        // Clicking an indicator jumps to that scene.
        indicator.addEventListener("click", () => {
          audioElement.currentTime = scene.timestamp;
          showScene(idx);
        });
        indicatorsContainer.appendChild(indicator);
      }
    });
  }
}

/**
 * Sets up the audio player controls and keyboard events.
 */
function setupAudioPlayerControls() {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const goStartBtn = document.getElementById("goStart");
  const goEndBtn = document.getElementById("goEnd");
  const volumeToggle = document.getElementById("volumeToggle");
  const volumeSlider = document.getElementById("volumeSlider");

  playPauseBtn.addEventListener("click", () => {
    // For scene0, do not reset; simply play/pause
    if (audioElement.paused) {
      // If on scene0 and there's more than one scene, jump to scene1
      if (currentSceneIndex === 0 && currentStory.length > 1) {
        showScene(1);
      }
      audioElement.play();
      playPauseBtn.innerHTML = `<span class="material-icons">pause</span>`;
    } else {
      audioElement.pause();
      playPauseBtn.innerHTML = `<span class="material-icons">play_arrow</span>`;
    }
  });

  goStartBtn.addEventListener("click", () => {
    // Jump to current scene's timestamp
    if (currentStory[currentSceneIndex].timestamp !== undefined) {
      audioElement.currentTime = currentStory[currentSceneIndex].timestamp;
    } else {
      audioElement.currentTime = 0;
    }
  });
  goEndBtn.addEventListener("click", () => {
    // Jump to next scene's timestamp if available; otherwise, end audio.
    if (currentSceneIndex < currentStory.length - 1 && currentStory[currentSceneIndex + 1].timestamp !== undefined) {
      audioElement.currentTime = currentStory[currentSceneIndex + 1].timestamp;
    } else {
      audioElement.currentTime = audioElement.duration;
    }
  });

  volumeToggle.addEventListener("click", () => {
    const volCtrl = document.getElementById("volumeControl");
    volCtrl.classList.toggle("hidden");
    if (!volCtrl.classList.contains("hidden")) {
      if (volumeTimeout) clearTimeout(volumeTimeout);
      volumeTimeout = setTimeout(() => {
        volCtrl.classList.add("hidden");
      }, 3000);
    }
  });
  volumeSlider.addEventListener("input", (e) => {
    audioElement.volume = e.target.value;
    const volCtrl = document.getElementById("volumeControl");
    if (volumeTimeout) clearTimeout(volumeTimeout);
    volumeTimeout = setTimeout(() => {
      volCtrl.classList.add("hidden");
    }, 3000);
  });
}

/**
 * Adds keyboard shortcuts: space toggles play/pause, left/right arrows navigate scenes.
 */
document.addEventListener("keydown", (e) => {
  // Prevent scrolling on space
  if (e.key === " ") {
    e.preventDefault();
    document.getElementById("playPauseBtn").click();
  } else if (e.key === "ArrowLeft") {
    // Navigate to previous scene if exists
    if (currentSceneIndex > 0) {
      showScene(currentSceneIndex - 1);
    }
  } else if (e.key === "ArrowRight") {
    // Navigate to next scene if exists
    if (currentSceneIndex < currentStory.length - 1) {
      showScene(currentSceneIndex + 1);
    }
  }
});

/**
 * Renders a scene by index.
 * If the scene's JSON has a timestamp, it syncs the audio to that time.
 */
function showScene(index) {
  currentSceneIndex = index;
  const gameDiv = document.getElementById("game");
  const sceneObj = currentStory[index];

  // Set global background to current scene's image.
  document.getElementById('globalBackground').style.backgroundImage =
    `url('images/${currentStory.folder}/${sceneObj.image}')`;

  let html = `<div class="scene">`;
  html += `<img src="images/${currentStory.folder}/${sceneObj.image}" class="scene-img" alt="Scene Image">`;
  html += `<div class="scene-content">${sceneObj.content}</div>`;

  // Navigation buttons
  html += `<div class="nav-buttons">`;
  if (index > 0) {
    html += `<button id="prevBtn"><span class="material-icons">arrow_back</span></button>`;
  }
  if (index < currentStory.length - 1) {
    html += `<button id="nextBtn"><span class="material-icons">arrow_forward</span></button>`;
  } else {
    html += `<button id="restartBtn">Back to Gallery</button>`;
  }
  html += `</div>`; // end nav-buttons

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

  html += `</div>`; // close .scene
  gameDiv.innerHTML = html;
  
  // Sync audio to scene timestamp if defined.
  if (sceneObj.timestamp !== undefined) {
    audioElement.currentTime = sceneObj.timestamp;
  }
  
  // Attach nav event listeners.
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const restartBtn = document.getElementById("restartBtn");
  if (prevBtn) { prevBtn.addEventListener("click", () => showScene(index - 1)); }
  if (nextBtn) { nextBtn.addEventListener("click", () => showScene(index + 1)); }
  if (restartBtn) { restartBtn.addEventListener("click", () => returnToGallery()); }
  
  setupAudioPlayerControls();
  updateBackgroundEffects();
}

/**
 * Returns the user to the gallery view and unloads images.
 */
function returnToGallery() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  unloadStoryImages();
  document.getElementById("gallery").classList.remove("hidden");
  document.getElementById("gameContainer").classList.add("hidden");
  document.getElementById('globalBackground').style.backgroundImage = "url('images/gallery.jpg')";
}

/**
 * Loads story data (JSON), preloads images, sets up audio, and shows the game.
 */
function loadStoryData(storyData, folder) {
  currentStory = storyData.sort((a, b) => a.order - b.order);
  currentStory.folder = folder;
  currentSceneIndex = 0;
  preloadStoryImages(currentStory, folder);
  document.getElementById("gallery").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  showScene(0);
  setupAudio();
  setupAudioPlayerControls();
}

/**
 * Builds the gallery with available stories.
 */
function setupGallery() {
  const availableStories = [
    { title: "Friends Tale", file: "friends-tale", cover: "images/friends-tale/cover.jpg", order: 1 },
    { title: "Little Sleepy Star", file: "sleepy-star", cover: "images/sleepy-star/cover.jpg", order: 2 }
  ];
  availableStories.sort((a, b) => a.order - b.order);
  document.getElementById('globalBackground').style.backgroundImage = "url('images/gallery.jpg')";
  
  const storyCardsContainer = document.getElementById("storyCards");
  storyCardsContainer.innerHTML = "";
  availableStories.forEach(story => {
    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `
      <img src="${story.cover}" alt="${story.title} Cover">
      <div class="story-title">${story.title}</div>
    `;
    card.addEventListener("click", () => {
      loadStory(story.file)
        .then(data => { loadStoryData(data, story.file); })
        .catch(err => { console.error("Error loading story:", err); });
    });
    storyCardsContainer.appendChild(card);
  });
}

/* Keyboard controls: space for play/pause, left/right arrows for scene navigation */
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    document.getElementById("playPauseBtn")?.click();
  } else if (e.key === "ArrowLeft") {
    if (currentSceneIndex > 0) {
      showScene(currentSceneIndex - 1);
    }
  } else if (e.key === "ArrowRight") {
    if (currentSceneIndex < currentStory.length - 1) {
      showScene(currentSceneIndex + 1);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setupGallery();
});
