/**
 * gameLoader.js
 * Handles loading and displaying games in the games gallery
 */

// Store the current game data
let gameLibrary = [];
let currentGame = null;

/**
 * Initialize the games gallery when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load the games data
    await loadGamesData();
  } catch (error) {
    console.error('Error initializing games gallery:', error);
    showErrorMessage('Failed to load games library. Please try again later.');
  }
});

/**
 * Load games data from the server
 */
async function loadGamesData() {
  try {
    // Fetch the list of available games
    const response = await fetch('games/index.json');
    if (!response.ok) {
      throw new Error(`Failed to load games index: ${response.status} ${response.statusText}`);
    }
    
    const gamesIndex = await response.json();
    gameLibrary = gamesIndex.games || [];
    
    // Sort the games by date (newest first)
    gameLibrary.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log('Games library loaded:', gameLibrary);
    
    // Set up the games gallery
    setupGamesGallery();
  } catch (error) {
    console.error('Error loading games data:', error);
    throw error;
  }
}

/**
 * Set up the games gallery with available games
 */
function setupGamesGallery() {
  const gamesGalleryContainer = document.getElementById('gamesGallery');
  if (!gamesGalleryContainer) {
    console.error('Games gallery container not found');
    return;
  }
  
  // Clear the container
  gamesGalleryContainer.innerHTML = '';
  
  // Create the header
  const header = document.createElement('div');
  header.className = 'games-header';
  header.innerHTML = `
    <h1>Games Collection</h1>
    <p class="subtitle">Have fun with these interactive games</p>
  `;
  gamesGalleryContainer.appendChild(header);
  
  // Create the games cards container
  const gameCardsContainer = document.createElement('div');
  gameCardsContainer.id = 'gameCards';
  gameCardsContainer.className = 'game-cards';
  
  // Add game cards
  if (gameLibrary.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'No games available yet. Check back soon!';
    gameCardsContainer.appendChild(emptyMessage);
  } else {
    gameLibrary.forEach(game => {
      const card = createGameCard(game);
      gameCardsContainer.appendChild(card);
    });
  }
  
  gamesGalleryContainer.appendChild(gameCardsContainer);
  
  // Create the game container (initially hidden)
  const gameContainer = document.createElement('div');
  gameContainer.id = 'gamePlayerContainer';
  gameContainer.className = 'game-player-container hidden';
  gameContainer.innerHTML = `
    <div class="game-player-header">
      <button id="backToGamesGallery" class="back-button">
        <span class="material-icons">arrow_back</span>
        Back to Gallery
      </button>
    </div>
    <div id="gamePlayerContent" class="game-player-content">
      <!-- Game content will be inserted here -->
    </div>
  `;
  
  gamesGalleryContainer.appendChild(gameContainer);
  
  // Add event listener to the back button
  const backButton = gameContainer.querySelector('#backToGamesGallery');
  if (backButton) {
    backButton.addEventListener('click', () => {
      // Hide the game player and show the gallery
      gameContainer.classList.add('hidden');
      gameCardsContainer.classList.remove('hidden');
      header.classList.remove('hidden');
      
      // Show navigation tabs when returning to gallery
      const navigationTabs = document.getElementById('navigationTabs');
      if (navigationTabs) {
        navigationTabs.classList.remove('hidden');
      }
    });
  }
}

// Make setupGamesGallery available globally
window.setupGamesGallery = setupGamesGallery;

/**
 * Create a game card for a game
 * @param {Object} game - The game data
 * @returns {HTMLElement} The created card element
 */
function createGameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.setAttribute('data-folder', game.folder);
  
  // Create the card content
  card.innerHTML = `
    <div class="game-card-image">
      <img src="games/${game.folder}/thumbnail.jpg" alt="${game.title} Thumbnail" 
           loading="lazy">
    </div>
    <div class="game-card-info">
      <h3>${game.title}</h3>
      <p class="game-type">${game.type || 'Interactive Game'}</p>
      <p class="game-date">${formatDate(game.date)}</p>
    </div>
  `;
  
  // Add proper error handling for the image
  const img = card.querySelector('img');
  img.onerror = function() {
    this.onerror = null; 
    this.src = 'images/default-game.jpg';
  };
  
  // Add click event to play the game
  card.addEventListener('click', () => {
    loadGame(game);
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
 * Load and display a selected game
 * @param {Object} game - The game data
 */
function loadGame(game) {
  if (!game) return;
  
  currentGame = game;
  
  // Get the containers
  const gameCardsContainer = document.getElementById('gameCards');
  const gameContainer = document.getElementById('gamePlayerContainer');
  const gameContent = document.getElementById('gamePlayerContent');
  const header = document.querySelector('.games-header');
  const navigationTabs = document.getElementById('navigationTabs');
  
  if (!gameCardsContainer || !gameContainer || !gameContent) {
    console.error('Required containers not found');
    return;
  }
  
  // Hide the cards, navigation tabs, and show the game
  gameCardsContainer.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  header.classList.add('hidden');
  
  // Hide navigation tabs when game is selected
  if (navigationTabs) {
    navigationTabs.classList.add('hidden');
  }
  
  // Set up the game content with minimal UI - just the game and a back button
  gameContent.innerHTML = `
    <div class="game-frame-container">
      <iframe id="gameFrame" src="games/${game.folder}/index.html" frameborder="0" allowfullscreen></iframe>
    </div>
  `;
}

/**
 * Load detailed game information from the game's folder
 * @param {Object} game - The basic game data from index.json
 * @returns {Promise<Object>} - Promise resolving to the detailed game data
 */
async function loadGameDetails(game) {
  try {
    const response = await fetch(`games/${game.folder}/game.json`);
    if (!response.ok) {
      throw new Error(`Failed to load detailed game info: ${response.status} ${response.statusText}`);
    }
    
    const gameDetails = await response.json();
    // Merge the detailed game data with the basic game data
    return { ...game, ...gameDetails };
  } catch (error) {
    console.error('Error loading detailed game info:', error);
    // Return the original game data if there's an error
    return game;
  }
}

/**
 * Show an error message to the user
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
  // Check if error container exists, create if not
  let errorContainer = document.querySelector('.error-container');
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    document.body.appendChild(errorContainer);
  }
  
  // Create error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.innerHTML = `
    <p>${message}</p>
    <button class="close-error">
      <span class="material-icons">close</span>
    </button>
  `;
  
  // Add to container
  errorContainer.appendChild(errorElement);
  
  // Add close button functionality
  const closeButton = errorElement.querySelector('.close-error');
  closeButton.addEventListener('click', () => {
    errorElement.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
  }, 5000);
} 