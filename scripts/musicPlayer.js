/**
 * Music Player and Tab Navigation for Bedtime Stories
 * Handles tab switching and music playback functionality
 */

// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
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

// Available music tracks - using "judas" as the test song folder
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
            loadedMusicData.push({
              ...data,
              folder: track.folder,
              cover: `music/${track.folder}/album.jpg` // Using album.jpg as per user's structure
            });
          } else {
            console.warn(`Failed to load music data for ${track.folder}: ${response.status} ${response.statusText}`);
            // Add placeholder data if JSON not available
            loadedMusicData.push({
              title: track.folder.charAt(0).toUpperCase() + track.folder.slice(1),
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
            title: track.folder.charAt(0).toUpperCase() + track.folder.slice(1),
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
    card.innerHTML = `
      <img src="${track.cover}" alt="${track.title || track.folder}" onerror="this.src='images/placeholder.jpg'">
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
  
  // Volume button - future enhancement
  volumeBtn.addEventListener('click', () => {
    alert('Volume control coming soon!');
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
  musicPlayer.classList.add('active');
  
  // Update music player UI
  document.getElementById('currentMusicTitle').textContent = track.title || track.folder;
  document.getElementById('currentMusicThumbnail').src = track.cover;
  document.getElementById('currentMusicThumbnail').onerror = function() {
    console.warn(`Failed to load cover image for ${track.folder}`);
    this.src = 'images/placeholder.jpg';
  };
  
  // Reset play/pause button
  document.getElementById('playPauseBtn').innerHTML = '<i class="material-icons">pause</i>';
  
  // Create or update audio element
  if (audioElement) {
    audioElement.pause();
    audioElement.src = `music/${track.folder}/audio.mp3`; // Using audio.mp3 as per user's structure
  } else {
    const audioPath = `music/${track.folder}/audio.mp3`;
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
        playTrack(0); // Loop to first track
      }
    });
    
    // Setup error handling
    audioElement.addEventListener('error', (e) => {
      console.error(`Error loading audio file for ${track.folder}:`, e);
      document.getElementById('currentMusicTitle').textContent = `Error: Could not load "${track.title || track.folder}"`;
      document.getElementById('playPauseBtn').innerHTML = '<i class="material-icons">play_arrow</i>';
      isPlaying = false;
    });
  }
  
  // Play audio
  try {
    const playPromise = audioElement.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Audio playback started successfully');
        isPlaying = true;
      }).catch(error => {
        console.error('Audio playback failed:', error);
        document.getElementById('playPauseBtn').innerHTML = '<i class="material-icons">play_arrow</i>';
        isPlaying = false;
      });
    }
  } catch (error) {
    console.error('Error attempting to play:', error);
    document.getElementById('playPauseBtn').innerHTML = '<i class="material-icons">play_arrow</i>';
    isPlaying = false;
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
    progressBar.style.width = percent + '%';
    
    // Update time display
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    totalTimeEl.textContent = formatTime(audioElement.duration);
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