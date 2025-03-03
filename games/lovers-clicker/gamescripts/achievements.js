/**
 * Lovers Clicker - Achievements System
 * Handles all achievements for the game
 */

// Achievement definitions
const achievementDefinitions = {
  firstClick: {
    id: 'firstClick',
    name: 'First Love',
    description: 'Click the heart for the first time',
    icon: '💘',
    condition: () => gameState.totalClicks >= 1
  },
  tenClicks: {
    id: 'tenClicks',
    name: 'Loving Touch',
    description: 'Click the heart 10 times',
    icon: '💓',
    condition: () => gameState.totalClicks >= 10
  },
  hundredClicks: {
    id: 'hundredClicks',
    name: 'Passionate Clicker',
    description: 'Click the heart 100 times',
    icon: '💕',
    condition: () => gameState.totalClicks >= 100
  },
  thousandClicks: {
    id: 'thousandClicks',
    name: 'Love Devotion',
    description: 'Click the heart 1,000 times',
    icon: '💖',
    condition: () => gameState.totalClicks >= 1000
  },
  firstUpgrade: {
    id: 'firstUpgrade',
    name: 'Love Grows',
    description: 'Purchase your first upgrade',
    icon: '🌱',
    condition: () => {
      return Object.values(gameState.upgrades).some(upgrade => upgrade.level > 0);
    }
  },
  allUpgrades: {
    id: 'allUpgrades',
    name: 'Love Collector',
    description: 'Purchase at least one level of each upgrade',
    icon: '🏆',
    condition: () => {
      return Object.keys(upgradeDefinitions).every(upgradeId => 
        gameState.upgrades[upgradeId] && gameState.upgrades[upgradeId].level > 0
      );
    }
  },
  maxUpgrade: {
    id: 'maxUpgrade',
    name: 'Love Mastery',
    description: 'Max out any upgrade',
    icon: '⭐',
    condition: () => {
      return Object.keys(upgradeDefinitions).some(upgradeId => {
        const upgrade = gameState.upgrades[upgradeId];
        const definition = upgradeDefinitions[upgradeId];
        return upgrade && upgrade.level >= definition.maxLevel;
      });
    }
  },
  hundredHearts: {
    id: 'hundredHearts',
    name: 'Heart Collector',
    description: 'Collect 100 total hearts',
    icon: '❤️',
    condition: () => gameState.totalHearts >= 100
  },
  thousandHearts: {
    id: 'thousandHearts',
    name: 'Heart Enthusiast',
    description: 'Collect 1,000 total hearts',
    icon: '❣️',
    condition: () => gameState.totalHearts >= 1000
  },
  tenThousandHearts: {
    id: 'tenThousandHearts',
    name: 'Heart Aficionado',
    description: 'Collect 10,000 total hearts',
    icon: '💗',
    condition: () => gameState.totalHearts >= 10000
  }
};

// Initialize achievements
function initAchievements() {
  // Initialize each achievement in the game state if not already present
  Object.keys(achievementDefinitions).forEach(achievementId => {
    if (!gameState.achievements[achievementId]) {
      gameState.achievements[achievementId] = {
        unlocked: false,
        unlockTime: null
      };
    }
  });
  
  // Render the achievements UI
  renderAchievements();
}

// Check if any achievements have been unlocked
function checkAchievements() {
  let newUnlocks = false;
  
  // Check each achievement
  Object.keys(achievementDefinitions).forEach(achievementId => {
    const achievement = gameState.achievements[achievementId];
    const definition = achievementDefinitions[achievementId];
    
    // If not already unlocked and condition is met
    if (!achievement.unlocked && definition.condition()) {
      // Unlock the achievement
      achievement.unlocked = true;
      achievement.unlockTime = Date.now();
      
      // Show notification
      showAchievementNotification(definition);
      
      newUnlocks = true;
    }
  });
  
  // If any new achievements were unlocked, update the UI
  if (newUnlocks) {
    renderAchievements();
  }
}

// Show a notification when an achievement is unlocked
function showAchievementNotification(achievement) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-icon">${achievement.icon}</div>
    <div class="achievement-info">
      <div class="achievement-title">Achievement Unlocked!</div>
      <div class="achievement-name">${achievement.name}</div>
    </div>
  `;
  
  // Add to the document
  document.body.appendChild(notification);
  
  // Add show class after a small delay (for animation)
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
}

// Render all achievements in the UI
function renderAchievements() {
  const achievementsList = document.getElementById('achievementsList');
  if (!achievementsList) return;
  
  // Clear the list
  achievementsList.innerHTML = '';
  
  // Add each achievement
  Object.keys(achievementDefinitions).forEach(achievementId => {
    const definition = achievementDefinitions[achievementId];
    const achievement = gameState.achievements[achievementId];
    
    // Create achievement element
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement-item';
    if (achievement.unlocked) {
      achievementElement.classList.add('unlocked');
    }
    
    // Set inner HTML
    achievementElement.innerHTML = `
      <div class="achievement-icon">${definition.icon}</div>
      <div class="achievement-name">${definition.name}</div>
      <div class="achievement-description">${definition.description}</div>
    `;
    
    // Add to the list
    achievementsList.appendChild(achievementElement);
  });
}

// Reset all achievements
function resetAchievements() {
  // Reset each achievement to unlocked false
  Object.keys(achievementDefinitions).forEach(achievementId => {
    gameState.achievements[achievementId] = {
      unlocked: false,
      unlockTime: null
    };
  });
  
  // Re-render achievements
  renderAchievements();
}

// Add CSS for achievement notifications
document.addEventListener('DOMContentLoaded', () => {
  // Create style element
  const style = document.createElement('style');
  style.textContent = `
    .achievement-notification {
      position: fixed;
      top: 20px;
      right: -300px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 10px;
      padding: 15px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      transition: right 0.5s ease;
      z-index: 1000;
    }
    
    .achievement-notification.show {
      right: 20px;
    }
    
    .achievement-notification .achievement-icon {
      font-size: 30px;
    }
    
    .achievement-notification .achievement-title {
      font-weight: bold;
      color: #7971ea;
      margin-bottom: 5px;
    }
    
    .achievement-notification .achievement-name {
      color: #333;
    }
  `;
  
  // Add to document head
  document.head.appendChild(style);
}); 