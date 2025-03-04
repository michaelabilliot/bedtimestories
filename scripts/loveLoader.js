/**
 * Love Notes Loader JavaScript for Bedtime Stories App
 * Handles loading and displaying daily love notes with a calendar interface
 */

// Store the love notes data
let loveNotes = [];

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
  
  // Clear any existing content
  loveContainer.innerHTML = '';
  
  // Create the love note display area first (it will appear above the calendar)
  const loveNoteDisplay = document.createElement('div');
  loveNoteDisplay.className = 'love-note-display';
  loveNoteDisplay.id = 'loveNoteDisplay';
  loveNoteDisplay.innerHTML = '<div class="love-note-content">Select a day to view your love note</div>';
  loveContainer.appendChild(loveNoteDisplay);
  
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
      
      // Create the calendar container
      const calendarContainer = document.createElement('div');
      calendarContainer.className = 'calendar-container';
      loveContainer.appendChild(calendarContainer);
      
      // Create the current month display
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      // Create the calendar header
      const calendarHeader = document.createElement('div');
      calendarHeader.className = 'calendar-header';
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      // Create month navigation
      const prevMonthBtn = document.createElement('button');
      prevMonthBtn.className = 'month-nav-btn';
      prevMonthBtn.innerHTML = '<span class="material-icons">chevron_left</span>';
      
      const monthTitle = document.createElement('div');
      monthTitle.className = 'month-title';
      monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
      
      const nextMonthBtn = document.createElement('button');
      nextMonthBtn.className = 'month-nav-btn';
      nextMonthBtn.innerHTML = '<span class="material-icons">chevron_right</span>';
      
      calendarHeader.appendChild(prevMonthBtn);
      calendarHeader.appendChild(monthTitle);
      calendarHeader.appendChild(nextMonthBtn);
      calendarContainer.appendChild(calendarHeader);
      
      // Create the days of week header
      const daysHeader = document.createElement('div');
      daysHeader.className = 'days-header';
      
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        daysHeader.appendChild(dayHeader);
      });
      
      calendarContainer.appendChild(daysHeader);
      
      // Create the days grid
      const daysGrid = document.createElement('div');
      daysGrid.className = 'days-grid';
      calendarContainer.appendChild(daysGrid);
      
      // Render the current month
      renderMonth(currentMonth, currentYear, daysGrid);
      
      // Add event listeners for month navigation
      prevMonthBtn.addEventListener('click', () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;
        
        if (newMonth < 0) {
          newMonth = 11;
          newYear--;
        }
        
        monthTitle.textContent = `${monthNames[newMonth]} ${newYear}`;
        renderMonth(newMonth, newYear, daysGrid);
      });
      
      nextMonthBtn.addEventListener('click', () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        
        if (newMonth > 11) {
          newMonth = 0;
          newYear++;
        }
        
        monthTitle.textContent = `${monthNames[newMonth]} ${newYear}`;
        renderMonth(newMonth, newYear, daysGrid);
      });
      
      // Show today's note if available
      const todayNote = findNoteForDate(today);
      if (todayNote) {
        displayNote(todayNote);
        loveNoteDisplay.classList.add('visible');
      }
    })
    .catch(error => {
      console.error('Error loading love notes:', error);
      // Create a fallback message if loading fails
      loveContainer.innerHTML = '<div class="error-message">Failed to load love notes. Please try again later.</div>';
    });
}

/**
 * Render a month in the calendar
 * @param {number} month - The month to render (0-11)
 * @param {number} year - The year to render
 * @param {HTMLElement} container - The container to render the days in
 */
function renderMonth(month, year, container) {
  // Clear the container
  container.innerHTML = '';
  
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
    emptyCell.className = 'day-cell empty';
    container.appendChild(emptyCell);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';
    dayCell.textContent = day;
    
    // Create a date object for this day
    const cellDate = new Date(year, month, day);
    
    // Check if this day has a love note
    const note = findNoteForDate(cellDate);
    
    if (note) {
      dayCell.classList.add('has-note');
    }
    
    // Check if this is today
    if (day === currentDay && month === currentMonth && year === currentYear) {
      dayCell.classList.add('today');
    }
    
    // Check if this is a past day
    if (cellDate < new Date(currentYear, currentMonth, currentDay)) {
      dayCell.classList.add('past');
    }
    
    // Check if this is a future day
    if (cellDate > today) {
      dayCell.classList.add('disabled');
    } else if (note) {
      // Add click event for days with notes (only for current or past days)
      dayCell.addEventListener('click', () => {
        displayNote(note);
        
        // Show the note display
        const loveNoteDisplay = document.getElementById('loveNoteDisplay');
        if (loveNoteDisplay) {
          loveNoteDisplay.classList.add('visible');
        }
        
        // Highlight the selected day
        const selectedDay = document.querySelector('.day-cell.selected');
        if (selectedDay) {
          selectedDay.classList.remove('selected');
        }
        dayCell.classList.add('selected');
      });
    }
    
    container.appendChild(dayCell);
  }
}

/**
 * Find a note for a specific date
 * @param {Date} date - The date to find a note for
 * @returns {Object|null} The note object or null if not found
 */
function findNoteForDate(date) {
  return loveNotes.find(note => {
    const noteDate = new Date(note.date);
    return noteDate.getDate() === date.getDate() && 
           noteDate.getMonth() === date.getMonth() && 
           noteDate.getFullYear() === date.getFullYear();
  }) || null;
}

/**
 * Display a note in the love note display area
 * @param {Object} note - The note object to display
 */
function displayNote(note) {
  const loveNoteDisplay = document.getElementById('loveNoteDisplay');
  if (!loveNoteDisplay) return;
  
  // Format the date
  const noteDate = new Date(note.date);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = noteDate.toLocaleDateString(undefined, options);
  
  // Update the love note display
  loveNoteDisplay.innerHTML = `
    <button class="love-note-close" id="closeNoteBtn">
      <span class="material-icons">close</span>
    </button>
    <div class="love-note-date">${formattedDate}</div>
    <div class="love-note-content">${note.content}</div>
    <div class="love-note-signature">Love, Michael</div>
  `;
  
  // Add event listener to close button
  const closeBtn = document.getElementById('closeNoteBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      // Hide the note display
      loveNoteDisplay.classList.remove('visible');
      
      // Remove selected class from the day
      const selectedDay = document.querySelector('.day-cell.selected');
      if (selectedDay) {
        selectedDay.classList.remove('selected');
      }
    });
  }
}

// Export functions for use in pageHandler.js
window.setupLovePage = setupLovePage; 