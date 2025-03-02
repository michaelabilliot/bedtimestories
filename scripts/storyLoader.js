// storyLoader.js

function loadStory(storyFile) {
  // Get the base URL for the project, works in both local and GitHub Pages environments
  const basePath = window.location.pathname.endsWith('/') ? 
    window.location.pathname : 
    window.location.pathname + '/';
  
  const path = `${basePath}stories/${storyFile}.json`;
  
  return fetch(path)
    .then(response => {
      if (!response.ok) {
        // If the first approach fails, try a relative path
        console.log(`Failed to load from ${path}, trying relative path...`);
        return fetch(`stories/${storyFile}.json`);
      }
      return response;
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load story: " + response.statusText);
      }
      return response.json();
    });
}

window.loadStory = loadStory;
