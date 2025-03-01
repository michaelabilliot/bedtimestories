// storyLoader.js

// Function to load a story JSON file from the /stories folder.
// Expects the file to be named {storyFile}.json
function loadStory(storyFile) {
  const path = `stories/${storyFile}.json`;
  return fetch(path)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load story: " + response.statusText);
      }
      return response.json();
    });
}

window.loadStory = loadStory;
