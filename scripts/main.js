// main.js

let currentStory = [];
let currentSceneIndex = 0;
let chaseComplete = false; // For chase minigame
let audioElement = null;
let audioProgressInterval = null;

// Update global background effects (zoom and blur)
function updateBackgroundEffects() {
  const zoomVal = document.getElementById('zoomSlider').value;
  const blurVal = document.getElementById('blurSlider').value;
  const globalBg = document.getElementById('globalBackground');
  globalBg.style.backgroundSize = (zoomVal * 100) + "%";
  globalBg.style.filter = `blur(${blurVal}px)`;
}

// Attach event listeners to zoom and blur sliders
document.getElementById('zoomSlider').addEventListener('input', updateBackgroundEffects);
document.getElementById('blurSlider').addEventListener('input', updateBackgroundEffects);

// Toggle settings panel
document.getElementById('settingsIcon').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.toggle('hidden');
});
document.getElementById('closeSettings').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.add('hidden');
});

// Create or update the audio element for the current story
function setupAudio() {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = "auto";
    // Event listener to update progress bar and check timestamps
    audioElement.addEventListener("timeupdate", () => {
      updateAudioProgress();
      // Check if current scene has a timestamp and if we've passed it
      const sceneTimestamp = currentStory[currentSceneIndex].timestamp;
      if (sceneTimestamp !== undefined && audioElement.currentTime >= sceneTimestamp) {
        // Only auto-advance if not interactive (or if interactive, user must click)
        if (!currentStory[currentSceneIndex].interactive) {
          showScene(currentSceneIndex + 1);
        }
      }
    });
    // When audio ends, wait 5 seconds and then return to gallery
    audioElement.addEventListener("ended", () => {
      setTimeout(() => {
        returnToGallery();
      }, 5000);
    });
  }
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
}

// Render a scene from the currentStory
function showScene(index) {
  currentSceneIndex = index;
  const gameDiv = document.getElementById("game");
  const sceneObj = currentStory[index];
  
  // Update the global background image to the current scene's image
  document.getElementById('globalBackground').style.backgroundImage =
    `url('images/${currentStory.folder}/${sceneObj.image}')`;
  
  if (sceneObj.interactive !== "chase") {
    chaseComplete = false;
  }
  
  let html = `<div class="scene">`;
  html += `<img src="images/${currentStory.folder}/${sceneObj.image}" class="scene-img" alt="Scene Image">`;
  html += `<div class="scene-content">${sceneObj.content}</div>`;
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
  
  // Insert the Audio Player UI below the nav-buttons
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
  
  html += `</div>`;
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
  
  // If this scene is interactive (e.g. chase), attach its events (not detailed here)
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
  
  // Ensure the audio element is set up and playing (if not already paused)
  if (!audioElement) {
    setupAudio();
  }
  
  // If the audio is not paused, sync the audio with the scene timestamp if necessary.
  // (Optionally, you might want to seek audio when switching scenes.)
  
  updateBackgroundEffects();
}

// Return to gallery view and stop audio.
function returnToGallery() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  document.getElementById("gallery").classList.remove("hidden");
  document.getElementById("gameContainer").classList.add("hidden");
  // Set global background to gallery image.
  document.getElementById('globalBackground').style.backgroundImage = "url('images/gallery.jpg')";
}

// Audio Player Controls
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

// Monitor audio time and auto-advance scenes based on timestamps.
function monitorAudioProgress() {
  if (audioElement) {
    // Check every 250ms
    audioProgressInterval = setInterval(() => {
      updateAudioProgress();
      const sceneTimestamp = currentStory[currentSceneIndex].timestamp;
      if (sceneTimestamp !== undefined && audioElement.currentTime >= sceneTimestamp) {
        // Auto-advance if not the last scene.
        if (currentSceneIndex < currentStory.length - 1) {
          clearInterval(audioProgressInterval);
          showScene(currentSceneIndex + 1);
        } else {
          // If last scene, wait 5 seconds then return to gallery.
          if (audioElement.currentTime >= audioElement.duration) {
            setTimeout(() => returnToGallery(), 5000);
          }
        }
      }
    }, 250);
  }
}

// When a story is loaded, create the audio element.
function loadStoryData(storyData, folder) {
  // Sort scenes by "order"
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

// Gallery setup
function setupGallery() {
  const availableStories = [
    { title: "Friends Tale", file: "friends-tale", cover: "images/friends-tale/scene0.jpg", order: 1 },
    { title: "A Dog's Bark", file: "a-dogs-bark", cover: "images/a-dogs-bark/scene0.jpg", order: 2 },
    { title: "Mystery Adventure", file: "mystery-adventure", cover: "images/mystery-adventure/scene0.jpg", order: 3 }
  ];
  availableStories.sort((a, b) => a.order - b.order);
  // In gallery view, set global background to gallery.jpg.
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
