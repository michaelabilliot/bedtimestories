# Bedtime Stories

A beautiful web application that presents bedtime stories and relaxing music, designed for parents to share special moments with their children before bedtime.

## Features

### Stories Section
- Gallery of bedtime stories with a featured "Today's Special" selection
- Smooth scene transitions with fade effects
- Auto-advancing scenes based on audio narration
- Navigation controls for moving between scenes
- Customizable background blur and zoom settings

### Music Section
- Relaxing music tracks for bedtime
- Beautiful album covers in a card-based gallery
- Music player with play/pause, next/previous, and progress controls
- Smooth transitions and animations

### General Features
- Tab-based navigation between Stories and Music sections
- Responsive design that works on all devices
- Settings panel for customizing the background appearance
- Love note from the creator that adds a personal touch

## File Structure

```
/
├── index.html           # Main HTML file
├── styles.css           # All CSS styles
├── scripts/
│   ├── main.js          # Core functionality for the app
│   ├── storyLoader.js   # Loads and displays stories
│   └── musicPlayer.js   # Handles music playback and tab navigation
├── images/
│   ├── gallery.jpg      # Background for the gallery
│   ├── [story-folder]/  # Contains images for each story
│   │   ├── cover.jpg    # Story cover image
│   │   └── [scene].jpg  # Scene images
│   └── music/           # Contains music cover images
├── stories/
│   ├── stories.json     # List of all available stories
│   └── [story-folder]/  # Contains story data
│       └── scenes.json  # Scene data for each story
└── audio/               # Music track audio files
```

## Usage

1. **Navigate between tabs** - Use the "Stories" and "Music" tabs to switch between sections
2. **Stories Section:**
   - Select a story from the gallery to begin
   - Navigate between scenes using the arrow buttons or keyboard (left/right arrows)
   - Control narration using the audio player
   - Return to the gallery using the "Go to Gallery" button or Escape key
3. **Music Section:**
   - Select a music track to play
   - Control playback using the music player controls
   - Navigate between tracks using the player controls

## Settings

Click the gear icon to open the settings panel, where you can adjust:
- **Background Zoom** - Changes the zoom level of the background image
- **Background Blur** - Adjusts the blur effect on the background

## Development

To add new stories:
1. Create a new folder in `/stories/` with a unique folder name
2. Add a `scenes.json` file with the scene data
3. Add images to the corresponding folder in `/images/`
4. Add an entry to `stories.json` with the story details

To add new music:
1. Add the MP3 file to the `/audio/` directory
2. Add the cover image to `/images/music/`
3. Update the `musicTracks` array in `musicPlayer.js`

## Credits

- Fonts: Google Fonts (Poppins, Satisfy)
- Icons: Material Icons
- Background images and audio must be added by the user

Enjoy the special bedtime moments! ♥ 