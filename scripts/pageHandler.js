/**
 * pageHandler.js
 * Master handler for managing page navigation between different sections
 * (stories, music, memories, and future sections)
 */

// Track the current active page
let currentPage = 'stories'; // Default to stories page

// Initialize the page handler when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  // Default to showing the stories page on initial load
  showPage('stories');
});

/**
 * Set up the navigation tabs and their event listeners
 */
function setupNavigation() {
  const navContainer = document.getElementById('navigationTabs');
  if (!navContainer) {
    console.error('Navigation container not found');
    return;
  }

  // Add click event listeners to all navigation tabs
  const navTabs = navContainer.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPage = tab.getAttribute('data-page');
      if (targetPage) {
        showPage(targetPage);
      }
    });
  });
}

/**
 * Show the specified page and hide all others
 * @param {string} pageName - The name of the page to show ('stories', 'music', 'memories', etc.)
 */
function showPage(pageName) {
  // Update the current page tracker
  currentPage = pageName;
  
  // Update active tab styling
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    if (tab.getAttribute('data-page') === pageName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Hide all page containers
  const pageContainers = document.querySelectorAll('.page-container');
  pageContainers.forEach(container => {
    container.classList.add('hidden');
    container.style.display = 'none';
  });

  // Show the selected page container
  const selectedContainer = document.getElementById(`${pageName}Page`);
  if (selectedContainer) {
    selectedContainer.classList.remove('hidden');
    selectedContainer.style.display = 'flex';
    
    // Call the appropriate setup function based on the page
    if (pageName === 'stories') {
      // If we're showing the stories page, make sure the gallery is visible
      const gallery = document.getElementById('gallery');
      if (gallery) {
        gallery.classList.remove('hidden');
        gallery.style.display = 'flex';
      }
      
      // Hide the game container if it's visible
      const gameContainer = document.getElementById('gameContainer');
      if (gameContainer) {
        gameContainer.classList.add('hidden');
        gameContainer.style.display = 'none';
      }
      
      // Set the background to the gallery image
      document.getElementById('globalBackground').style.backgroundImage = 
        "linear-gradient(to bottom right, rgba(255,182,193,0.4), rgba(147,112,219,0.4)), url('images/gallery.jpg')";
      
      // Call the setupGallery function from storyLoader.js
      if (typeof setupGallery === 'function') {
        setupGallery();
      }
    } else if (pageName === 'music') {
      // If we're showing the music page, call the setupMusicGallery function
      if (typeof setupMusicGallery === 'function') {
        setupMusicGallery();
      }
      
      // Set a romantic background for the music page
      document.getElementById('globalBackground').style.backgroundImage = 
        "linear-gradient(to bottom right, rgba(255,182,193,0.4), rgba(147,112,219,0.4)), url('images/music-bg.jpg')";
    } else if (pageName === 'memories') {
      // Set up memories page
      setupMemoriesPage();
      
      // Set a warm, romantic background for the memories page
      document.getElementById('globalBackground').style.backgroundImage = 
        "linear-gradient(to bottom right, rgba(255,180,190,0.4), rgba(180,144,202,0.4)), url('images/memories-bg.jpg')";
    }
    
    // Apply background effects
    if (typeof updateBackgroundEffects === 'function') {
      updateBackgroundEffects();
    }
  } else {
    console.error(`Page container for "${pageName}" not found`);
  }
}

/**
 * Set up the memories page with timeline content
 */
function setupMemoriesPage() {
  // This function can be expanded to load dynamic memory content
  console.log('Setting up memories page');
  
  // For now, we have a placeholder. In the future, you could load memories from a JSON file
  // and populate the timeline with your special moments together
}

/**
 * Get the current active page
 * @returns {string} The name of the current active page
 */
function getCurrentPage() {
  return currentPage;
} 