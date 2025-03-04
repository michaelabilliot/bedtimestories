/**
 * Memory Timeline Loader JavaScript for Bedtime Stories App
 * Handles loading and displaying memory timeline entries
 */

/**
 * Set up the Memories page with timeline events
 * This function loads memories from a JSON file and creates the timeline
 */
function setupMemoriesPage() {
  console.log('Initializing memories page...');
  
  // Check if we're actually on the memories page
  if (window.getCurrentPage && window.getCurrentPage() !== 'memories') {
    console.log('Not on memories page, skipping memories setup');
    return;
  }
  
  // Set a custom background for the memories page
  const globalBackground = document.getElementById('globalBackground');
  if (globalBackground) {
    globalBackground.style.backgroundImage = "linear-gradient(to bottom right, rgba(255,180,190,0.4), rgba(180,144,202,0.4)), url('images/memories-bg.jpg')";
  }
  
  // Get the timeline container
  const timeline = document.getElementById('memoriesTimeline');
  if (!timeline) return;
  
  // Clear any existing entries except the placeholder
  const placeholder = timeline.querySelector('.timeline-placeholder');
  timeline.innerHTML = '';
  if (placeholder) {
    timeline.appendChild(placeholder);
  }
  
  // Add the center line first with a fast animation
  const centerLine = document.createElement('div');
  centerLine.className = 'timeline-center-line';
  timeline.appendChild(centerLine);
  
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
      
      // Add each memory to the timeline with staggered animations
      memories.forEach((memory, index) => {
        // Create the timeline entry
        const entryElement = document.createElement('div');
        entryElement.className = 'timeline-entry';
        entryElement.setAttribute('data-aos', 'fade-up');
        
        // Create the dot element with a staggered delay
        const dotElement = document.createElement('div');
        dotElement.className = 'timeline-dot';
        // Make dots appear faster with a small stagger
        dotElement.style.animationDelay = `${0.3 + (index * 0.1)}s`;
        entryElement.appendChild(dotElement);
        
        // Create the content element
        const contentElement = document.createElement('div');
        contentElement.className = `timeline-entry-content ${index % 2 === 0 ? 'timeline-entry-left' : 'timeline-entry-right'}`;
        
        // Set the animation for the content based on its position
        if (index % 2 === 0) {
          contentElement.style.animation = 'slideInRight 0.3s ease-in-out forwards';
        } else {
          contentElement.style.animation = 'slideInLeft 0.3s ease-in-out forwards';
        }
        
        // Make content appear right after its dot
        const dotDelay = 0.3 + (index * 0.1);
        contentElement.style.animationDelay = `${dotDelay + 0.1}s`;
        
        // Add the memory content
        contentElement.innerHTML = `
          <h3>${memory.title}</h3>
          <div class="timeline-entry-date">${memory.date}</div>
          <p>${memory.description}</p>
        `;
        
        entryElement.appendChild(contentElement);
        timeline.appendChild(entryElement);
        
        // Add click event to highlight the memory when clicked
        contentElement.addEventListener('click', () => {
          // Remove active class from all entries
          document.querySelectorAll('.timeline-entry-content').forEach(entry => {
            entry.classList.remove('active');
          });
          
          // Add active class to this entry
          contentElement.classList.add('active');
        });
      });
      
      // Add the placeholder back at the end
      if (placeholder) {
        timeline.appendChild(placeholder);
      }
      
      // Add scroll animations after a short delay to allow initial animations to complete
      setTimeout(() => {
        const timelineEntries = document.querySelectorAll('.timeline-entry-content');
        
        // Function to check if an element is in the viewport
        function isInViewport(element) {
          const rect = element.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        }
        
        // Function to handle scroll events
        function handleScroll() {
          timelineEntries.forEach(entry => {
            if (isInViewport(entry) && !entry.classList.contains('highlight')) {
              entry.classList.add('highlight');
            }
          });
        }
        
        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
        
        // Trigger once on load
        handleScroll();
      }, memories.length * 100 + 500); // Shorter delay based on number of memories
    })
    .catch(error => {
      console.error('Error loading memories:', error);
      // Create a fallback message if loading fails
      const errorElement = document.createElement('div');
      errorElement.className = 'timeline-entry-content';
      errorElement.innerHTML = '<h3>Our Story</h3><p>Every day with you is a new chapter in our beautiful story.</p>';
      timeline.insertBefore(errorElement, placeholder);
    });
}

// Export the function for use in pageHandler.js
window.setupMemoriesPage = setupMemoriesPage; 