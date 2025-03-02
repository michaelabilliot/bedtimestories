/**
 * musicLoader.js
 * Handles loading and displaying music content in the music gallery
 */

// Store the current music data
let musicLibrary = [];
let currentTrack = null;
let musicPlayer = null;

/**
 * Initialize the music gallery when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load the music data
    await loadMusicData();
  } catch (error) {
    console.error('Error initializing music gallery:', error);
    showErrorMessage('Failed to load music library. Please try again later.');
  }
});

/**
 * Load music data from the server
 */
async function loadMusicData() {
  try {
    // Fetch the list of available music folders
    const response = await fetch('music/index.json');
    if (!response.ok) {
      throw new Error(`Failed to load music index: ${response.status} ${response.statusText}`);
    }
    
    const musicIndex = await response.json();
    musicLibrary = musicIndex.tracks || [];
    
    // Sort the music by date (newest first)
    musicLibrary.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log('Music library loaded:', musicLibrary);
  } catch (error) {
    console.error('Error loading music data:', error);
    throw error;
  }
}

/**
 * Set up the music gallery with available tracks
 */
function setupMusicGallery() {
  const musicGalleryContainer = document.getElementById('musicGallery');
  if (!musicGalleryContainer) {
    console.error('Music gallery container not found');
    return;
  }
  
  // Clear the container
  musicGalleryContainer.innerHTML = '';
  
  // Create the header
  const header = document.createElement('div');
  header.className = 'music-header';
  header.innerHTML = `
    <h1>Music Collection</h1>
    <p class="subtitle">Relax and enjoy these special tunes</p>
  `;
  musicGalleryContainer.appendChild(header);
  
  // Create the music cards container
  const musicCardsContainer = document.createElement('div');
  musicCardsContainer.id = 'musicCards';
  musicCardsContainer.className = 'music-cards';
  
  // Add music cards
  if (musicLibrary.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'No music available yet. Check back soon!';
    musicCardsContainer.appendChild(emptyMessage);
  } else {
    musicLibrary.forEach(track => {
      const card = createMusicCard(track);
      musicCardsContainer.appendChild(card);
    });
  }
  
  musicGalleryContainer.appendChild(musicCardsContainer);
  
  // Create the music player container (initially hidden)
  const playerContainer = document.createElement('div');
  playerContainer.id = 'musicPlayerContainer';
  playerContainer.className = 'music-player-container hidden';
  playerContainer.innerHTML = `
    <div class="music-player-header">
      <button id="backToMusicGallery" class="back-button">
        <span class="material-icons">arrow_back</span>
        Back to Gallery
      </button>
    </div>
    <div id="musicPlayerContent" class="music-player-content">
      <!-- Player content will be inserted here -->
    </div>
  `;
  
  musicGalleryContainer.appendChild(playerContainer);
  
  // Add event listener to the back button
  const backButton = playerContainer.querySelector('#backToMusicGallery');
  if (backButton) {
    backButton.addEventListener('click', () => {
      // Hide the player and show the gallery
      playerContainer.classList.add('hidden');
      musicCardsContainer.classList.remove('hidden');
      header.classList.remove('hidden');
      
      // Stop the music if it's playing
      if (musicPlayer) {
        musicPlayer.pause();
      }
    });
  }
}

// Make setupMusicGallery available globally
window.setupMusicGallery = setupMusicGallery;

/**
 * Create a music card for a track
 * @param {Object} track - The track data
 * @returns {HTMLElement} The created card element
 */
function createMusicCard(track) {
  const card = document.createElement('div');
  card.className = 'music-card';
  card.setAttribute('data-folder', track.folder);
  
  // Create the card content
  card.innerHTML = `
    <div class="music-card-image">
      <img src="music/${track.folder}/album.jpg" alt="${track.title} Album Cover" 
           loading="lazy">
    </div>
    <div class="music-card-info">
      <h3>${track.title}</h3>
      <p class="music-artist">${track.artist || 'Unknown Artist'}</p>
      <p class="music-date">${formatDate(track.date)}</p>
    </div>
  `;
  
  // Add proper error handling for the image
  const img = card.querySelector('img');
  img.onerror = function() {
    this.onerror = null; 
    this.src = 'images/default-album.jpg';
  };
  
  // Add click event to play the track
  card.addEventListener('click', () => {
    playTrack(track);
  });
  
  return card;
}

/**
 * Format a date string to a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Play a selected track
 * @param {Object} track - The track data
 */
function playTrack(track) {
  if (!track) return;
  
  currentTrack = track;
  
  // Get the containers
  const musicCardsContainer = document.getElementById('musicCards');
  const playerContainer = document.getElementById('musicPlayerContainer');
  const playerContent = document.getElementById('musicPlayerContent');
  const header = document.querySelector('.music-header');
  
  if (!musicCardsContainer || !playerContainer || !playerContent) {
    console.error('Required containers not found');
    return;
  }
  
  // Hide the cards and show the player
  musicCardsContainer.classList.add('hidden');
  if (header) header.classList.add('hidden');
  playerContainer.classList.remove('hidden');
  
  // Create the player content
  playerContent.innerHTML = `
    <div class="now-playing">
      <div class="album-cover">
        <img src="music/${track.folder}/album.jpg" alt="${track.title} Album Cover">
      </div>
      <div class="track-info">
        <h2>${track.title}</h2>
        <p class="artist">${track.artist || 'Unknown Artist'}</p>
        <p class="album">${track.album || ''}</p>
        <p class="description">${track.description || ''}</p>
        <p class="producer">Producer: ${track.producer || 'Unknown'}</p>
        <p class="date">Released: ${formatDate(track.date)}</p>
      </div>
    </div>
    <div class="player-controls">
      <div class="progress-container">
        <div class="progress-bar">
          <div id="musicProgressBar" class="progress"></div>
        </div>
        <div class="time-display">
          <span id="currentTime">0:00</span>
          <span id="totalTime">0:00</span>
        </div>
      </div>
      <div class="control-buttons">
        <button id="prevTrackBtn" class="control-button" disabled>
          <span class="material-icons">skip_previous</span>
        </button>
        <button id="playPauseBtn" class="control-button play-pause">
          <span class="material-icons">play_arrow</span>
        </button>
        <button id="nextTrackBtn" class="control-button" disabled>
          <span class="material-icons">skip_next</span>
        </button>
        <button id="volumeBtn" class="control-button">
          <span class="material-icons">volume_up</span>
        </button>
      </div>
      <div id="volumeControl" class="volume-control hidden">
        <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="0.7">
      </div>
    </div>
  `;
  
  // Add proper error handling for the album cover image
  const albumImg = playerContent.querySelector('.album-cover img');
  if (albumImg) {
    albumImg.onerror = function() {
      this.onerror = null;
      this.src = 'images/default-album.jpg';
    };
  }
  
  // Set up the audio player
  setupMusicPlayer(track);
}

/**
 * Set up the audio player for a track
 * @param {Object} track - The track data
 */
function setupMusicPlayer(track) {
  if (musicPlayer) {
    // Stop any existing audio player
    musicPlayer.pause();
    musicPlayer.src = '';
    musicPlayer.load();
    musicPlayer = null;
  }
  
  // Create a new audio player with the track's audio file
  // Use an absolute path for GitHub Pages compatibility
  const audioPath = window.location.href.includes('github.io') 
    ? `/${window.location.pathname.split('/')[1]}/music/${track.folder}/music.mp3`
    : `music/${track.folder}/music.mp3`;
  
  console.log('Loading audio from:', audioPath);
  
  try {
    musicPlayer = new Audio(audioPath);
    musicPlayer.volume = 0.7;
    
    // Add event listeners
    musicPlayer.addEventListener('loadedmetadata', () => {
      updateTotalTime();
      // Enable play button once loaded
      const playPauseBtn = document.getElementById('playPauseBtn');
      if (playPauseBtn) {
        playPauseBtn.disabled = false;
      }
    });
    
    musicPlayer.addEventListener('timeupdate', updateProgress);
    musicPlayer.addEventListener('ended', () => {
      // Reset the play button when the track ends
      const playPauseBtn = document.getElementById('playPauseBtn');
      if (playPauseBtn) {
        playPauseBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
      }
    });
    
    musicPlayer.addEventListener('error', (e) => {
      console.error('Error loading audio:', e);
      console.log('Failed audio path:', audioPath);
      
      // Try alternative path if first one fails
      if (!audioPath.startsWith('http')) {
        const altPath = `./${audioPath}`;
        console.log('Trying alternative path:', altPath);
        musicPlayer.src = altPath;
        musicPlayer.load();
      } else {
        showErrorMessage('Failed to load audio. Please check that the MP3 file exists in the correct location.');
      }
    });
    
    // Preload the audio
    musicPlayer.preload = 'auto';
    musicPlayer.load();
    
    // Set up the player controls
    setupPlayerControls();
  } catch (e) {
    console.error('Error creating audio player:', e);
    showErrorMessage('Failed to create audio player. Please try again later.');
  }
}

/**
 * Set up event listeners for the player controls
 */
function setupPlayerControls() {
  // Play/Pause button
  const playPauseBtn = document.getElementById('playPauseBtn');
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }
  
  // Volume button and slider
  const volumeBtn = document.getElementById('volumeBtn');
  const volumeControl = document.getElementById('volumeControl');
  const volumeSlider = document.getElementById('volumeSlider');
  
  if (volumeBtn && volumeControl) {
    volumeBtn.addEventListener('click', () => {
      volumeControl.classList.toggle('hidden');
    });
  }
  
  if (volumeSlider && musicPlayer) {
    volumeSlider.value = musicPlayer.volume;
    volumeSlider.addEventListener('input', (e) => {
      if (musicPlayer) {
        musicPlayer.volume = e.target.value;
        
        // Update the volume icon based on the volume level
        const volumeIcon = volumeBtn.querySelector('.material-icons');
        if (volumeIcon) {
          if (musicPlayer.volume === 0) {
            volumeIcon.textContent = 'volume_off';
          } else if (musicPlayer.volume < 0.5) {
            volumeIcon.textContent = 'volume_down';
          } else {
            volumeIcon.textContent = 'volume_up';
          }
        }
      }
    });
  }
  
  // Progress bar click to seek
  const progressContainer = document.querySelector('.progress-bar');
  if (progressContainer && musicPlayer) {
    progressContainer.addEventListener('click', (e) => {
      if (!musicPlayer) return;
      
      const rect = progressContainer.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const seekTime = clickPosition * musicPlayer.duration;
      
      if (!isNaN(seekTime)) {
        musicPlayer.currentTime = seekTime;
        updateProgress();
      }
    });
  }
}

/**
 * Toggle play/pause for the current track
 */
function togglePlayPause() {
  if (!musicPlayer) return;
  
  const playPauseBtn = document.getElementById('playPauseBtn');
  if (!playPauseBtn) return;
  
  if (musicPlayer.paused) {
    musicPlayer.play()
      .then(() => {
        playPauseBtn.innerHTML = '<span class="material-icons">pause</span>';
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        showErrorMessage('Failed to play audio. Please try again.');
      });
  } else {
    musicPlayer.pause();
    playPauseBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
  }
}

/**
 * Update the progress bar and time display
 */
function updateProgress() {
  if (!musicPlayer) return;
  
  const progressBar = document.getElementById('musicProgressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  
  if (progressBar) {
    const percent = (musicPlayer.currentTime / musicPlayer.duration) * 100;
    progressBar.style.width = `${percent}%`;
  }
  
  if (currentTimeEl) {
    currentTimeEl.textContent = formatTime(musicPlayer.currentTime);
  }
  
  if (totalTimeEl) {
    totalTimeEl.textContent = formatTime(musicPlayer.duration);
  }
}

/**
 * Update the total time display
 */
function updateTotalTime() {
  if (!musicPlayer) return;
  
  const totalTimeEl = document.getElementById('totalTime');
  if (totalTimeEl) {
    totalTimeEl.textContent = formatTime(musicPlayer.duration);
  }
}

/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Show an error message to the user
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
  // Check if an error container already exists
  let errorContainer = document.getElementById('errorContainer');
  
  // If not, create one
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.id = 'errorContainer';
    errorContainer.className = 'error-container';
    document.body.appendChild(errorContainer);
  }
  
  // Create the error message element
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.innerHTML = `
    <span class="material-icons">error</span>
    <p>${message}</p>
    <button class="close-error">
      <span class="material-icons">close</span>
    </button>
  `;
  
  // Add click event to close the error
  const closeButton = errorMessage.querySelector('.close-error');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      errorMessage.remove();
      
      // If there are no more error messages, hide the container
      if (errorContainer.children.length === 0) {
        errorContainer.remove();
      }
    });
  }
  
  // Auto-remove the error after 5 seconds
  setTimeout(() => {
    if (errorMessage.parentNode) {
      errorMessage.remove();
      
      // If there are no more error messages, hide the container
      if (errorContainer.children.length === 0) {
        errorContainer.remove();
      }
    }
  }, 5000);
  
  // Add the error message to the container
  errorContainer.appendChild(errorMessage);
} 