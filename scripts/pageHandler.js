/**
 * Page Handler for Bedtime Stories App
 * Manages navigation between stories and music sections
 */

// Page sections
const PAGES = {
  STORIES: 'stories',
  MUSIC: 'music'
};

// Current active page
let currentPage = PAGES.STORIES;

// DOM elements
let storiesTab;
let musicTab;
let storiesSection;
let musicSection;
let settingsBtn;
let settingsPanel;

/**
 * Initialize the page handler
 */
function initPageHandler() {
  // Get DOM elements
  storiesTab = document.getElementById('storiesTab');
  musicTab = document.getElementById('musicTab');
  storiesSection = document.getElementById('storiesSection');
  musicSection = document.getElementById('musicSection');
  settingsBtn = document.getElementById('settingsBtn');
  settingsPanel = document.getElementById('settingsPanel');
  
  // Set up event listeners
  storiesTab.addEventListener('click', () => switchPage(PAGES.STORIES));
  musicTab.addEventListener('click', () => switchPage(PAGES.MUSIC));
  
  // Settings button event
  settingsBtn.addEventListener('click', toggleSettings);
  
  // Close settings when clicking outside
  document.addEventListener('click', (e) => {
    if (!settingsPanel.classList.contains('hidden') && 
        !settingsPanel.contains(e.target) && 
        e.target !== settingsBtn) {
      settingsPanel.classList.add('hidden');
    }
  });
  
  // Initialize with stories page
  switchPage(PAGES.STORIES);
  
  // Initialize theme manager
  initThemeManager();
}

/**
 * Switch between pages
 * @param {string} page - Page to switch to
 */
function switchPage(page) {
  // Update current page
  currentPage = page;
  
  // Update tab active states
  if (page === PAGES.STORIES) {
    storiesTab.classList.add('active');
    musicTab.classList.remove('active');
    
    // Show stories section, hide music section
    storiesSection.style.display = 'block';
    musicSection.style.display = 'none';
    
    // Set background for stories
    const storiesTheme = localStorage.getItem('bedtimeStoriesTheme') || 'pink';
    setPageBackground(storiesTheme, true);
    
  } else if (page === PAGES.MUSIC) {
    musicTab.classList.add('active');
    storiesTab.classList.remove('active');
    
    // Show music section, hide stories section
    musicSection.style.display = 'block';
    storiesSection.style.display = 'none';
    
    // Set up music gallery if needed
    if (typeof setupMusicGallery === 'function') {
      setupMusicGallery();
    }
    
    // Set background for music
    const musicTheme = localStorage.getItem('bedtimeMusicTheme') || 'gray';
    setPageBackground(musicTheme, false);
  }
  
  // Update settings button appearance based on current page
  updateSettingsButton();
}

/**
 * Set the page background based on theme
 * @param {string} theme - Theme name
 * @param {boolean} isStories - Whether this is for stories section
 */
function setPageBackground(theme, isStories) {
  const body = document.body;
  
  // Clear any existing background classes
  body.classList.remove('pink-background', 'blue-background', 'gray-background', 'orange-background');
  
  // Apply theme-specific background
  switch (theme) {
    case 'pink':
      body.style.background = 'linear-gradient(135deg, #ffb6c1, #da70d6)';
      break;
    case 'blue':
      body.style.background = 'linear-gradient(135deg, #87ceeb, #4169e1)';
      break;
    case 'gray':
      body.style.background = 'linear-gradient(135deg, #2c2c2c, #1a1a1a)';
      break;
    case 'orange':
      body.style.background = 'linear-gradient(135deg, #ffa500, #ff4500)';
      break;
    default:
      // Use default background based on section
      if (isStories) {
        body.style.background = 'linear-gradient(135deg, #ffb6c1, #da70d6)';
      } else {
        body.style.background = 'linear-gradient(135deg, #2c2c2c, #1a1a1a)';
      }
  }
}

/**
 * Update settings button appearance based on current page
 */
function updateSettingsButton() {
  if (currentPage === PAGES.STORIES) {
    settingsBtn.classList.add('stories-settings');
    settingsBtn.classList.remove('music-settings');
  } else {
    settingsBtn.classList.add('music-settings');
    settingsBtn.classList.remove('stories-settings');
  }
}

/**
 * Toggle settings panel visibility
 */
function toggleSettings() {
  settingsPanel.classList.toggle('hidden');
}

// Make functions available globally
window.initPageHandler = initPageHandler;
window.switchPage = switchPage; 