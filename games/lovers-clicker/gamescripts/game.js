/**
 * Lovers Clicker - Main Game Logic
 * A simple incremental clicker game about love
 */

// Game state
const gameState = {
  hearts: 0,
  heartsPerClick: 1,
  heartsPerSecond: 0,
  totalHearts: 0,
  totalClicks: 0,
  lastSave: Date.now(),
  upgrades: {},
  achievements: {}
};

// DOM Elements
const elements = {
  hearts: document.getElementById('hearts'),
  heartsPerSecond: document.getElementById('heartsPerSecond'),
  heartClicker: document.getElementById('heartClicker'),
  clickValue: document.getElementById('clickValue'),
  saveButton: document.getElementById('saveButton'),
  resetButton: document.getElementById('resetButton')
};

// Initialize the game
function initGame() {
  // Load saved game if available
  loadGame();
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize upgrades
  initUpgrades();
  
  // Initialize achievements
  initAchievements();
  
  // Start the game loop
  startGameLoop();
  
  // Update UI
  updateUI();
}

// Set up event listeners
function setupEventListeners() {
  // Heart clicker
  elements.heartClicker.addEventListener('click', () => {
    clickHeart();
  });
  
  // Save button
  elements.saveButton.addEventListener('click', () => {
    saveGame();
    showMessage('Game saved!');
  });
  
  // Reset button
  elements.resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      resetGame();
      showMessage('Game reset!');
    }
  });
}

// Click the heart to earn hearts
function clickHeart() {
  // Add hearts based on hearts per click
  gameState.hearts += gameState.heartsPerClick;
  gameState.totalHearts += gameState.heartsPerClick;
  gameState.totalClicks++;
  
  // Show the click value
  showClickValue();
  
  // Update UI
  updateUI();
  
  // Check achievements
  checkAchievements();
}

// Show the click value animation
function showClickValue() {
  // Update the click value text
  elements.clickValue.textContent = `+${gameState.heartsPerClick}`;
  
  // Position randomly around the heart
  const randomX = Math.random() * 60 - 30;
  const randomY = Math.random() * 20 - 40;
  elements.clickValue.style.transform = `translate(${randomX}px, ${randomY}px)`;
  
  // Show the click value
  elements.clickValue.classList.add('show');
  
  // Remove the show class after animation completes
  setTimeout(() => {
    elements.clickValue.classList.remove('show');
  }, 1000);
}

// Game loop for passive income
function startGameLoop() {
  // Update hearts every second based on hearts per second
  setInterval(() => {
    if (gameState.heartsPerSecond > 0) {
      gameState.hearts += gameState.heartsPerSecond;
      gameState.totalHearts += gameState.heartsPerSecond;
      updateUI();
      checkAchievements();
    }
  }, 1000);
  
  // Auto-save every minute
  setInterval(() => {
    saveGame();
    console.log('Game auto-saved');
  }, 60000);
}

// Update the UI with current game state
function updateUI() {
  // Format numbers with commas for readability
  elements.hearts.textContent = formatNumber(Math.floor(gameState.hearts));
  elements.heartsPerSecond.textContent = formatNumber(gameState.heartsPerSecond);
  
  // Update upgrades UI
  updateUpgradesUI();
}

// Format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Save the game to localStorage
function saveGame() {
  gameState.lastSave = Date.now();
  localStorage.setItem('loversClickerSave', JSON.stringify(gameState));
}

// Load the game from localStorage
function loadGame() {
  const savedGame = localStorage.getItem('loversClickerSave');
  if (savedGame) {
    try {
      const parsedSave = JSON.parse(savedGame);
      Object.assign(gameState, parsedSave);
      console.log('Game loaded successfully');
    } catch (error) {
      console.error('Error loading saved game:', error);
    }
  }
}

// Reset the game
function resetGame() {
  // Reset game state
  gameState.hearts = 0;
  gameState.heartsPerClick = 1;
  gameState.heartsPerSecond = 0;
  gameState.totalHearts = 0;
  gameState.totalClicks = 0;
  gameState.lastSave = Date.now();
  gameState.upgrades = {};
  gameState.achievements = {};
  
  // Reset upgrades
  resetUpgrades();
  
  // Reset achievements
  resetAchievements();
  
  // Update UI
  updateUI();
  
  // Save the reset state
  saveGame();
}

// Show a message to the user
function showMessage(message) {
  // Create a message element if it doesn't exist
  let messageElement = document.querySelector('.message');
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.className = 'message';
    document.body.appendChild(messageElement);
  }
  
  // Set the message text
  messageElement.textContent = message;
  messageElement.classList.add('show');
  
  // Remove the message after 3 seconds
  setTimeout(() => {
    messageElement.classList.remove('show');
  }, 3000);
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame); 