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
 * Show the specified page and hide all others with fade transitions
 * @param {string} pageName - The name of the page to show ('stories', 'music', 'memories', etc.)
 */
function showPage(pageName) {
  // If we're already on this page, do nothing
  if (currentPage === pageName) return;
  
  // Update the current page tracker
  const previousPage = currentPage;
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

  // Fade out the current page
  const currentContainer = document.getElementById(`${previousPage}Page`);
  if (currentContainer) {
    // Add the hidden class which has opacity: 0
    currentContainer.classList.add('hidden');
    
    // After the fade out animation, hide the page completely
    setTimeout(() => {
      currentContainer.style.display = 'none';
      
      // Force removal of any lingering memory elements from other pages
      if (currentContainer.id !== 'memoriesPage') {
        const memoryElements = currentContainer.querySelectorAll('.timeline-entry, .timeline-entry-content');
        memoryElements.forEach(el => el.remove());
      }
      
      // Show the new page with fade in
      showNewPage(pageName);
    }, 500); // Match this with the CSS transition duration
  } else {
    // If there's no current container, just show the new page
    showNewPage(pageName);
  }
}

/**
 * Helper function to show the new page with fade-in effect
 * @param {string} pageName - The name of the page to show
 */
function showNewPage(pageName) {
  // Show the selected page container
  const selectedContainer = document.getElementById(`${pageName}Page`);
  if (selectedContainer) {
    // Use display:block for memories page, display:flex for others
    if (pageName === 'memories') {
      selectedContainer.style.display = 'block';
    } else {
      selectedContainer.style.display = 'flex';
    }
    
    // Remove the hidden class after a short delay to trigger the fade-in
    setTimeout(() => {
      selectedContainer.classList.remove('hidden');
    }, 50);
    
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
      // Set up memories page using the function from memoryLoader.js
      if (typeof setupMemoriesPage === 'function') {
        setupMemoriesPage();
      }
      
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
 * Get the current active page
 * @returns {string} The name of the current active page
 */
function getCurrentPage() {
  return currentPage;
}

// Export functions for use in other scripts
window.getCurrentPage = getCurrentPage; 