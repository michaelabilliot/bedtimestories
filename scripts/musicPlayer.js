/**
 * Music Player and Tab Navigation for Bedtime Stories
 * Handles tab switching and music playback functionality
 */

// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Initialize music data on page load, not just when tab is clicked
  loadMusicData();
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active tab content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}Tab`) {
          content.classList.add('active');
        }
      });
      
      // If switching to music tab, load music content
      if (tabId === 'music') {
        loadMusicData();
        const bgImagePath = "images/music.jpg";
        console.log(`Setting music tab background to: ${bgImagePath}`);
        document.getElementById('globalBackground').style.backgroundImage = `linear-gradient(to bottom, rgba(147,112,219,0.3), rgba(255,182,193,0.3)), url('${bgImagePath}')`;
      } else {
        // If switching to stories, reset the background if not in a story
        if (document.getElementById('gameContainer').classList.contains('hidden')) {
          const bgImagePath = "images/gallery.jpg";
          console.log(`Setting stories tab background to: ${bgImagePath}`);
          document.getElementById('globalBackground').style.backgroundImage = `linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url('${bgImagePath}')`;
        }
      }
      
      // Update background effects
      updateBackgroundEffects();
    });
  });
  
  // Create music gallery and setup music player functionality
  setupMusicPlayer();
});

// FIXED: Use correct case for folder name to match file system
// Available music tracks - using "Judas" as the test song folder
const musicTracks = [
  { folder: "Judas" }
  // Add more tracks here as needed
];

// Loaded music data
let loadedMusicData = [];

// Current track variables
let audioElement = null;
let currentTrackIndex = -1;
let isPlaying = false;

/**
 * Loads music data from JSON files in each music folder
 */
async function loadMusicData() {
  const musicCardsContainer = document.getElementById('musicCards');
  
  // Only populate if empty
  if (musicCardsContainer.innerHTML === '') {
    try {
      console.log("Loading music data...");
      console.log("Music cards container:", musicCardsContainer);
      
      // Debug: Check if musicTracks exists and has data
      console.log("musicTracks array:", musicTracks);
      
      // Load each music track data
      loadedMusicData = [];
      
      for (const track of musicTracks) {
        console.log(`Attempting to load track from folder: ${track.folder}`);
        try {
          // Check if info.json exists
          const response = await fetch(`music/${track.folder}/info.json`);
          if (response.ok) {
            console.log(`Successfully loaded info.json for ${track.folder}`);
            const data = await response.json();
            console.log(`Track data loaded:`, data);
            loadedMusicData.push({
              ...data,
              folder: track.folder,
              cover: `music/${track.folder}/album.jpg` // Using album.jpg as per user's structure
            });
          } else {
            console.warn(`Failed to load music data for ${track.folder}: ${response.status} ${response.statusText}`);
            // Add placeholder data if JSON not available
            loadedMusicData.push({
              title: track.folder,
              producer: "Unknown",
              year: "Unknown",
              folder: track.folder,
              cover: `music/${track.folder}/album.jpg` // Using album.jpg as per user's structure
            });
          }
        } catch (error) {
          console.error(`Error loading music data for ${track.folder}:`, error);
          // Add placeholder data if JSON not available
          loadedMusicData.push({
            title: track.folder,
            producer: "Unknown",
            year: "Unknown",
            folder: track.folder,
            cover: `music/${track.folder}/album.jpg` // Using album.jpg as per user's structure
          });
        }
      }
      
      console.log("Music data loaded:", loadedMusicData);
      // Now populate the music gallery with the loaded data
      setupMusicGallery();
    } catch (error) {
      console.error("Error in loadMusicData:", error);
      // Display an error message in the music cards container
      musicCardsContainer.innerHTML = '<div class="error-message">Sorry, there was an error loading the music tracks. Please try again later.</div>';
    }
  }
}

/**
 * Sets up the music gallery with available tracks
 */
function setupMusicGallery() {
  const musicCardsContainer = document.getElementById('musicCards');
  
  // Clear any existing content
  musicCardsContainer.innerHTML = '';
  
  console.log(`Setting up music gallery with ${loadedMusicData.length} tracks`);
  
  if (loadedMusicData.length === 0) {
    console.warn("No music tracks found to display");
    musicCardsContainer.innerHTML = '<div class="error-message">No music tracks available. Please check back later.</div>';
    return;
  }
  
  // Create a card for each track
  loadedMusicData.forEach((track, index) => {
    console.log(`Creating card for track: ${track.title || track.folder}`);
    const card = document.createElement('div');
    card.className = 'music-card';
    
    // FIXED: Use correct title fallback and error handling for images
    // Ensure the cover path is correct and has a fallback
    const coverPath = track.cover || `music/${track.folder}/album.jpg`;
    
    card.innerHTML = `
      <img src="${coverPath}" alt="${track.title || track.folder}" onerror="this.src='images/placeholder.jpg'">
      <div class="music-title">${track.title || track.folder}</div>
      <div class="play-button">
        <i class="material-icons">play_arrow</i>
      </div>
    `;
    
    card.addEventListener('click', () => {
      playTrack(index);
    });
    
    musicCardsContainer.appendChild(card);
  });
  
  console.log("Music gallery setup complete");
}

/**
 * Sets up the music player functionality
 */
function setupMusicPlayer() {
  const musicPlayer = document.getElementById('musicPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevTrackBtn = document.getElementById('prevTrackBtn');
  const nextTrackBtn = document.getElementById('nextTrackBtn');
  const volumeBtn = document.getElementById('volumeBtn');
  const progressContainer = document.getElementById('musicProgressContainer');
  const progressBar = document.getElementById('musicProgressBar');
  
  // Play/Pause button
  playPauseBtn.addEventListener('click', () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
        isPlaying = false;
      } else {
        audioElement.play();
        playPauseBtn.innerHTML = '<i class="material-icons">pause</i>';
        isPlaying = true;
      }
    }
  });
  
  // Previous track button
  prevTrackBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
      playTrack(currentTrackIndex - 1);
    } else {
      playTrack(loadedMusicData.length - 1); // Loop to last track
    }
  });
  
  // Next track button
  nextTrackBtn.addEventListener('click', () => {
    if (currentTrackIndex < loadedMusicData.length - 1) {
      playTrack(currentTrackIndex + 1);
    } else {
      playTrack(0); // Loop to first track
    }
  });
  
  // Volume button - implement functioning volume control
  volumeBtn.addEventListener('click', () => {
    // FIXED: Implement a basic volume toggle instead of alert
    if (audioElement) {
      if (audioElement.volume > 0) {
        audioElement.volume = 0;
        volumeBtn.innerHTML = '<i class="material-icons">volume_off</i>';
      } else {
        audioElement.volume = 1;
        volumeBtn.innerHTML = '<i class="material-icons">volume_up</i>';
      }
    }
  });
  
  // Progress bar click
  progressContainer.addEventListener('click', (e) => {
    if (audioElement) {
      const percent = e.offsetX / progressContainer.offsetWidth;
      audioElement.currentTime = percent * audioElement.duration;
      progressBar.style.width = percent * 100 + '%';
    }
  });
}

/**
 * Plays a selected track
 * @param {number} index - Index of the track to play
 */
function playTrack(index) {
  // Validate index
  if (index < 0 || index >= loadedMusicData.length) {
    console.error(`Invalid track index: ${index}`);
    return;
  }
  
  // Update current track index
  currentTrackIndex = index;
  const track = loadedMusicData[index];
  console.log(`Playing track: ${track.title || track.folder} from folder: ${track.folder}`);
  
  // Show music player
  const musicPlayer = document.getElementById('musicPlayer');
  if (!musicPlayer) {
    console.error('Music player element not found');
    return;
  }
  musicPlayer.classList.add('active');
  
  // Update music player UI
  const titleElement = document.getElementById('currentMusicTitle');
  if (titleElement) {
    titleElement.textContent = track.title || track.folder;
  }
  
  // FIXED: Better error handling for album art
  const thumbnail = document.getElementById('currentMusicThumbnail');
  if (thumbnail) {
    // Ensure the cover path is correct
    const coverPath = track.cover || `music/${track.folder}/album.jpg`;
    thumbnail.src = coverPath;
    thumbnail.onerror = function() {
      console.warn(`Failed to load cover image for ${track.folder}`);
      this.src = 'images/placeholder.jpg';
    };
  }
  
  // Add a back to gallery button if it doesn't exist
  if (!document.getElementById('backToMusicGallery')) {
    const backButton = document.createElement('button');
    backButton.id = 'backToMusicGallery';
    backButton.innerHTML = '<i class="material-icons">arrow_back</i> Back to Gallery';
    backButton.className = 'back-to-gallery-btn';
    backButton.addEventListener('click', () => {
      // Hide the music player
      if (audioElement) {
        audioElement.pause();
      }
      musicPlayer.classList.remove('active');
      
      // Show the music gallery
      const musicGallery = document.getElementById('musicGallery');
      if (musicGallery) {
        musicGallery.style.display = 'block';
      }
    });
    
    // Add the button to the music player
    const musicInfo = document.querySelector('.music-info');
    if (musicInfo) {
      musicInfo.insertBefore(backButton, musicInfo.firstChild);
    }
  }
  
  // Reset play/pause button
  const playPauseBtn = document.getElementById('playPauseBtn');
  if (playPauseBtn) {
    playPauseBtn.innerHTML = '<i class="material-icons">pause</i>';
  }
  
  // Create or update audio element
  try {
    const audioPath = `music/${track.folder}/audio.mp3`; // Using audio.mp3 as per user's structure
    
    if (audioElement) {
      audioElement.pause();
      audioElement.src = audioPath;
    } else {
      console.log(`Creating new audio element with source: ${audioPath}`);
      audioElement = new Audio(audioPath);
      
      // Setup time update event for progress bar
      audioElement.addEventListener('timeupdate', updateProgress);
      
      // Setup ended event
      audioElement.addEventListener('ended', () => {
        // Play next track when current one ends
        if (currentTrackIndex < loadedMusicData.length - 1) {
          playTrack(currentTrackIndex + 1);
        } else {
          // If it's the last track, reset to stopped state
          const playPauseBtn = document.getElementById('playPauseBtn');
          if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
          }
          isPlaying = false;
        }
      });
      
      // Setup error handling
      audioElement.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        alert('Sorry, there was an error playing this track. Please try another one.');
        
        // Reset UI
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
          playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
        }
        isPlaying = false;
      });
    }
    
    // Start playback
    audioElement.play()
      .then(() => {
        isPlaying = true;
      })
      .catch(error => {
        console.error('Error starting playback:', error);
        alert('Sorry, there was an error playing this track. Please try another one.');
        isPlaying = false;
        
        // Reset UI
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
          playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
        }
      });
  } catch (error) {
    console.error('Error setting up audio:', error);
    alert('Sorry, there was an error with the audio player. Please try again later.');
  }
}

/**
 * Updates the progress bar and time display
 */
function updateProgress() {
  if (audioElement) {
    const progressBar = document.getElementById('musicProgressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    
    // Calculate progress percentage
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    
    // Update progress bar if it exists
    if (progressBar) {
      progressBar.style.width = percent + '%';
    }
    
    // Update time display if elements exist
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audioElement.currentTime);
    }
    if (totalTimeEl) {
      totalTimeEl.textContent = formatTime(audioElement.duration);
    }
  }
}

/**
 * Formats seconds into mm:ss format
 * @param {number} time - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(time) {
  if (isNaN(time)) return '0:00';
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
} 