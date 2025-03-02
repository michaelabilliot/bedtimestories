/**
 * Theme Manager for Bedtime Stories App
 * Handles theme selection and persistence for stories and music sections
 */

// Theme options
const THEMES = {
  PINK: 'pink',
  BLUE: 'blue',
  GRAY: 'gray',
  ORANGE: 'orange'
};

// Default themes
const DEFAULT_STORIES_THEME = THEMES.PINK;
const DEFAULT_MUSIC_THEME = THEMES.GRAY;

// Local storage keys
const STORIES_THEME_KEY = 'bedtimeStoriesTheme';
const MUSIC_THEME_KEY = 'bedtimeMusicTheme';

/**
 * Initialize the theme manager
 */
function initThemeManager() {
  // Load saved themes or use defaults
  const storiesTheme = localStorage.getItem(STORIES_THEME_KEY) || DEFAULT_STORIES_THEME;
  const musicTheme = localStorage.getItem(MUSIC_THEME_KEY) || DEFAULT_MUSIC_THEME;
  
  // Apply themes
  applyStoriesTheme(storiesTheme);
  applyMusicTheme(musicTheme);
  
  // Set up theme option buttons
  setupThemeOptions();
}

/**
 * Set up theme option buttons
 */
function setupThemeOptions() {
  // Get current themes
  const currentStoriesTheme = localStorage.getItem(STORIES_THEME_KEY) || DEFAULT_STORIES_THEME;
  const currentMusicTheme = localStorage.getItem(MUSIC_THEME_KEY) || DEFAULT_MUSIC_THEME;
  
  // Mark active themes
  document.querySelectorAll('.stories-theme-option').forEach(option => {
    const theme = option.getAttribute('data-theme');
    if (theme === currentStoriesTheme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
    
    // Add click event
    option.addEventListener('click', () => {
      setStoriesTheme(theme);
    });
  });
  
  document.querySelectorAll('.music-theme-option').forEach(option => {
    const theme = option.getAttribute('data-theme');
    if (theme === currentMusicTheme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
    
    // Add click event
    option.addEventListener('click', () => {
      setMusicTheme(theme);
    });
  });
}

/**
 * Set stories theme
 * @param {string} theme - Theme name
 */
function setStoriesTheme(theme) {
  // Save to local storage
  localStorage.setItem(STORIES_THEME_KEY, theme);
  
  // Apply theme
  applyStoriesTheme(theme);
  
  // Update active state
  document.querySelectorAll('.stories-theme-option').forEach(option => {
    if (option.getAttribute('data-theme') === theme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

/**
 * Set music theme
 * @param {string} theme - Theme name
 */
function setMusicTheme(theme) {
  // Save to local storage
  localStorage.setItem(MUSIC_THEME_KEY, theme);
  
  // Apply theme
  applyMusicTheme(theme);
  
  // Update active state
  document.querySelectorAll('.music-theme-option').forEach(option => {
    if (option.getAttribute('data-theme') === theme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

/**
 * Apply stories theme
 * @param {string} theme - Theme name
 */
function applyStoriesTheme(theme) {
  const root = document.documentElement;
  
  switch (theme) {
    case THEMES.PINK:
      root.style.setProperty('--stories-primary', 'var(--pink-primary)');
      root.style.setProperty('--stories-secondary', 'var(--pink-secondary)');
      root.style.setProperty('--stories-accent', 'var(--pink-accent)');
      root.style.setProperty('--stories-hover', 'var(--pink-hover)');
      root.style.setProperty('--stories-gradient', 'var(--pink-gradient)');
      break;
    case THEMES.BLUE:
      root.style.setProperty('--stories-primary', 'var(--blue-primary)');
      root.style.setProperty('--stories-secondary', 'var(--blue-secondary)');
      root.style.setProperty('--stories-accent', 'var(--blue-accent)');
      root.style.setProperty('--stories-hover', 'var(--blue-hover)');
      root.style.setProperty('--stories-gradient', 'var(--blue-gradient)');
      break;
    case THEMES.GRAY:
      root.style.setProperty('--stories-primary', 'var(--gray-primary)');
      root.style.setProperty('--stories-secondary', 'var(--gray-secondary)');
      root.style.setProperty('--stories-accent', 'var(--gray-accent)');
      root.style.setProperty('--stories-hover', 'var(--gray-hover)');
      root.style.setProperty('--stories-gradient', 'var(--gray-gradient)');
      break;
    case THEMES.ORANGE:
      root.style.setProperty('--stories-primary', 'var(--orange-primary)');
      root.style.setProperty('--stories-secondary', 'var(--orange-secondary)');
      root.style.setProperty('--stories-accent', 'var(--orange-accent)');
      root.style.setProperty('--stories-hover', 'var(--orange-hover)');
      root.style.setProperty('--stories-gradient', 'var(--orange-gradient)');
      break;
    default:
      // Use pink as fallback
      applyStoriesTheme(DEFAULT_STORIES_THEME);
  }
}

/**
 * Apply music theme
 * @param {string} theme - Theme name
 */
function applyMusicTheme(theme) {
  const root = document.documentElement;
  
  switch (theme) {
    case THEMES.PINK:
      root.style.setProperty('--music-primary', 'var(--pink-primary)');
      root.style.setProperty('--music-secondary', 'var(--pink-secondary)');
      root.style.setProperty('--music-accent', 'var(--pink-accent)');
      root.style.setProperty('--music-hover', 'var(--pink-hover)');
      root.style.setProperty('--music-gradient', 'var(--pink-gradient)');
      break;
    case THEMES.BLUE:
      root.style.setProperty('--music-primary', 'var(--blue-primary)');
      root.style.setProperty('--music-secondary', 'var(--blue-secondary)');
      root.style.setProperty('--music-accent', 'var(--blue-accent)');
      root.style.setProperty('--music-hover', 'var(--blue-hover)');
      root.style.setProperty('--music-gradient', 'var(--blue-gradient)');
      break;
    case THEMES.GRAY:
      root.style.setProperty('--music-primary', 'var(--gray-primary)');
      root.style.setProperty('--music-secondary', 'var(--gray-secondary)');
      root.style.setProperty('--music-accent', 'var(--gray-accent)');
      root.style.setProperty('--music-hover', 'var(--gray-hover)');
      root.style.setProperty('--music-gradient', 'var(--gray-gradient)');
      break;
    case THEMES.ORANGE:
      root.style.setProperty('--music-primary', 'var(--orange-primary)');
      root.style.setProperty('--music-secondary', 'var(--orange-secondary)');
      root.style.setProperty('--music-accent', 'var(--orange-accent)');
      root.style.setProperty('--music-hover', 'var(--orange-hover)');
      root.style.setProperty('--music-gradient', 'var(--orange-gradient)');
      break;
    default:
      // Use gray as fallback
      applyMusicTheme(DEFAULT_MUSIC_THEME);
  }
}

// Make functions available globally
window.initThemeManager = initThemeManager;
window.setStoriesTheme = setStoriesTheme;
window.setMusicTheme = setMusicTheme; 