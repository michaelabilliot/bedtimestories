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
  // Sample stories - in a real application, these would likely come from a JSON file or API
  const availableStories = [
    { title: "Friends Tale", file: "friends-tale", cover: "images/friends-tale/cover.jpg", order: 1, today: false, description: "A heartwarming tale of friendship and love" },
    { title: "Little Sleepy Star", file: "sleepy-star", cover: "images/sleepy-star/scene0.jpg", order: 2, today: true, description: "A magical bedtime adventure with a sleepy little star" },
    { title: "Cat", file: "cat", cover: "images/cat/cover.jpg", order: 3, today: false, description: "A story about a cat" },
    // Add more sample stories to fill out the 4x4 grid
    { title: "The Dream Garden", file: "dream-garden", cover: "images/friends-tale/cover.jpg", order: 4, today: false, description: "A magical journey through a garden of dreams" },
    { title: "Moonlit Adventure", file: "moonlit-adventure", cover: "images/sleepy-star/scene0.jpg", order: 5, today: false, description: "An adventure under the moonlight" },
    { title: "Starry Night", file: "starry-night", cover: "images/cat/cover.jpg", order: 6, today: false, description: "A tale about the stars in the night sky" },
    { title: "Fluffy Clouds", file: "fluffy-clouds", cover: "images/friends-tale/cover.jpg", order: 7, today: false, description: "Journey through the fluffy clouds" },
    { title: "Ocean Dreams", file: "ocean-dreams", cover: "images/sleepy-star/scene0.jpg", order: 8, today: false, description: "A dreamy adventure under the sea" },
    { title: "Forest Friends", file: "forest-friends", cover: "images/cat/cover.jpg", order: 9, today: false, description: "Meet the friendly animals of the forest" },
    { title: "Magic Journey", file: "magic-journey", cover: "images/friends-tale/cover.jpg", order: 10, today: false, description: "A magical journey to far away lands" },
    { title: "Sweet Dreams", file: "sweet-dreams", cover: "images/sleepy-star/scene0.jpg", order: 11, today: false, description: "A story to help you have sweet dreams" },
    { title: "Twinkle Stars", file: "twinkle-stars", cover: "images/cat/cover.jpg", order: 12, today: false, description: "A story about the twinkling stars" },
    { title: "Rainbow Tales", file: "rainbow-tales", cover: "images/friends-tale/cover.jpg", order: 13, today: false, description: "Adventure across the rainbow" },
    { title: "Sleepy Time", file: "sleepy-time", cover: "images/sleepy-star/scene0.jpg", order: 14, today: false, description: "A gentle story for sleepy time" },
    { title: "Cuddly Bears", file: "cuddly-bears", cover: "images/cat/cover.jpg", order: 15, today: false, description: "A story about cuddly teddy bears" },
    { title: "Dream Fairies", file: "dream-fairies", cover: "images/friends-tale/cover.jpg", order: 16, today: false, description: "Meet the magical dream fairies" }
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
        // Add fade-out class to gallery
        document.getElementById('gallery').classList.add('fade-out');
        
        // Load story after short delay for fade effect
        setTimeout(() => {
          loadStory(story.file)
            .then(data => { loadStoryData(data, story.file); })
            .catch(err => { 
              console.error("Error loading story:", err);
              showErrorMessage("Failed to load story. Please try again.");
              // Remove fade-out if there's an error
              document.getElementById('gallery').classList.remove('fade-out');
            });
        }, 500); // Match this with the CSS transition duration
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
    
    // Create a container for the cards to display them in a grid
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
        // Add fade-out class to gallery
        document.getElementById('gallery').classList.add('fade-out');
        
        // Load story after short delay for fade effect
        setTimeout(() => {
          loadStory(story.file)
            .then(data => { loadStoryData(data, story.file); })
            .catch(err => { 
              console.error("Error loading story:", err);
              showErrorMessage("Failed to load story. Please try again.");
              // Remove fade-out if there's an error
              document.getElementById('gallery').classList.remove('fade-out');
            });
        }, 500); // Match this with the CSS transition duration
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
