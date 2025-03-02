# Bedtime Stories Application

A beautiful, interactive application for bedtime stories and relaxing music that can help you or a loved one drift into peaceful sleep.

## Features

- **Interactive Stories**: Navigate through beautiful illustrated stories with smooth transitions
- **Peaceful Music**: Play relaxing tracks to enhance your sleep experience
- **Customizable Experience**: Adjust background blur and zoom to your preference
- **Tab-based Navigation**: Switch easily between stories and music
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Performance Optimized**: Includes both development and production modes
- **Background Effects**: Beautiful animated backgrounds with adjustable blur and zoom

## File Structure

```
bedtimestories/
├── images/
│   ├── gallery.jpg            # Main gallery background
│   ├── music.jpg              # Music section background
│   ├── placeholder.jpg        # Default placeholder for missing images
│   ├── cat/                   # "Whiskers of Forgiveness" story images
│   │   ├── cover.jpg          # Thumbnail used in the gallery
│   │   └── scene0.jpg, ...    # Scene images used in the story
│   ├── sleepy-star/           # "Little Sleepy Star" story images
│   │   ├── cover.jpg          # Thumbnail used in the gallery
│   │   └── scene0.jpg, ...    # Scene images used in the story
│   └── friends-tale/          # "Friends Tale" story images
│       ├── cover.jpg          # Thumbnail used in the gallery
│       └── scene0.jpg, ...    # Scene images used in the story
├── music/
│   └── Judas/                 # Music track folder
│       ├── audio.mp3          # The actual music file
│       ├── album.jpg          # Album cover image
│       └── info.json          # Metadata about the track (optional)
├── stories/
│   ├── cat.json               # Story data for "Whiskers of Forgiveness"
│   ├── sleepy-star.json       # Story data for "Little Sleepy Star"
│   └── friends-tale.json      # Story data for "Friends Tale"
├── audios/
│   └── [story-folder]/
│       └── recording.mp3      # Narration audio for the story
├── scripts/
│   ├── main.js                # Main application logic
│   ├── storyLoader.js         # Story loading functionality
│   └── musicPlayer.js         # Music player functionality
├── build/                     # Production-ready optimized files
│   ├── styles.min.css         # Minified CSS
│   └── scripts/               # Minified JS files
├── styles.css                 # Main stylesheet
└── index.html                 # Main HTML file
```

## Usage

### Opening the Application

1. Simply open `index.html` in a modern web browser

### Stories

1. In the Stories tab, choose a story from the gallery
2. Navigate through the story using:
   - The arrow buttons at the bottom
   - The left/right arrow keys on your keyboard
   - The audio progress bar with scene indicators
3. Return to the gallery at any point by clicking "Go to Gallery" or pressing ESC

### Music

1. Switch to the Music tab by clicking the "Music" button in the navigation
2. Click on any music card to play the track
3. Use the controls at the bottom to:
   - Play/pause the music
   - Skip to previous/next track
   - Toggle volume on/off
   - Seek through the track using the progress bar

### Customization

1. Click the gear icon in the top-right corner to open settings
2. Adjust the background zoom and blur using the sliders
3. Toggle between development and production modes
4. Click "Save Changes" to apply your settings

## Development Guide

### Adding New Stories

1. Create a folder in `images/` with your story name (e.g., `new-story`)
2. Add a `cover.jpg` for the gallery thumbnail
3. Add scene images (`scene0.jpg`, `scene1.jpg`, etc.)
4. Create a JSON file in `stories/` (e.g., `new-story.json`) with the following structure:

```json
[
  {
    "order": 1,
    "image": "scene0.jpg",
    "content": "<h1>Story Title</h1><p>Introduction text</p>"
  },
  {
    "order": 2,
    "image": "scene1.jpg",
    "content": "<p>Scene 1 text content...</p>"
  },
  ...
]
```

5. Add your story to the array in the `setupGallery()` function in `main.js`

### Adding New Music Tracks

1. Create a folder in `music/` with your track name (e.g., `new-track`)
2. Add an `audio.mp3` file for the music
3. Add an `album.jpg` file for the cover art
4. Optionally, add an `info.json` file with metadata:

```json
{
  "title": "Track Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "year": "2023",
  ...
}
```

5. Add your track to the `musicTracks` array in `musicPlayer.js`

### Performance Optimization

The application includes both development and production modes:

- **Development Mode**: Uses unminified CSS and JS for easier debugging
- **Production Mode**: Uses minified files from the `build/` directory for better performance

To switch between modes:
1. Open the settings panel (gear icon)
2. Toggle "Development Mode" on or off
3. Confirm the page reload

To update the minified files:
```bash
# For CSS
cat styles.css | grep -v "^[[:space:]]*\/\/" | tr -s "\n" | tr -s " " > build/styles.min.css

# For JS
for file in scripts/*.js; do
  cat "$file" | grep -v "^[[:space:]]*\/\/" | tr -s "\n" | tr -s " " > "build/${file}"
done
```

## Recent Updates

- Added tab navigation for Stories and Music sections
- Implemented error handling for a more robust experience
- Added development/production mode toggle for performance optimization
- Fixed the story loading mechanism to use the correct file paths
- Improved music player to handle the current folder structure
- Added global error handling for better user experience
- Fixed bug causing stories not to load when clicked
- Ensured the music player displays and plays the Judas track correctly
- Improved error messages for user clarity
- Added loading indicators for asynchronous operations

## Browser Compatibility

- Chrome: Full support
- Firefox: Full support
- Safari: Full support
- Edge: Full support
- Mobile browsers: Optimized for touchscreens

## Credits

- Fonts: Google Fonts (Merriweather, Dancing Script)
- Icons: Material Icons
- Background noise texture generated programmatically

## License

All rights reserved. This application is for personal use only. 