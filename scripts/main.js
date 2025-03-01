// main.js

let currentStory = [];
let currentSceneIndex = 0;
let chaseComplete = false; // For chase minigame
let audioElement = null;
let audioProgressInterval = null;

// Update the global background effects (zoom and blur)
function updateBackgroundEffects() {
  const zoomVal = document.getElementById('zoomSlider').value;
  const blurVal = document.getElementById('blurSlider').value;
  const globalBg = document.getElementById('globalBackground');
  globalBg.style.backgroundSize = (zoomVal * 100) + "%";
  globalBg.style.filter = `blur(${blurVal}px)`;
}

// Attach event listeners to the zoom and blur sliders
document.getElementById('zoomSlider').addEventListener('input', updateBackgroundEffects);
document.getElementById('blurSlider').addEventListener('input', updateBackgroundEffects);

// Toggle settings panel
document.getElementById('settingsIcon').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.toggle('hidden');
});
document.getElementById('closeSettings').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.add('hidden');
});

// Set up the audio element (or update its source)
function setupAudio() {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = "auto";
    // Update the progress bar periodically.
    audioElement.addEventListener("timeupdate", updateAudioProgress);
    // When the audio ends, wait 5 seconds and then return to the gallery.
    audioElement.addEventListener("ended", () => {
      setTimeout(() => returnToGallery(), 5000);
    });
  }
  // Set audio source for the current story folder.
  audioElement.src = `audios/${currentStory.folder}/recording.mp3`;
  audioElement.load();
}

// Update the audio progress bar width
function updateAudioProgress() {
  const progressBar = document.getElementById("audioProgressBar");
  if (audioElement && audioElement.duration) {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = percent + "%";
  }
  // Also, auto-advance scene if a timestamp is defined.
  const sceneTimestamp = currentStory[currentSceneIndex].timestamp;
  if (sceneTimestamp !== undefined && audioElement.currentTime >= sceneTimestamp) {
    // Only auto-advance if not the last scene.
    if (currentSceneIndex < currentStory.length - 1 && !currentStory[currentSceneIndex].interactive) {
      showScene(currentSceneIndex + 1);
    } else if (audioElement.currentTime >= audioElement.duration) {
      setTimeout(() => returnToGallery(), 5000);
    }
  }
}

// Attach audio player control events
function setupAudioPlayerControls() {
  const playBtn = document.getElementById("playBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const goStartBtn = document.getElementById("goStart");
  const goEndBtn = document.getElementById("goEnd");
  const volumeSlider = document.getElementById("volumeSlider");
  
  playBtn.addEventListener("click", () => {
    audioElement.play();
  });
  pauseBtn.addEventListener("click", () => {
    audioElement.pause();
  });
  goStartBtn.addEventListener("click", () => {
    audioElement.currentTime = 0;
  });
  goEndBtn.addEventListener("click", () => {
    audioElement.currentTime = audioElement.duration;
  });
  volumeSlider.addEventListener("input", (e) => {
    audioElement.volume = e.target.value;
  });
}

// Render a scene from the currentStory
function showScene(index) {
  currentSceneIndex = index;
  const gameDiv = document.getElementById("game");
  const sceneObj = currentStory[index];
  
  // Update global background image to current scene image.
  document.getElementById('globalBackground').style.backgroundImage =
    `url('images/${currentStory.folder}/${sceneObj.image}')`;
  
  if (sceneObj.interactive !== "chase") {
    chaseComplete = false;
  }
  
  let html = `<div class="scene">`;
  html += `<img src="images/${currentStory.folder}/${sceneObj.image}" class="scene-img" alt="Scene Image">`;
  html += `<div class="scene-content">${sceneObj.content}</div>`;
  
  // Navigation buttons
  html += `<div class="nav-buttons">`;
  if (index > 0) {
    html += `<button id="prevBtn"><span class="material-icons">arrow_back</span></button>`;
  }
  if (index < currentStory.length - 1) {
    if (sceneObj.interactive === "chase" && !chaseComplete) {
      html += `<button id="nextBtn" disabled><span class="material-icons">arrow_forward</span></button>`;
    } else {
      html += `<button id="nextBtn"><span class="material-icons">arrow_forward</span></button>`;
    }
  } else {
    html += `<button id="restartBtn">Back to Gallery</button>`;
  }
  html += `</div>`;
  
  // Audio Player UI (now placed after nav-buttons, inside the scene)
  html += `
    <div id="audioPlayer">
      <button id="goStart"><span class="material-icons">first_page</span></button>
      <button id="playBtn"><span class="material-icons">play_arrow</span></button>
      <button id="pauseBtn"><span class="material-icons">pause</span></button>
      <button id="goEnd"><span class="material-icons">last_page</span></button>
      <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="0.5">
      <div id="audioProgress"><div id="audioProgressBar"></div></div>
    </div>
  `;
  
  html += `</div>`; // close .scene
  gameDiv.innerHTML = html;
  
  // Attach navigation event listeners
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const restartBtn = document.getElementById("restartBtn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => showScene(index - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => showScene(index + 1));
  }
  if (restartBtn) {
    restartBtn.addEventListener("click", () => returnToGallery());
  }
  
  // If this scene is interactive, attach its events (omitted for brevity)
  if (sceneObj.interactive === "chase") {
    let chaseClicks = 0;
    const threshold = 20;
    const runBtn = document.getElementById("runBtn");
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        chaseClicks++;
        document.getElementById("chaseCounter").innerText = chaseClicks;
        if (chaseClicks >= threshold) {
          document.getElementById("chaseMessage").style.display = "block";
          chaseComplete = true;
          if (nextBtn) nextBtn.disabled = false;
        }
      });
    }
  }
  
  // After scene is rendered, ensure audio controls are set up.
  setupAudioPlayerControls();
  updateBackgroundEffects();
}

// Return to gallery view
function returnToGallery() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  document.getElementById("gallery").classList.remove("hidden");
  document.getElementById("gameContainer").classList.add("hidden");
  document.getElementById('globalBackground').style.backgroundImage = "url('images/gallery.jpg')";
}

// Monitor audio progress and auto-advance scenes
function monitorAudioProgress() {
  if (audioElement) {
    audioElement.addEventListener("timeupdate", updateAudioProgress);
  }
}

// When a story is loaded, store it and initialize audio and game view.
function loadStoryData(storyData, folder) {
  currentStory = storyData.sort((a, b) => a.order - b.order);
  currentStory.folder = folder;
  currentSceneIndex = 0;
  document.getElementById("gallery").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  showScene(0);
  setupAudio();
  setupAudioPlayerControls();
  monitorAudioProgress();
}

// Set up the gallery with available stories.
function setupGallery() {
  const availableStories = [
    { title: "Friends Tale", file: "friends-tale", cover: "images/friends-tale/cover.jpg", order: 1 },
    { title: "Little Sleepy Star", file: "sleepy-star", cover: "images/a-dogs-bark/cover.jpg", order: 2 },
    { title: "Mystery Adventure", file: "mystery-adventure", cover: "images/mystery-adventure/cover.jpg", order: 3 }
  ];
  availableStories.sort((a, b) => a.order - b.order);
  
  // In gallery view, set the global background to the gallery image.
  document.getElementById('globalBackground').style.backgroundImage = "url('images/gallery.jpg')";
  
  const storyCardsContainer = document.getElementById("storyCards");
  availableStories.forEach(story => {
    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `
      <img src="${story.cover}" alt="${story.title} Cover">
      <div class="story-title">${story.title}</div>
    `;
    card.addEventListener("click", () => {
      loadStory(story.file)
        .then(data => {
          loadStoryData(data, story.file);
        })
        .catch(err => {
          console.error("Error loading story:", err);
        });
    });
    storyCardsContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupGallery();
});
