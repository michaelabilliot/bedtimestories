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
  
  // Check if we're actually on the memories page to prevent memories from showing on other pages
  if (window.getCurrentPage && window.getCurrentPage() !== 'memories') {
    console.log('Not on memories page, skipping memory setup');
    
    // Clean up any stray memory elements on other pages
    document.querySelectorAll('.page-container:not(#memoriesPage) .timeline-entry').forEach(el => {
      console.log('Removing stray memory element', el);
      el.remove();
    });
    
    return;
  }
  
  // Set a custom background for the memories page
  const globalBackground = document.getElementById('globalBackground');
  if (globalBackground) {
    globalBackground.style.backgroundImage = "linear-gradient(to bottom right, rgba(255,180,190,0.4), rgba(180,144,202,0.4)), url('images/memories-bg.jpg')";
  }
  
  // Get the timeline container
  const timelineContainer = document.getElementById('memoriesTimeline');
  if (!timelineContainer) return;
  
  // Make sure timeline container is only in the memories page
  if (!timelineContainer.closest('#memoriesPage')) {
    console.error('Timeline container found outside memories page, skipping setup');
    return;
  }
  
  // Get the placeholder element
  const placeholder = timelineContainer.querySelector('.timeline-placeholder');
  
  // Clear any existing entries before fetching new ones
  const existingEntries = timelineContainer.querySelectorAll('.timeline-entry');
  existingEntries.forEach(entry => {
    timelineContainer.removeChild(entry);
  });
  
  // Load the memories data
  fetch('scripts/memories.json?v=' + new Date().getTime())
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
      
      // Add each memory to the timeline
      memories.forEach((memory, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = 'timeline-entry';
        
        // Add the dot
        const dotElement = document.createElement('div');
        dotElement.className = 'timeline-dot';
        // Set a delay for the dot to appear after the timeline line
        // Each dot appears 0.5 seconds after the previous one
        const dotDelay = 1.5 + (index * 0.5);
        dotElement.style.animationDelay = `${dotDelay}s`;
        
        // Create the content
        const contentElement = document.createElement('div');
        contentElement.className = 'timeline-entry-content';
        // Set animation properties for staggered appearance
        contentElement.style.animationDuration = '0.6s';
        contentElement.style.animationFillMode = 'forwards';
        contentElement.style.animationTimingFunction = 'ease';
        // Each content appears 0.2 seconds after its dot
        contentElement.style.animationDelay = `${dotDelay + 0.2}s`;
        
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
      
      // Add entry animation when scrolling for entries that might be out of view
      setTimeout(() => {
        addScrollAnimation();
      }, (memories.length * 0.5 + 3) * 1000); // Wait for initial animations to complete
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
          // If the entry is already visible from the initial animation, don't change it
          if (entry.target.style.opacity !== '1') {
            entry.target.style.opacity = 1;
          }
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