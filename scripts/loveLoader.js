/**
 * Love Notes Loader JavaScript for Bedtime Stories App
 * Handles loading and displaying daily love notes with a calendar interface
 */

// Store the love notes data
let loveNotes = [];
// Track the current month and year being displayed
let currentMonth;
let currentYear;
// Store the currently selected note
let selectedNote = null;

/**
 * Set up the Daily Love page with calendar and love notes
 */
function setupLovePage() {
  console.log('Initializing love notes page...');
  
  // Check if we're actually on the love page
  if (window.getCurrentPage && window.getCurrentPage() !== 'love') {
    console.log('Not on love page, skipping love notes setup');
    return;
  }
  
  // Set a custom background for the love page
  const globalBackground = document.getElementById('globalBackground');
  if (globalBackground) {
    globalBackground.style.backgroundImage = "linear-gradient(to bottom right, rgba(255,180,190,0.4), rgba(180,144,202,0.4)), url('images/love-bg.jpg')";
  }
  
  // Get the love notes container
  const loveContainer = document.getElementById('loveNotesContainer');
  if (!loveContainer) return;
  
  // Clear any existing content (in case this function is called multiple times)
  loveContainer.innerHTML = '';
  
  // Remove any existing note displays and overlays from previous setups
  const existingNoteDisplay = document.getElementById('loveNoteDisplay');
  const existingOverlay = document.getElementById('noteOverlay');
  if (existingNoteDisplay) existingNoteDisplay.remove();
  if (existingOverlay) existingOverlay.remove();
  
  // Load the love notes data
  fetch('scripts/loveNotes.json?v=' + new Date().getTime())
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load love notes data');
      }
      return response.json();
    })
    .then(notes => {
      console.log('Loaded love notes:', notes);
      loveNotes = notes;
      
      // Initialize the calendar with the current month
      const today = new Date();
      currentMonth = today.getMonth();
      currentYear = today.getFullYear();
      
      // Create the calendar UI
      createCalendarUI(loveContainer);
      
      // Render the calendar with the current month
      renderCalendar(currentMonth, currentYear);
    })
    .catch(error => {
      console.error('Error loading love notes:', error);
      // Create a fallback message if loading fails
      const errorElement = document.createElement('div');
      errorElement.className = 'love-note-error';
      errorElement.innerHTML = '<h3>My Love Notes</h3><p>Every day brings a new reason to love you more.</p>';
      loveContainer.appendChild(errorElement);
    });
}

/**
 * Create the calendar UI elements
 * @param {HTMLElement} container - The container to append the calendar to
 */
function createCalendarUI(container) {
  // Create the calendar container
  const calendarContainer = document.createElement('div');
  calendarContainer.className = 'calendar-container';
  
  // Create the calendar header
  const calendarHeader = document.createElement('div');
  calendarHeader.className = 'calendar-header';
  
  // Create the month/year title
  const calendarTitle = document.createElement('div');
  calendarTitle.className = 'calendar-title';
  calendarTitle.id = 'calendarTitle';
  
  // Create the navigation buttons
  const calendarNav = document.createElement('div');
  calendarNav.className = 'calendar-nav';
  
  const prevButton = document.createElement('button');
  prevButton.innerHTML = '<span class="material-icons">chevron_left</span>';
  prevButton.addEventListener('click', () => navigateMonth(-1));
  
  const nextButton = document.createElement('button');
  nextButton.innerHTML = '<span class="material-icons">chevron_right</span>';
  nextButton.addEventListener('click', () => navigateMonth(1));
  
  // Append navigation elements
  calendarNav.appendChild(prevButton);
  calendarNav.appendChild(nextButton);
  calendarHeader.appendChild(calendarTitle);
  calendarHeader.appendChild(calendarNav);
  
  // Create the calendar grid
  const calendarGrid = document.createElement('div');
  calendarGrid.className = 'calendar-grid';
  calendarGrid.id = 'calendarGrid';
  
  // Add day headers
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOfWeek.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });
  
  // Append all elements to the calendar container
  calendarContainer.appendChild(calendarHeader);
  calendarContainer.appendChild(calendarGrid);
  
  // Create the note overlay for clicking outside to close
  const noteOverlay = document.createElement('div');
  noteOverlay.className = 'note-overlay';
  noteOverlay.id = 'noteOverlay';
  
  // Add click event to close when clicking outside
  noteOverlay.addEventListener('click', () => {
    closeLoveNote();
  });
  
  // Create the love note display area
  const loveNoteDisplay = document.createElement('div');
  loveNoteDisplay.className = 'love-note-display';
  loveNoteDisplay.id = 'loveNoteDisplay';
  
  // Append the calendar to the main container
  container.appendChild(calendarContainer);
  
  // Append the overlay and note display to the document body
  document.body.appendChild(noteOverlay);
  document.body.appendChild(loveNoteDisplay);
  
  console.log('Calendar UI created with overlay and note display');
}

/**
 * Render the calendar for a specific month and year
 * @param {number} month - The month to render (0-11)
 * @param {number} year - The year to render
 */
function renderCalendar(month, year) {
  console.log(`Rendering calendar for ${month+1}/${year}`);
  
  // Update the calendar title
  const calendarTitle = document.getElementById('calendarTitle');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  calendarTitle.textContent = `${monthNames[month]} ${year}`;
  
  // Get the calendar grid
  const calendarGrid = document.getElementById('calendarGrid');
  
  // Clear existing day cells (except headers)
  const dayHeaders = Array.from(calendarGrid.querySelectorAll('.calendar-day-header'));
  calendarGrid.innerHTML = '';
  
  // Re-add the day headers
  dayHeaders.forEach(header => {
    calendarGrid.appendChild(header);
  });
  
  // Get the first day of the month
  const firstDay = new Date(year, month, 1);
  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Get the day of the week the first day falls on (0-6)
  const firstDayOfWeek = firstDay.getDay();
  
  // Get today's date for comparison
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    calendarGrid.appendChild(emptyCell);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    dayCell.textContent = day;
    
    // Check if this day has a love note
    const hasNote = loveNotes.some(note => {
      const noteDate = new Date(note.date);
      return noteDate.getDate() === day && 
             noteDate.getMonth() === month && 
             noteDate.getFullYear() === year;
    });
    
    if (hasNote) {
      dayCell.classList.add('has-note');
    }
    
    // Check if this is today
    if (day === currentDay && month === currentMonth && year === currentYear) {
      dayCell.classList.add('today');
    }
    
    // Check if this is a past day
    const cellDate = new Date(year, month, day);
    const todayDate = new Date(currentYear, currentMonth, currentDay);
    todayDate.setHours(0, 0, 0, 0); // Reset time part for accurate comparison
    
    if (cellDate < todayDate) {
      dayCell.classList.add('past');
    }
    
    // Check if this is a future day
    if (cellDate > todayDate) {
      dayCell.classList.add('disabled');
      // Don't add click event for future days
    } else {
      // Add click event for current and past days
      dayCell.addEventListener('click', () => {
        if (hasNote) {
          console.log(`Day ${day} clicked, has note: ${hasNote}`);
          showLoveNote(day, month, year);
        }
      });
    }
    
    calendarGrid.appendChild(dayCell);
  }
}

/**
 * Navigate to the previous or next month
 * @param {number} direction - The direction to navigate (-1 for previous, 1 for next)
 */
function navigateMonth(direction) {
  // Update the current month and year
  currentMonth += direction;
  
  // Handle year change
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  
  // Re-render the calendar
  renderCalendar(currentMonth, currentYear);
  
  // Hide any displayed note when changing months
  closeLoveNote();
}

/**
 * Show a love note for a specific date
 * @param {number} day - The day of the note
 * @param {number} month - The month of the note (0-11)
 * @param {number} year - The year of the note
 */
function showLoveNote(day, month, year) {
  console.log(`Showing love note for ${month+1}/${day}/${year}`);
  
  // Find the note for this date
  const note = loveNotes.find(note => {
    const noteDate = new Date(note.date);
    return noteDate.getDate() === day && 
           noteDate.getMonth() === month && 
           noteDate.getFullYear() === year;
  });
  
  if (!note) {
    console.log(`No note found for ${month+1}/${day}/${year}`);
    return;
  }
  
  console.log('Note found:', note);
  
  // Get the love note display and overlay
  const loveNoteDisplay = document.getElementById('loveNoteDisplay');
  const noteOverlay = document.getElementById('noteOverlay');
  
  if (!loveNoteDisplay || !noteOverlay) {
    console.error('Love note display or overlay not found in the DOM');
    return;
  }
  
  // Format the date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(year, month, day).toLocaleDateString(undefined, options);
  
  // Update the love note display
  loveNoteDisplay.innerHTML = `
    <div class="love-note-date">${formattedDate}</div>
    <div class="love-note-content">${note.content}</div>
    <div class="love-note-signature">Love, Michael</div>
  `;
  
  // Show the love note display and overlay
  noteOverlay.classList.add('visible');
  loveNoteDisplay.classList.add('visible');
}

/**
 * Close the love note display
 */
function closeLoveNote() {
  const loveNoteDisplay = document.getElementById('loveNoteDisplay');
  const noteOverlay = document.getElementById('noteOverlay');
  
  if (loveNoteDisplay) {
    loveNoteDisplay.classList.remove('visible');
  }
  
  if (noteOverlay) {
    noteOverlay.classList.remove('visible');
  }
}

// Add event listener to close note when pressing escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLoveNote();
  }
});

// Export functions for use in pageHandler.js
window.setupLovePage = setupLovePage; 