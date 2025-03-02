// storyLoader.js

/**
 * Asynchronously loads available story data.
 */
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // FIXED: Instead of fetching stories.json, we'll use the hardcoded stories directly
    // since they're defined in main.js's setupGallery function
    console.log("storyLoader.js: This file is now a supplementary library. Story loading has been moved to main.js");
  } catch (error) {
    console.error('Error loading stories:', error);
  }
});

/**
 * Legacy function for backward compatibility
 * Actual implementation is in main.js now
 */
function populateGallery(storiesData) {
  console.warn("populateGallery in storyLoader.js is deprecated. Using setupGallery in main.js instead.");
  if (typeof window.setupGallery === 'function') {
    window.setupGallery();
  }
}

/**
 * Returns the index of today's story based on the day of the month.
 * This helper function is still useful for main.js
 */
function getTodaysStoryIndex(storiesData) {
  if (storiesData.length === 0) return -1;
  
  const today = new Date();
  const dayOfMonth = today.getDate();
  
  // Use the day of month modulo number of stories to cycle through them
  return dayOfMonth % storiesData.length;
}

/**
 * Legacy function for backward compatibility
 * Actual implementation is in main.js now
 */
async function loadStory(story) {
  console.warn("loadStory in storyLoader.js is deprecated. Using loadStory in main.js instead.");
  try {
    // FIXED: Call the proper function in main.js with correct pathing
    if (typeof window.loadStory === 'function') {
      const storyData = await window.loadStory(story.folder);
      if (typeof window.loadStoryData === 'function') {
        window.loadStoryData(storyData, story.folder);
      }
    } else {
      throw new Error("loadStory function not found in main.js");
    }
  } catch (error) {
    console.error('Error in legacy loadStory:', error);
    alert(`Failed to load story: ${error.message}`);
  }
}

/**
 * Creates a special card for today's story.
 * This helper function may still be useful
 */
function createTodayCard(story) {
  const card = document.createElement('div');
  card.className = 'card today-card';
  card.innerHTML = `
    <div class="special-badge">Today's Special</div>
    <img src="images/${story.folder}/cover.jpg" alt="${story.title}">
    <h3>${story.title}</h3>
    <p>${story.description}</p>
  `;
  card.addEventListener('click', () => loadStory(story));
  return card;
}

// Export helper functions to the window object for accessibility from main.js
window.storyHelpers = {
  getTodaysStoryIndex,
  createTodayCard
};
