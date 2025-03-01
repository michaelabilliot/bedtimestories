// main.js

let currentStory = [];
let currentSceneIndex = 0;
let chaseComplete = false; // For chase minigame

// Update global background effects using zoom and blur sliders.
function updateBackgroundEffects() {
  const zoomVal = document.getElementById('zoomSlider').value;
  const blurVal = document.getElementById('blurSlider').value;
  const globalBg = document.getElementById('globalBackground');
  
  globalBg.style.backgroundSize = (zoomVal * 100) + "%";
  globalBg.style.filter = `blur(${blurVal}px)`;
}

// Attach event listeners to the zoom and blur sliders.
document.getElementById('zoomSlider').addEventListener('input', updateBackgroundEffects);
document.getElementById('blurSlider').addEventListener('input', updateBackgroundEffects);

// Toggle settings panel.
document.getElementById('settingsIcon').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.toggle('hidden');
});
document.getElementById('closeSettings').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.add('hidden');
});

// Render a scene from currentStory.
function showScene(index) {
  currentSceneIndex = index;
  const gameDiv = document.getElementById("game");
  const sceneObj = currentStory[index];
  
  // Update the global background image (if in game view, use story image)
  document.getElementById('globalBackground').style.backgroundImage =
    `url('images/${currentStory.folder}/${sceneObj.image}')`;
  
  if (sceneObj.interactive !== "chase") {
    chaseComplete = false;
  }
  
  let html = `<div class="scene">`;
  html += `<img src="images/${currentStory.folder}/${sceneObj.image}" class="scene-img" alt="Scene Image">`;
  html += `<div class="scene-content">${sceneObj.content}</div>`;
  // Audio Player inserted inside the scene, bound to the bottom.
  html += `
    <div id="audioPlayer">
      <button id="goStart"><span class="material-icons">first_page</span></button>
      <button id="playBtn"><span class="material-icons">play_arrow</span></button>
      <button id="pauseBtn"><span class="material-icons">pause</span></button>
      <button id="goEnd"><span class="material-icons">last_page</span></button>
      <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="0.5">
    </div>
  `;
  // Navigation buttons.
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
    html += `<button id="restartBtn">Restart Adventure</button>`;
  }
  html += `</div></div>`;
  
  gameDiv.innerHTML = html;
  
  // Attach navigation event listeners.
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
    restartBtn.addEventListener("click", () => {
      chaseComplete = false;
      showScene(0);
    });
  }
  
  // Special handling for chase minigame.
  if (sceneObj.interactive === "chase") {
    let chaseClicks = 0;
    const threshold = 20;
    const runBtn = document.getElementById("runBtn");
    // (Assuming the chase minigame markup is already in sceneObj.content)
    runBtn.addEventListener("click", () => {
      chaseClicks++;
      document.getElementById("chaseCounter").innerText = chaseClicks;
      if (chaseClicks >= threshold) {
        document.getElementById("chaseMessage").style.display = "block";
        chaseComplete = true;
        const nextBtn = document.getElementById("nextBtn");
        if (nextBtn) nextBtn.disabled = false;
      }
    });
  }
  
  updateBackgroundEffects();
}

// Load a story's JSON data and initialize the game view.
function loadStoryData(storyData, folder) {
  // Sort story scenes by their "order" property.
  currentStory = storyData.sort((a, b) => a.order - b.order);
  currentStory.folder = folder;
  currentSceneIndex = 0;
  // Hide the gallery and set the global background to the first scene.
  document.getElementById("gallery").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  showScene(0);
}

// Set up the gallery (cards sorted by order).
function setupGallery() {
  const availableStories = [
    { title: "Friends Tale", file: "friends-tale", cover: "images/friends-tale/scene0.jpg", order: 1 },
    { title: "A Dog's Bark", file: "a-dogs-bark", cover: "images/a-dogs-bark/scene0.jpg", order: 2 },
    { title: "Mystery Adventure", file: "mystery-adventure", cover: "images/mystery-adventure/scene0.jpg", order: 3 }
  ];
  // Sort availableStories by order.
  availableStories.sort((a, b) => a.order - b.order);
  
  // For the gallery view, update the global background to the gallery image.
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

// Initialize the gallery on page load.
document.addEventListener("DOMContentLoaded", () => {
  setupGallery();
});
