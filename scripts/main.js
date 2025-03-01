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
 * Renders a scene by index.
 */
function showScene(index) {
  currentSceneIndex = index;
  const gameDiv = document.getElementById("game");
  const sceneObj = currentStory[index];

  // Update global background to current scene's image.
  document.getElementById('globalBackground').style.backgroundImage =
    `url('images/${currentStory.folder}/${sceneObj.image}')`;

  let html = `<div class="scene">`;
  html += `<img src="images/${currentStory.folder}/${sceneObj.image}" class="scene-img" alt="Scene Image">`;
  html += `<div class="scene-content">${sceneObj.content}</div>`;

  // Navigation buttons.
  html += `<div class="nav-buttons">`;
  if (index > 0) {
    html += `<button id="prevBtn"><span class="material-icons">arrow_back</span></button>`;
  }
  if (index < currentStory.length - 1) {
    html += `<button id="nextBtn"><span class="material-icons">arrow_forward</span></button>`;
  } else {
    html += `<button id="restartBtn">Back to Gallery</button>`;
  }
  html += `</div>`; // End nav-buttons

  // Audio Player UI.
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

  // Attach navigation events.
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
 * Returns to the gallery view and unloads preloaded images.
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
 * Loads story data (JSON), preloads images, and sets up audio.
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
 * If a story has "today: true", it is displayed in a separate "Today's Story" section.
 */
function setupGallery() {
  const availableStories = [
    { title: "Friends Tale", file: "friends-tale", cover: "images/friends-tale/scene0.jpg", order: 1 },
    { title: "Little Sleepy Star", file: "sleepy-star", cover: "images/sleepy-star/scene0.jpg", order: 2, today: true }
  ];
  availableStories.sort((a, b) => a.order - b.order);
  
  // Set global background to gallery image.
  document.getElementById('globalBackground').style.backgroundImage = "url('images/gallery.jpg')";
  
  const storyCardsContainer = document.getElementById("storyCards");
  storyCardsContainer.innerHTML = "";
  
  // Create container for Today's Story (if any)
  const todaysStories = availableStories.filter(story => story.today);
  const otherStories = availableStories.filter(story => !story.today);
  
  if (todaysStories.length > 0) {
    const todaysSection = document.createElement("div");
    todaysSection.className = "todays-story-section";
    todaysSection.innerHTML = "<h2>Today's Story</h2>";
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
    });
    storyCardsContainer.appendChild(todaysSection);
  }
  
  if (otherStories.length > 0) {
    const otherSection = document.createElement("div");
    otherSection.className = "other-stories-section";
    otherSection.innerHTML = "<h2>Other Stories</h2>";
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
      otherSection.appendChild(card);
    });
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
  setupGallery();
});
