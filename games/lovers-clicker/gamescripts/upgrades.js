/**
 * Lovers Clicker - Upgrades System
 * Handles all upgrades for the game
 */

// Upgrade definitions
const upgradeDefinitions = {
  biggerHeart: {
    id: 'biggerHeart',
    name: 'Bigger Heart',
    description: 'Increases hearts per click by 1',
    baseCost: 10,
    costMultiplier: 1.5,
    maxLevel: 10,
    effect: (level) => {
      gameState.heartsPerClick = 1 + level;
    }
  },
  lovePoem: {
    id: 'lovePoem',
    name: 'Love Poem',
    description: 'Generates 1 heart per second',
    baseCost: 50,
    costMultiplier: 1.7,
    maxLevel: 10,
    effect: (level) => {
      gameState.heartsPerSecond = level;
    }
  },
  romanticDate: {
    id: 'romanticDate',
    name: 'Romantic Date',
    description: 'Generates 5 hearts per second',
    baseCost: 250,
    costMultiplier: 1.8,
    maxLevel: 10,
    effect: (level) => {
      gameState.heartsPerSecond += level * 5;
    }
  },
  loveLetters: {
    id: 'loveLetters',
    name: 'Love Letters',
    description: 'Increases hearts per click by 5',
    baseCost: 500,
    costMultiplier: 2.0,
    maxLevel: 10,
    effect: (level) => {
      gameState.heartsPerClick += level * 5;
    }
  },
  chocolateBox: {
    id: 'chocolateBox',
    name: 'Chocolate Box',
    description: 'Generates 20 hearts per second',
    baseCost: 1000,
    costMultiplier: 2.2,
    maxLevel: 10,
    effect: (level) => {
      gameState.heartsPerSecond += level * 20;
    }
  }
};

// Initialize upgrades
function initUpgrades() {
  // Initialize each upgrade in the game state if not already present
  Object.keys(upgradeDefinitions).forEach(upgradeId => {
    if (!gameState.upgrades[upgradeId]) {
      gameState.upgrades[upgradeId] = {
        level: 0,
        unlocked: false
      };
    }
  });
  
  // Apply effects of all purchased upgrades
  applyAllUpgradeEffects();
  
  // Render the upgrades UI
  renderUpgrades();
}

// Apply effects of all purchased upgrades
function applyAllUpgradeEffects() {
  // Reset derived stats
  gameState.heartsPerClick = 1;
  gameState.heartsPerSecond = 0;
  
  // Apply each upgrade's effect based on its level
  Object.keys(gameState.upgrades).forEach(upgradeId => {
    const upgrade = gameState.upgrades[upgradeId];
    const definition = upgradeDefinitions[upgradeId];
    
    if (upgrade.level > 0 && definition) {
      definition.effect(upgrade.level);
    }
  });
}

// Calculate the cost of the next level of an upgrade
function calculateUpgradeCost(upgradeId) {
  const upgrade = gameState.upgrades[upgradeId];
  const definition = upgradeDefinitions[upgradeId];
  
  return Math.floor(definition.baseCost * Math.pow(definition.costMultiplier, upgrade.level));
}

// Purchase an upgrade
function purchaseUpgrade(upgradeId) {
  const upgrade = gameState.upgrades[upgradeId];
  const definition = upgradeDefinitions[upgradeId];
  
  // Check if upgrade can be purchased
  if (upgrade.level >= definition.maxLevel) {
    showMessage('Upgrade already at maximum level!');
    return false;
  }
  
  // Calculate cost
  const cost = calculateUpgradeCost(upgradeId);
  
  // Check if player has enough hearts
  if (gameState.hearts < cost) {
    showMessage('Not enough hearts!');
    return false;
  }
  
  // Purchase the upgrade
  gameState.hearts -= cost;
  upgrade.level++;
  
  // Apply the upgrade effect
  applyAllUpgradeEffects();
  
  // Update UI
  updateUI();
  
  // Check achievements
  checkAchievements();
  
  return true;
}

// Render all upgrades in the UI
function renderUpgrades() {
  const upgradesList = document.getElementById('upgradesList');
  if (!upgradesList) return;
  
  // Clear the list
  upgradesList.innerHTML = '';
  
  // Add each upgrade
  Object.keys(upgradeDefinitions).forEach(upgradeId => {
    const definition = upgradeDefinitions[upgradeId];
    const upgrade = gameState.upgrades[upgradeId];
    
    // Check if upgrade should be visible
    if (shouldShowUpgrade(upgradeId)) {
      upgrade.unlocked = true;
      
      // Create upgrade element
      const upgradeElement = document.createElement('div');
      upgradeElement.className = 'upgrade-item';
      
      // Calculate cost
      const cost = calculateUpgradeCost(upgradeId);
      const maxedOut = upgrade.level >= definition.maxLevel;
      
      // Set inner HTML
      upgradeElement.innerHTML = `
        <div class="upgrade-info">
          <div class="upgrade-name">${definition.name}</div>
          <div class="upgrade-description">${definition.description}</div>
        </div>
        <div class="upgrade-level">${upgrade.level}/${definition.maxLevel}</div>
        <div class="upgrade-cost">${formatNumber(cost)} ❤️</div>
        <button class="upgrade-button" data-upgrade="${upgradeId}" ${maxedOut || gameState.hearts < cost ? 'disabled' : ''}>
          ${maxedOut ? 'MAX' : 'Buy'}
        </button>
      `;
      
      // Add to the list
      upgradesList.appendChild(upgradeElement);
      
      // Add click event
      const buyButton = upgradeElement.querySelector('.upgrade-button');
      buyButton.addEventListener('click', () => {
        purchaseUpgrade(upgradeId);
      });
    }
  });
}

// Determine if an upgrade should be shown
function shouldShowUpgrade(upgradeId) {
  const upgrade = gameState.upgrades[upgradeId];
  
  // If already unlocked, always show
  if (upgrade.unlocked) return true;
  
  // Otherwise, check requirements based on upgrade ID
  switch (upgradeId) {
    case 'biggerHeart':
      // Always show the first upgrade
      return true;
    case 'lovePoem':
      // Show after earning 30 hearts total
      return gameState.totalHearts >= 30;
    case 'romanticDate':
      // Show after buying at least 3 love poems
      return gameState.upgrades.lovePoem && gameState.upgrades.lovePoem.level >= 3;
    case 'loveLetters':
      // Show after buying at least 5 bigger hearts
      return gameState.upgrades.biggerHeart && gameState.upgrades.biggerHeart.level >= 5;
    case 'chocolateBox':
      // Show after buying at least 3 romantic dates
      return gameState.upgrades.romanticDate && gameState.upgrades.romanticDate.level >= 3;
    default:
      return false;
  }
}

// Update the upgrades UI
function updateUpgradesUI() {
  // Re-render all upgrades
  renderUpgrades();
}

// Reset all upgrades
function resetUpgrades() {
  // Reset each upgrade to level 0 and unlocked false
  Object.keys(upgradeDefinitions).forEach(upgradeId => {
    gameState.upgrades[upgradeId] = {
      level: 0,
      unlocked: false
    };
  });
  
  // Re-render upgrades
  renderUpgrades();
} 