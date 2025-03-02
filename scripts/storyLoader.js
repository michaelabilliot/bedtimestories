// storyLoader.js

/**
 * Asynchronously loads available story data.
 */
document.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('stories/stories.json');
    if (!response.ok) {
      throw new Error('Failed to load stories data');
    }
    const storiesData = await response.json();
    populateGallery(storiesData);
  } catch (error) {
    console.error('Error loading stories:', error);
    document.getElementById('galleryContainer').innerHTML = `<p class="error">Failed to load stories: ${error.message}</p>`;
  }
});

/**
 * Populates the gallery with story cards.
 */
function populateGallery(storiesData) {
  const gallery = document.getElementById('galleryContainer');
  
  // Sort stories by order property
  storiesData.sort((a, b) => a.order - b.order);
  
  // Create a special card for today's story
  const todayIndex = getTodaysStoryIndex(storiesData);
  if (todayIndex !== -1) {
    const todayStory = storiesData[todayIndex];
    const todayCard = createTodayCard(todayStory);
    gallery.appendChild(todayCard);
  }
  
  // Create regular cards for all stories
  storiesData.forEach((story, index) => {
    // Skip the one already used as today's story
    if (index === todayIndex) return;
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="images/${story.folder}/cover.jpg" alt="${story.title}">
      <h3>${story.title}</h3>
      <p>${story.description}</p>
    `;
    card.addEventListener('click', () => loadStory(story));
    gallery.appendChild(card);
  });
}

/**
 * Creates a special card for today's story.
 */
function createTodayCard(story) {
  const card = document.createElement('div');
  card.className = 'card today-card';
  card.innerHTML = `
    <div class="special-badge">Today's Special</div>
    <img src="images/${story.folder}/cover.jpg" alt="${story.title}">
    <h3>${story.title}</h3>
    <p>${story.description}</p>
  `;
  card.addEventListener('click', () => loadStory(story));
  return card;
}

/**
 * Returns the index of today's story based on the day of the month.
 */
function getTodaysStoryIndex(storiesData) {
  if (storiesData.length === 0) return -1;
  
  const today = new Date();
  const dayOfMonth = today.getDate();
  
  // Use the day of month modulo number of stories to cycle through them
  return dayOfMonth % storiesData.length;
}

/**
 * Loads a story and transitions to the game view.
 */
async function loadStory(story) {
  try {
    // Switch to stories tab if not already there
    document.querySelector('.tab-button[data-tab="stories"]').click();
    
    // Load story data
    const response = await fetch(`stories/${story.folder}/scenes.json`);
    if (!response.ok) {
      throw new Error(`Failed to load story: ${story.title}`);
    }
    const storyData = await response.json();
    
    // Sort scenes by order property
    storyData.sort((a, b) => a.order - b.order);
    
    // Add the folder name to the story data for reference
    storyData.folder = story.folder;
    
    // Set as current story and prepare scene index
    currentStory = storyData;
    currentSceneIndex = -1; // Setting to -1 so first showScene builds full scene
    
    // Preload all scene images
    preloadStoryImages(storyData, story.folder);
    
    // Hide gallery and show game container
    document.getElementById('gallery').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    
    // Set up the game container with story elements
    setupGameContainer(story);
    
    // Set up audio player
    setupAudio();
    
    // Set up audio player controls
    setupAudioPlayerControls();
    
    // Show the first scene
    showScene(0);
    
  } catch (error) {
    console.error('Error loading story:', error);
    alert(`Failed to load story: ${error.message}`);
  }
}

/**
 * Sets up the game container with story elements.
 */
function setupGameContainer(story) {
  const gameDiv = document.getElementById('game');
  
  // Set the background image to the cover image
  document.getElementById('globalBackground').style.backgroundImage = `url('images/${story.folder}/cover.jpg')`;
  
  // Reset the game container html
  gameDiv.innerHTML = '';
  
  // Create scene container
  const sceneContainer = document.createElement('div');
  sceneContainer.id = 'sceneContainer';
  sceneContainer.className = 'scene';
  gameDiv.appendChild(sceneContainer);
  
  // Create nav buttons
  const navButtons = document.createElement('div');
  navButtons.className = 'nav-buttons';
  
  const prevButton = document.createElement('button');
  prevButton.id = 'prevButton';
  prevButton.innerHTML = '<span class="material-icons">navigate_before</span>';
  prevButton.disabled = true; // Initially disabled on first scene
  prevButton.onclick = () => {
    if (currentSceneIndex > 0 && !isTransitioning) {
      showScene(currentSceneIndex - 1);
    }
  };
  
  const nextButton = document.createElement('button');
  nextButton.id = 'nextButton';
  nextButton.innerHTML = '<span class="material-icons">navigate_next</span>';
  nextButton.onclick = () => {
    if (currentSceneIndex < currentStory.length - 1 && !isTransitioning) {
      showScene(currentSceneIndex + 1);
    }
  };
  
  navButtons.appendChild(prevButton);
  navButtons.appendChild(nextButton);
  gameDiv.appendChild(navButtons);
  
  // Create audio player
  const audioPlayer = document.createElement('div');
  audioPlayer.id = 'audioPlayer';
  audioPlayer.innerHTML = `
    <div id="audioControls">
      <button id="playPauseBtn"><span class="material-icons">play_arrow</span></button>
      <button id="goStart"><span class="material-icons">fast_rewind</span></button>
      <button id="goEnd"><span class="material-icons">fast_forward</span></button>
      <div id="progressBarContainer">
        <div id="audioProgressBar"></div>
        <div id="sceneIndicators"></div>
      </div>
      <button id="volumeToggle"><span class="material-icons">volume_up</span></button>
      <div id="volumeControl" class="hidden">
        <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="1">
      </div>
    </div>
  `;
  gameDiv.appendChild(audioPlayer);
}
