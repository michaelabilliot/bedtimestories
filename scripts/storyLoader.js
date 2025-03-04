// storyLoader.js

function loadStory(storyFile) {
  // Get the base URL for the project, works in both local and GitHub Pages environments
  const basePath = window.location.pathname.endsWith('/') ? 
    window.location.pathname : 
    window.location.pathname + '/';
  
  const path = `${basePath}stories/${storyFile}.json`;
  
  return fetch(path)
    .then(response => {
      if (!response.ok) {
        // If the first approach fails, try a relative path
        console.log(`Failed to load from ${path}, trying relative path...`);
        return fetch(`stories/${storyFile}.json`);
      }
      return response;
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load story: " + response.statusText);
      }
      return response.json();
    });
}

// Make loadStory available globally
window.loadStory = loadStory;

/**
 * Builds the gallery with available stories.
 * If a story has "today: true", it is displayed in a separate "Today's Story" section.
 */
function setupGallery() {
  const availableStories = [
    { title: "Friends Tale", file: "friends-tale", cover: "images/friends-tale/cover.jpg", order: 1, today: false, description: "A heartwarming tale of friendship and love" },
    { title: "Little Sleepy Star", file: "sleepy-star", cover: "images/sleepy-star/scene0.jpg", order: 2, today: true, description: "A magical bedtime adventure with a sleepy little star" },
    { title: "Cat", file: "cat", cover: "images/cat/cover.jpg", order: 3, today: false, description: "A story about a cat" }
  ];
  availableStories.sort((a, b) => a.order - b.order);
  
  // Set global background to gallery image with a romantic gradient overlay
  document.getElementById('globalBackground').style.backgroundImage = "linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url('images/gallery.jpg')";
  
  const storyCardsContainer = document.getElementById("storyCards");
  if (!storyCardsContainer) {
    console.error("Story cards container not found");
    return;
  }
  
  storyCardsContainer.innerHTML = "";
  
  // Create container for Today's Story (if any)
  const todaysStories = availableStories.filter(story => story.today);
  const otherStories = availableStories.filter(story => !story.today);
  
  if (todaysStories.length > 0) {
    const todaysSection = document.createElement("div");
    todaysSection.className = "todays-story-section";
    todaysSection.innerHTML = "<h2>Tonight's Special</h2>";
    todaysStories.forEach(story => {
      const card = document.createElement("div");
      card.className = "story-card todays-story";
      card.setAttribute("data-story", story.file);
      card.innerHTML = `
        <img src="${story.cover ? story.cover : 'images/' + story.file + '/scene0.jpg'}" alt="${story.title} Cover">
        <div class="story-title">${story.title}</div>
      `;
      card.addEventListener("click", () => {
        loadStory(story.file)
          .then(data => { loadStoryData(data, story.file); })
          .catch(err => { 
            console.error("Error loading story:", err);
            showErrorMessage("Failed to load story. Please try again.");
          });
      });
      todaysSection.appendChild(card);
      
      // Add description below the card
      if (story.description) {
        const descriptionEl = document.createElement("p");
        descriptionEl.className = "story-description";
        descriptionEl.textContent = story.description;
        todaysSection.appendChild(descriptionEl);
      }
    });
    storyCardsContainer.appendChild(todaysSection);
  }
  
  if (otherStories.length > 0) {
    const otherSection = document.createElement("div");
    otherSection.className = "other-stories-section";
    otherSection.innerHTML = "<h2>More Sweet Dreams</h2>";
    
    // Create a container for the cards to display them in a row
    const cardsContainer = document.createElement("div");
    cardsContainer.className = "story-cards-row";
    
    otherStories.forEach(story => {
      const card = document.createElement("div");
      card.className = "story-card";
      card.setAttribute("data-story", story.file);
      card.innerHTML = `
        <img src="${story.cover ? story.cover : 'images/' + story.file + '/scene0.jpg'}" alt="${story.title} Cover">
        <div class="story-title">${story.title}</div>
      `;
      card.addEventListener("click", () => {
        loadStory(story.file)
          .then(data => { loadStoryData(data, story.file); })
          .catch(err => { 
            console.error("Error loading story:", err);
            showErrorMessage("Failed to load story. Please try again.");
          });
      });
      cardsContainer.appendChild(card);
    });
    
    otherSection.appendChild(cardsContainer);
    storyCardsContainer.appendChild(otherSection);
  }
}

/**
 * Show an error message to the user
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
  // Check if an error container already exists
  let errorContainer = document.getElementById('errorContainer');
  
  // If not, create one
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.id = 'errorContainer';
    errorContainer.className = 'error-container';
    document.body.appendChild(errorContainer);
  }
  
  // Create the error message element
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.innerHTML = `
    <span class="material-icons">error</span>
    <p>${message}</p>
    <button class="close-error">
      <span class="material-icons">close</span>
    </button>
  `;
  
  // Add click event to close the error
  const closeButton = errorMessage.querySelector('.close-error');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      errorMessage.remove();
      
      // If there are no more error messages, hide the container
      if (errorContainer.children.length === 0) {
        errorContainer.remove();
      }
    });
  }
  
  // Auto-remove the error after 5 seconds
  setTimeout(() => {
    if (errorMessage.parentNode) {
      errorMessage.remove();
      
      // If there are no more error messages, hide the container
      if (errorContainer.children.length === 0) {
        errorContainer.remove();
      }
    }
  }, 5000);
  
  // Add the error message to the container
  errorContainer.appendChild(errorMessage);
}

// Make setupGallery available globally
window.setupGallery = setupGallery;
