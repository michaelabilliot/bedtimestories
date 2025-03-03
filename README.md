# For My Love - A Personal Tribute Website

A beautiful, personalized tribute website for my girlfriend with bedtime stories, music, and shared memories.

## Features

- **Our Stories Section**: Browse and read bedtime stories with beautiful illustrations and audio narration.
- **Our Playlist Section**: Listen to music that has special meaning to our relationship.
- **Memories Section**: A timeline of our precious moments together.
- **Love Notes**: Sweet messages that appear with a click of the heart button.
- **Customizable Experience**: Adjust background zoom and blur to your preference.
- **Responsive Design**: Works beautifully on all devices.

## Design Approach

This website was created as a personal tribute, with every element carefully designed to create an intimate, warm atmosphere:

- **Color Palette**: Soft pinks and purples create a romantic, dreamy ambiance.
- **Typography**: Elegant fonts (Playfair Display for headings, Lato for body text, and Dancing Script for handwritten elements) convey both sophistication and personal touch.
- **Animation**: Subtle animations like floating hearts add charm without overwhelming the experience.
- **Responsive Layout**: The design adapts gracefully to any screen size without compromising on visual appeal.

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

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript if you want to customize

### Installation

1. Clone or download this repository
2. No build process required - it's pure HTML, CSS, and JavaScript

### Running the Application

Simply open the `index.html` file in your web browser, or host the files on any web server like GitHub Pages.

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

1. Create a new folder in the `music` directory with your track name (e.g., `our-song`)
2. Add the following files to the folder:
   - `music.mp3`: The audio file
   - `album.jpg`: The album cover image
   - `music.json`: Metadata about the track
3. Update the `music/index.json` file to include your new track

### Adding New Memories

The Memories section can be expanded by modifying the timeline in the memories page. You can:

1. Create a JSON file with your special moments and dates
2. Update the `setupMemoriesPage` function to load and display these moments
3. Add photos to the `images/memories` directory

## Personalization

This website is designed to be easily customizable to reflect your unique relationship:

- Change colors in `styles.css` to match your significant other's favorite colors
- Update text content in `index.html` to include personal messages
- Replace background images with photos that have special meaning to both of you
- Customize the love note content with your own heartfelt messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Fonts for typography
- Material Icons for iconography
- With endless love and admiration for her 