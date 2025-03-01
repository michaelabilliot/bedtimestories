// main.js

let currentStory = [];
let currentSceneIndex = 0;
let chaseComplete = false; // For chase minigame
let audioElement = null;
let volumeTimeout = null;

// Update global background effects (zoom and blur)
function updateBackgroundEffects() {
  const zoomVal = document.getElementById('zoomSlider').value;
  const blurVal = document.getElementById('blurSlider').value;
  const globalBg = document.getElementById('globalBackground');
  globalBg.style.backgroundSize = (zoomVal * 100) + "%";
  globalBg.style.filter = `blur(${blurVal}px)`;
}

// Attach event listeners for zoom and blur sliders
document.getElementById('zoomSlider').addEventListener('input', updateBackgroundEffects);
document.getElementById('blurSlider').addEventListener('input', updateBackgroundEffects);

// Toggle the settings panel
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
    // Update progress bar as audio plays
    audioElement.addEventListener("timeupdate", updateAudioProgress);
    // When audio ends, after 5 seconds, return to gallery
    audioElement.addEventListener("ended", () => {
      setTimeout(() => returnToGallery(), 5000);
    });
  }
  // Set the source from the current story folder.
  audioElement.src = `audios/${currentStory.folder}/recording.mp3`;
  audioElement.load();
}

// Update the audio progress bar and add scene indicators
function updateAudioProgress() {
  const progressBar = document.getElementById("audioProgressBar");
  if (audioElement && audioElement.duration) {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = percent + "%";
    updateSceneIndicators();
  }
  // Auto-advance if the current scene (other than scene0) has a timestamp
  const sceneTimestamp = currentStory[currentSceneIndex].timestamp;
  if (sceneTimestamp !== undefined && audioElement.currentTime >= sceneTimestamp) {
    // If not the last scene and not interactive, advance
    if (currentSceneIndex < currentStory.length - 1 && !currentStory[currentSceneIndex].interactive) {
      showScene(currentSceneIndex + 1);
    } else if (audioElement.currentTime >= audioElement.duration) {
      setTimeout(() => returnToGallery(), 5000);
    }
  }
}

// Create scene indicator markers (triangles) on the progress bar
function updateSceneIndicators() {
  const indicatorsContainer = document.getElementById("sceneIndicators");
  if (!indicatorsContainer) return;
  indicatorsContainer.innerHTML = ""; // Clear existing indicators
  if (audioElement && audioElement.duration) {
    // For each scene beyond scene0 (which has no timestamp)
    currentStory.forEach((scene, idx) => {
      if (idx > 0 && scene.timestamp !== undefined) {
        const posPercent = (scene.timestamp / audioElement.duration) * 100;
        const indicator = document.createElement("div");
        indicator.className = "scene-indicator";
        indicator.innerHTML = `<svg viewBox="0 0 10 10" width="10" height="10"><polygon points="5,0 10,10 0,10"/></svg>`;
        indicator.style.left = posPercent + "%";
        indicatorsContainer.appendChild(indicator);
      }
    });
  }
}

// Set up audio player controls (combined play/pause, etc.)
function setupAudioPlayerControls() {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const goStartBtn = document.getElementById("goStart");
  const goEndBtn = document.getElementById("goEnd");
  const volumeToggle = document.getElementById("volumeToggle");
  const volumeSlider = document.getElementById("volumeSlider");

  // Toggle play/pause
  playPauseBtn.addEventListener("click", () => {
    if (audioElement.paused) {
      audioElement.play();
      playPauseBtn.innerHTML = `<span class="material-icons">pause</span>`;
      // If we're currently on scene0 (which has no timestamp),
      // jump to scene1 right away.
      if (currentSceneIndex === 0 && currentStory.length > 1) {
        showScene(1);
      }
    } else {
      audioElement.pause();
      playPauseBtn.innerHTML = `<span class="material-icons">play_arrow</span>`;
    }
  });

  // Go to start/end
  goStartBtn.addEventListener("click", () => {
    audioElement.currentTime = 0;
  });
  goEndBtn.addEventListener("click", () => {
    audioElement.currentTime = audioElement.duration;
  });

  // Volume control toggle
  volumeToggle.addEventListener("click", () => {
    const volCtrl = document.getElementById("volumeControl");
    volCtrl.classList.toggle("hidden");
    // Reset auto-hide timer if visible
    if (!volCtrl.classList.contains("hidden")) {
      if (volumeTimeout) clearTimeout(volumeTimeout);
      volumeTimeout = setTimeout(() => {
        volCtrl.classList.add("hidden");
      }, 3000);
    }
  });
  volumeSlider.addEventListener("input", (e) => {
    audioElement.volume = e.target.value;
    // Restart auto-hide timer
    const volCtrl = document.getElementById("volumeControl");
    if (volumeTimeout) clearTimeout(volumeTimeout);
    volumeTimeout = setTimeout(() => {
      volCtrl.classList.add("hidden");
    }, 3000);
  });
}

// Render a scene from the current story.
function showScene(index) {
  currentSceneIndex = index;
  const gameDiv = document.getElementById("game");
  const sceneObj = currentStory[index];

  // Update global background image to current scene's image
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
  html += `</div>`; // close nav-buttons

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
  
  // Attach navigation events
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

  // Interactive scene (e.g. chase) handling
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

  // Set up audio controls
  setupAudioPlayerControls();
  updateBackgroundEffects();
}

// Return to gallery
function returnToGallery() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  document.getElementById("gallery").classList.remove("hidden");
  document.getElementById("gameContainer").classList.add("hidden");
  document.getElementById('globalBackground').style.backgroundImage = "url('images/gallery.jpg')";
}

// When a story is loaded, store it, set up audio, etc.
function loadStoryData(storyData, folder) {
  currentStory = storyData.sort((a, b) => a.order - b.order);
  currentStory.folder = folder;
  currentSceneIndex = 0;
  document.getElementById("gallery").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  showScene(0);
  setupAudio();
  setupAudioPlayerControls();
}

// Build the gallery with multiple stories
function setupGallery() {
  const availableStories = [
    { title: "Friends Tale", file: "friends-tale", cover: "images/friends-tale/cover.jpg", order: 1 },
    { title: "Little Sleepy Star", file: "sleepy-star", cover: "images/sleepy-star/cover.jpg", order: 2 }
  ];
  availableStories.sort((a, b) => a.order - b.order);
  
  // In gallery view, set global background to gallery.jpg
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
