# Bedtime Stories Application

A beautiful web application for bedtime stories and relaxing music.

## Features

- **Stories Section**: Browse and read bedtime stories with beautiful illustrations and audio narration.
- **Music Section**: Listen to relaxing music with a beautiful player interface.
- **Customizable Experience**: Adjust background zoom and blur to your preference.
- **Responsive Design**: Works on desktop and mobile devices.

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript if you want to customize

### Installation

1. Clone or download this repository
2. No build process required - it's pure HTML, CSS, and JavaScript

### Running the Application

Simply open the `index.html` file in your web browser, or host the files on any web server.

## Adding New Content

### Adding a New Story

1. Create a new folder in the `stories` directory with your story name (e.g., `my-new-story`)
2. Create a JSON file in the `stories` directory with the same name (e.g., `my-new-story.json`)
3. Add scene images to the `images/my-new-story` directory
4. Add an audio recording to the `audios/my-new-story` directory as `recording.mp3`
5. Update the `availableStories` array in the `setupGallery` function in `scripts/storyLoader.js`

The story JSON file should follow this format:

```json
[
  {
    "order": 0,
    "title": "My New Story",
    "content": "Once upon a time...",
    "image": "scene0.jpg"
  },
  {
    "order": 1,
    "title": "Chapter 1",
    "content": "The adventure begins...",
    "image": "scene1.jpg",
    "start": 10,
    "end": 60
  }
]
```

### Adding New Music

1. Create a new folder in the `music` directory with your track name (e.g., `my-new-track`)
2. Add the following files to the folder:
   - `music.mp3`: The audio file
   - `album.jpg`: The album cover image
   - `music.json`: Metadata about the track
3. Update the `music/index.json` file to include your new track

The music.json file should follow this format:

```json
{
  "title": "My New Track",
  "artist": "Artist Name",
  "album": "Album Name",
  "description": "A description of the track",
  "producer": "Producer Name",
  "date": "2023-03-01",
  "lyrics": "Instrumental",
  "duration": "3:45",
  "genre": "Ambient",
  "mood": "Calm"
}
```

## Project Structure

- `index.html`: Main HTML file
- `styles.css`: All styles for the application
- `scripts/`: JavaScript files
  - `pageHandler.js`: Manages navigation between different sections
  - `storyLoader.js`: Handles loading and displaying stories
  - `musicLoader.js`: Handles loading and playing music
  - `main.js`: Core functionality for the application
- `images/`: Image assets
- `stories/`: Story JSON files
- `audios/`: Audio files for stories
- `music/`: Music files and metadata

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Your loved ones for inspiration 