/**
 * Memory Loader JavaScript for Bedtime Stories App
 * Handles loading and displaying memories in the timeline
 */

/**
 * Set up the Memories page with timeline events
 * This function loads memories from a JSON file and creates the timeline
 */
function setupMemoriesPage() {
  console.log('Initializing memories page...');
  
  // Set a custom background for the memories page
  const globalBackground = document.getElementById('globalBackground');
  if (globalBackground) {
    globalBackground.style.backgroundImage = "linear-gradient(to bottom right, rgba(255,180,190,0.4), rgba(180,144,202,0.4)), url('images/memories-bg.jpg')";
  }
  
  // Get the timeline container
  const timelineContainer = document.getElementById('memoriesTimeline');
  if (!timelineContainer) return;
  
  // Get the placeholder element
  const placeholder = timelineContainer.querySelector('.timeline-placeholder');
  
  // Load the memories data
  fetch('scripts/memories.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load memories data');
      }
      return response.json();
    })
    .then(memories => {
      console.log('Loaded memories:', memories); // Debug log to check what's being loaded
      
      // Sort memories by order if needed
      memories.sort((a, b) => a.order - b.order);
      
      // Clear any existing entries (excluding the placeholder)
      const existingEntries = timelineContainer.querySelectorAll('.timeline-entry');
      existingEntries.forEach(entry => {
        timelineContainer.removeChild(entry);
      });
      
      // Add each memory to the timeline
      memories.forEach(memory => {
        const entryElement = document.createElement('div');
        entryElement.className = 'timeline-entry';
        
        // Add the dot
        const dotElement = document.createElement('div');
        dotElement.className = 'timeline-dot';
        
        // Create the content
        const contentElement = document.createElement('div');
        contentElement.className = 'timeline-entry-content';
        contentElement.style.animationDelay = `${0.1 + (memory.order * 0.05)}s`;
        
        // Add date, title, and description
        const dateElement = document.createElement('span');
        dateElement.className = 'timeline-entry-date';
        dateElement.textContent = memory.date;
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = memory.title;
        
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = memory.description;
        
        // Add all elements to the content
        contentElement.appendChild(dateElement);
        contentElement.appendChild(titleElement);
        contentElement.appendChild(descriptionElement);
        
        // Add all elements to the entry
        entryElement.appendChild(dotElement);
        entryElement.appendChild(contentElement);
        
        // Insert the entry before the placeholder
        timelineContainer.insertBefore(entryElement, placeholder);
      });
      
      // Add entry animation when scrolling
      addScrollAnimation();
    })
    .catch(error => {
      console.error('Error loading memories:', error);
      // Create a fallback message if loading fails
      const errorElement = document.createElement('div');
      errorElement.className = 'timeline-entry-content';
      errorElement.innerHTML = '<h3>Our Story</h3><p>Every day with you is a new chapter in our beautiful story.</p>';
      timelineContainer.insertBefore(errorElement, placeholder);
    });
}

/**
 * Add scroll animation to timeline entries
 */
function addScrollAnimation() {
  const timelineEntries = document.querySelectorAll('.timeline-entry-content');
  
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const appearOptions = {
      threshold: 0.25,
      rootMargin: "0px 0px -100px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          observer.unobserve(entry.target);
        }
      });
    }, appearOptions);
    
    timelineEntries.forEach(entry => {
      appearOnScroll.observe(entry);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    timelineEntries.forEach(entry => {
      entry.style.opacity = 1;
    });
  }
}

// Export functions for use in pageHandler.js
window.setupMemoriesPage = setupMemoriesPage; 