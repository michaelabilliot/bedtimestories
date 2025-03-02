
let currentStory = [];
let currentSceneIndex = 0;
let storyAudioElement = null; // Renamed to avoid conflicts with music player
let volumeTimeout = null;
let preloadedImages = [];
let isTransitioning = false; // Flag to prevent multiple transitions at once
let transitionTimeouts = []; // Array to track active transition timeouts
/**
 * Helper function to clear all transition timeouts
 */
function clearTransitionTimeouts() {
 transitionTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
 transitionTimeouts = [];
}
/**
 * Preloads all scene images for the chosen story.
 */
function preloadStoryImages(storyData, folder) {
 preloadedImages.forEach(img => { img.src = ""; });
 preloadedImages = [];
 storyData.forEach(scene => {
 if (scene.image) {
 const img = new Image();
 img.src = `images/${folder}/${scene.image}`;
 preloadedImages.push(img);
 }
 });
}
/**
 * Unloads preloaded images.
 */
function unloadStoryImages() {
 preloadedImages.forEach(img => { img.src = ""; });
 preloadedImages = [];
}
/**
 * Updates the global background's zoom and blur.
 * Automatically increases zoom slightly as blur increases to avoid white edges.
 */
function updateBackgroundEffects() {
 const zoomSlider = document.getElementById('zoomSlider');
 const blurSlider = document.getElementById('blurSlider');
 const zoomVal = zoomSlider.value;
 const blurVal = blurSlider.value;
 
 const blurZoomCompensation = 1 + (blurVal / 100);
 
 const globalBg = document.getElementById('globalBackground');
 globalBg.style.backgroundSize = (zoomVal * 100 * blurZoomCompensation) + "%";
 globalBg.style.filter = `blur(${blurVal}px)`;
}
/* Attach slider events */
document.getElementById('zoomSlider').addEventListener('input', updateBackgroundEffects);
document.getElementById('blurSlider').addEventListener('input', updateBackgroundEffects);
/* Toggle settings panel */
document.getElementById('settingsIcon').addEventListener('click', () => {
 document.getElementById('settingsPanel').classList.toggle('hidden');
});
/* Close settings panel */
document.getElementById('closeSettings').addEventListener('click', () => {
 document.getElementById('settingsPanel').classList.add('hidden');
});
/* Toggle love note panel */
document.getElementById('loveNoteButton').addEventListener('click', () => {
 document.getElementById('loveNote').classList.toggle('hidden');
});
/* Close love note panel */
document.getElementById('closeLoveNote').addEventListener('click', () => {
 document.getElementById('loveNote').classList.add('hidden');
});
/**
 * Sets up the Audio element.
 */
function setupAudio() {
 if (!storyAudioElement) {
 storyAudioElement = new Audio();
 storyAudioElement.preload = "auto";
 storyAudioElement.addEventListener("timeupdate", updateAudioProgress);
 storyAudioElement.addEventListener("ended", () => {
 setTimeout(() => returnToGallery(), 5000);
 });
 }
 
 const audioPath = `audios/${currentStory.folder}/recording.mp3`;
 console.log(`Loading audio from: ${audioPath}`);
 
 storyAudioElement.src = audioPath;
 storyAudioElement.onerror = function() {
 console.error(`Failed to load audio from ${audioPath}`);
 alert(`Could not load audio for this story. The story will continue without sound.`);
 };
 
 storyAudioElement.load();
}
/**
 * Updates the audio progress bar and auto-advances scenes.
 * Uses the current scene's "end" property.
 */
function updateAudioProgress() {
 const progressBar = document.getElementById("audioProgressBar");
 if (storyAudioElement && storyAudioElement.duration) {
 const percent = (storyAudioElement.currentTime / storyAudioElement.duration) * 100;
 progressBar.style.width = percent + "%";
 updateSceneIndicators();
 }
 
 const sceneEnd = currentStory[currentSceneIndex]?.end;
 if (sceneEnd !== undefined && storyAudioElement.currentTime >= sceneEnd) {
 if (currentSceneIndex < currentStory.length - 1) {
 showScene(currentSceneIndex + 1);
 } else if (storyAudioElement.currentTime >= storyAudioElement.duration) {
 setTimeout(() => returnToGallery(), 5000);
 }
 }
}
/**
 * Creates clickable triangle markers for each scene's "start" time (except scene0).
 */
function updateSceneIndicators() {
 const indicatorsContainer = document.getElementById("sceneIndicators");
 if (!indicatorsContainer) return;
 indicatorsContainer.innerHTML = "";
 if (storyAudioElement && storyAudioElement.duration) {
 currentStory.forEach((scene, idx) => {
 if (idx > 0 && scene.start !== undefined) {
 const posPercent = (scene.start / storyAudioElement.duration) * 100;
 const indicator = document.createElement("div");
 indicator.className = "scene-indicator";
 indicator.innerHTML = `<svg viewBox="0 0 10 10" width="10" height="10"><polygon points="5,0 10,10 0,10"/></svg>`;
 indicator.style.left = posPercent + "%";
 indicator.addEventListener("click", () => {
 showScene(idx);
 storyAudioElement.currentTime = scene.start;
 });
 indicatorsContainer.appendChild(indicator);
 }
 });
 }
}
/**
 * Sets up the audio player controls.
 */
function setupAudioPlayerControls() {
 const playPauseBtn = document.getElementById("playPauseBtn");
 const goStartBtn = document.getElementById("goStart");
 const goEndBtn = document.getElementById("goEnd");
 const volumeToggle = document.getElementById("volumeToggle");
 const volumeSlider = document.getElementById("volumeSlider");
 playPauseBtn.addEventListener("click", () => {
 if (storyAudioElement.paused) {
 if (currentSceneIndex === 0 && currentStory.length > 1) {
 showScene(1);
 if (currentStory[1].start !== undefined) {
 storyAudioElement.currentTime = currentStory[1].start;
 }
 }
 storyAudioElement.play();
 playPauseBtn.innerHTML = `<span class="material-icons">pause</span>`;
 } else {
 storyAudioElement.pause();
 playPauseBtn.innerHTML = `<span class="material-icons">play_arrow</span>`;
 }
 });
 goStartBtn.addEventListener("click", () => {
 const sceneStart = currentStory[currentSceneIndex].start;
 storyAudioElement.currentTime = sceneStart !== undefined ? sceneStart : 0;
 });
 goEndBtn.addEventListener("click", () => {
 const sceneEnd = currentStory[currentSceneIndex].end;
 storyAudioElement.currentTime = sceneEnd !== undefined ? sceneEnd : storyAudioElement.duration;
 });
 volumeToggle.addEventListener("click", () => {
 const volCtrl = document.getElementById("volumeControl");
 volCtrl.classList.toggle("hidden");
 if (!volCtrl.classList.contains("hidden")) {
 if (volumeTimeout) clearTimeout(volumeTimeout);
 volumeTimeout = setTimeout(() => { volCtrl.classList.add("hidden"); }, 3000);
 }
 });
 volumeSlider.addEventListener("input", (e) => {
 storyAudioElement.volume = e.target.value;
 const volCtrl = document.getElementById("volumeControl");
 if (volumeTimeout) clearTimeout(volumeTimeout);
 volumeTimeout = setTimeout(() => { volCtrl.classList.add("hidden"); }, 3000);
 });
}
/**
 * Displays a scene by index.
 */
function showScene(index) {
 if (isTransitioning) return;
 
 if (index < 0 || index >= currentStory.length) return;
 
 isTransitioning = true;
 
 clearTransitionTimeouts();
 
 const safetyTimeout = setTimeout(() => {
 isTransitioning = false;
 const index = transitionTimeouts.indexOf(safetyTimeout);
 if (index > -1) transitionTimeouts.splice(index, 1);
 }, 2000); // 2 seconds max for any transition
 
 transitionTimeouts.push(safetyTimeout);
 
 const prevIndex = currentSceneIndex;
 currentSceneIndex = index;
 
 if (currentStory[index].image) {
 document.getElementById('globalBackground').style.backgroundImage = `url('images/${currentStory.folder}/${currentStory[index].image}')`;
 }
 
 const sceneContainer = document.getElementById('sceneContainer');
 
 const currentFrame = document.querySelector('.content-frame');
 const currentImg = document.querySelector('.scene-img');
 const imgContainer = document.querySelector('.image-container');
 
 if (prevIndex === -1 || !currentFrame) {
 sceneContainer.innerHTML = '';
 
 const newImgContainer = document.createElement('div');
 newImgContainer.className = 'image-container';
 newImgContainer.style.position = 'relative';
 newImgContainer.style.width = '100%';
 newImgContainer.style.marginBottom = '30px';
 sceneContainer.appendChild(newImgContainer);
 
 if (currentStory[index].image) {
 const img = document.createElement('img');
 img.className = 'scene-img';
 img.src = `images/${currentStory.folder}/${currentStory[index].image}`;
 img.alt = `Scene ${index + 1}`;
 newImgContainer.appendChild(img);
 }
 
 const contentFrame = document.createElement('div');
 contentFrame.className = 'content-frame';
 
 if (currentStory[index].title) {
 const title = document.createElement('h1');
 title.textContent = currentStory[index].title;
 contentFrame.appendChild(title);
 }
 
 const content = document.createElement('p');
 content.innerHTML = currentStory[index].content;
 contentFrame.appendChild(content);
 
 if (index === currentStory.length - 1) {
 const endingMessage = document.createElement('p');
 endingMessage.className = 'ending-message';
 endingMessage.innerHTML = 'The End <span class="heart-icon">♥</span>';
 contentFrame.appendChild(endingMessage);
 }
 
 sceneContainer.appendChild(contentFrame);
 
 isTransitioning = false;
 } else {
 
 if (imgContainer && currentStory[index].image) {
 const newImg = document.createElement('img');
 newImg.className = 'scene-img';
 newImg.src = `images/${currentStory.folder}/${currentStory[index].image}`;
 newImg.alt = `Scene ${index + 1}`;
 newImg.style.opacity = '0';
 newImg.style.position = 'absolute';
 newImg.style.top = '0';
 newImg.style.left = '0';
 newImg.style.width = '100%';
 newImg.style.height = '100%';
 newImg.style.objectFit = 'cover';
 newImg.style.borderRadius = '15px';
 newImg.style.zIndex = '4'; // Ensure new image is on top
 
 imgContainer.appendChild(newImg);
 
 const fadeInTimeout = setTimeout(() => {
 newImg.style.opacity = '1';
 if (currentImg) currentImg.style.opacity = '0';
 
 const cleanupTimeout = setTimeout(() => {
 imgContainer.querySelectorAll('.scene-img').forEach(img => {
 if (img !== newImg) img.remove();
 });
 
 newImg.style.position = 'relative';
 newImg.style.zIndex = '3';
 
 const index = transitionTimeouts.indexOf(cleanupTimeout);
 if (index > -1) transitionTimeouts.splice(index, 1);
 }, 300);
 
 transitionTimeouts.push(cleanupTimeout);
 
 const index = transitionTimeouts.indexOf(fadeInTimeout);
 if (index > -1) transitionTimeouts.splice(index, 1);
 }, 30);
 
 transitionTimeouts.push(fadeInTimeout);
 }
 
 currentFrame.style.opacity = '0';
 currentFrame.style.transform = 'translateY(10px)';
 
 const contentTimeout = setTimeout(() => {
 try {
 if (currentFrame && currentFrame.parentNode) {
 currentFrame.remove();
 }
 
 const newContentFrame = document.createElement('div');
 newContentFrame.className = 'content-frame';
 newContentFrame.style.opacity = '0'; // Start invisible
 
 if (currentStory[index].title) {
 const title = document.createElement('h1');
 title.textContent = currentStory[index].title;
 newContentFrame.appendChild(title);
 }
 
 const content = document.createElement('p');
 content.innerHTML = currentStory[index].content;
 newContentFrame.appendChild(content);
 
 if (index === currentStory.length - 1) {
 const endingMessage = document.createElement('p');
 endingMessage.className = 'ending-message';
 endingMessage.innerHTML = 'The End <span class="heart-icon">♥</span>';
 newContentFrame.appendChild(endingMessage);
 }
 
 sceneContainer.appendChild(newContentFrame);
 
 setTimeout(() => {
 newContentFrame.style.opacity = '1';
 newContentFrame.style.transform = 'translateY(0)';
 }, 10);
 } catch (error) {
 console.error("Error during content transition:", error);
 } finally {
 isTransitioning = false;
 
 const index = transitionTimeouts.indexOf(contentTimeout);
 if (index > -1) transitionTimeouts.splice(index, 1);
 }
 }, 150); // Reduced from 200ms to 150ms for faster transition
 
 transitionTimeouts.push(contentTimeout);
 }
 
 const prevButton = document.getElementById('prevButton');
 const nextButton = document.getElementById('nextButton');
 
 if (prevButton && nextButton) {
 prevButton.disabled = (index === 0);
 nextButton.disabled = (index === currentStory.length - 1);
 
 prevButton.style.display = 'flex';
 nextButton.style.display = 'flex';
 
 prevButton.onclick = () => {
 if (currentSceneIndex > 0 && !isTransitioning) {
 showScene(currentSceneIndex - 1);
 }
 };
 
 nextButton.onclick = () => {
 if (currentSceneIndex < currentStory.length - 1 && !isTransitioning) {
 showScene(currentSceneIndex + 1);
 }
 };
 
 const navButtonsContainer = document.querySelector('.nav-buttons');
 const existingGalleryButton = document.getElementById('galleryButton');
 
 if (index === currentStory.length - 1) {
 if (!existingGalleryButton && navButtonsContainer) {
 const galleryButton = document.createElement('button');
 galleryButton.id = 'galleryButton';
 galleryButton.className = 'gallery-button';
 galleryButton.innerHTML = '<span class="material-icons">collections</span>Go to Gallery';
 galleryButton.onclick = returnToGallery;
 
 galleryButton.style.backgroundColor = 'rgb(147, 112, 219, 0.7)';
 galleryButton.style.marginLeft = '10px';
 galleryButton.style.display = 'flex';
 galleryButton.style.alignItems = 'center';
 galleryButton.style.justifyContent = 'center';
 galleryButton.style.gap = '5px';
 galleryButton.style.padding = '8px 15px';
 galleryButton.style.borderRadius = '20px';
 galleryButton.style.border = 'none';
 galleryButton.style.cursor = 'pointer';
 galleryButton.style.fontWeight = 'bold';
 galleryButton.style.transition = 'background-color 0.3s ease';
 
 galleryButton.onmouseover = () => {
 galleryButton.style.backgroundColor = 'rgba(147, 112, 219, 0.9)';
 };
 galleryButton.onmouseout = () => {
 galleryButton.style.backgroundColor = 'rgba(147, 112, 219, 0.7)';
 };
 
 navButtonsContainer.appendChild(galleryButton);
 }
 } else {
 if (existingGalleryButton) {
 existingGalleryButton.remove();
 }
 }
 }
 
 updateBackgroundEffects();
}
/**
 * Returns to the gallery view and unloads preloaded images.
 */
function returnToGallery() {
 if (storyAudioElement) {
 storyAudioElement.pause();
 storyAudioElement.currentTime = 0;
 }
 unloadStoryImages();
 
 const gallery = document.getElementById("gallery");
 const gameContainer = document.getElementById("gameContainer");
 const gameDiv = document.getElementById("game");
 
 gameDiv.innerHTML = '';
 
 document.getElementById('globalBackground').style.backgroundImage = "linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url('images/gallery.jpg')";
 
 const storiesTab = document.getElementById('storiesTab');
 const storiesTabButton = document.querySelector('.tab-button[data-tab="stories"]');
 
 document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
 document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
 
 storiesTab.classList.add('active');
 storiesTabButton.classList.add('active');
 
 gallery.classList.remove("hidden");
 gameContainer.classList.add("hidden");
 
 updateBackgroundEffects();
}
/**
 * Loads story data (JSON), preloads images, and sets up audio.
 */
function loadStoryData(storyData, folder) {
 currentStory = storyData.sort((a, b) => a.order - b.order);
 currentStory.folder = folder;
 currentSceneIndex = -1; // Set to -1 first so the showScene function knows to build the entire scene
 preloadStoryImages(currentStory, folder);
 
 const gallery = document.getElementById("gallery");
 const gameContainer = document.getElementById("gameContainer");
 
 gallery.classList.add("hidden");
 gallery.style.display = "none";
 
 gameContainer.classList.remove("hidden");
 gameContainer.style.display = "flex";
 
 const gameDiv = document.getElementById("game");
 
 gameDiv.innerHTML = '';
 
 const sceneContainer = document.createElement('div');
 sceneContainer.className = 'scene';
 
 const sceneContentContainer = document.createElement('div');
 sceneContentContainer.id = 'sceneContainer';
 sceneContainer.appendChild(sceneContentContainer);
 
 const navButtonsContainer = document.createElement('div');
 navButtonsContainer.className = 'nav-buttons';
 navButtonsContainer.style.display = 'flex';
 navButtonsContainer.style.justifyContent = 'center';
 navButtonsContainer.style.flexWrap = 'wrap';
 navButtonsContainer.style.gap = '10px';
 navButtonsContainer.style.marginTop = '20px';
 
 const prevButton = document.createElement('button');
 prevButton.id = 'prevButton';
 prevButton.innerHTML = '<span class="material-icons">arrow_back</span>Previous';
 prevButton.addEventListener('click', () => {
 if (currentSceneIndex > 0) {
 showScene(currentSceneIndex - 1);
 }
 });
 
 const nextButton = document.createElement('button');
 nextButton.id = 'nextButton';
 nextButton.innerHTML = 'Next<span class="material-icons">arrow_forward</span>';
 nextButton.addEventListener('click', () => {
 if (currentSceneIndex < currentStory.length - 1) {
 showScene(currentSceneIndex + 1);
 }
 });
 
 navButtonsContainer.appendChild(prevButton);
 navButtonsContainer.appendChild(nextButton);
 sceneContainer.appendChild(navButtonsContainer);
 
 const audioPlayer = document.createElement('div');
 audioPlayer.id = 'audioPlayer';
 
 const audioProgress = document.createElement('div');
 audioProgress.id = 'audioProgress';
 
 const audioProgressBar = document.createElement('div');
 audioProgressBar.id = 'audioProgressBar';
 audioProgress.appendChild(audioProgressBar);
 
 const sceneIndicators = document.createElement('div');
 sceneIndicators.id = 'sceneIndicators';
 audioProgress.appendChild(sceneIndicators);
 
 audioPlayer.appendChild(audioProgress);
 
 const audioControls = document.createElement('div');
 audioControls.id = 'audioControls';
 
 audioControls.innerHTML = `
 <button id="goStart"><span class="material-icons">first_page</span></button>
 <button id="playPauseBtn"><span class="material-icons">play_arrow</span></button>
 <button id="goEnd"><span class="material-icons">last_page</span></button>
 <button id="volumeToggle"><span class="material-icons">volume_up</span></button>
 `;
 
 audioPlayer.appendChild(audioControls);
 
 const volumeControl = document.createElement('div');
 volumeControl.id = 'volumeControl';
 volumeControl.className = 'hidden';
 
 const volumeSlider = document.createElement('input');
 volumeSlider.type = 'range';
 volumeSlider.id = 'volumeSlider';
 volumeSlider.min = '0';
 volumeSlider.max = '1';
 volumeSlider.step = '0.01';
 volumeSlider.value = '0.5';
 
 volumeControl.appendChild(volumeSlider);
 audioPlayer.appendChild(volumeControl);
 
 sceneContainer.appendChild(audioPlayer);
 
 gameDiv.appendChild(sceneContainer);
 
 if (currentStory[0].image) {
 document.getElementById('globalBackground').style.backgroundImage = `url('images/${currentStory.folder}/${currentStory[0].image}')`;
 }
 
 showScene(0);
 setupAudio();
 setupAudioPlayerControls();
}
/**
 * Builds the gallery with available stories.
 * If a story has "today: true", it is displayed in a separate "Today's Story" section.
 */
function setupGallery() {
 const availableStories = [
 { title: "Friends Tale", file: "friends-tale", order: 1, today: false, description: "A heartwarming tale of friendship and love" },
 { title: "Little Sleepy Star", file: "sleepy-star", order: 2, today: true, description: "A magical bedtime adventure with a sleepy little star" },
 { title: "Whiskers of Forgiveness", file: "cat", order: 3, today: false, description: "A story about a cat and a heartwarming tale of friendship and love" }
 ];
 
 availableStories.sort((a, b) => a.order - b.order);
 
 document.getElementById('globalBackground').style.backgroundImage = "linear-gradient(to bottom, rgba(255,182,193,0.3), rgba(147,112,219,0.3)), url('images/gallery.jpg')";
 
 const storyCardsContainer = document.getElementById("storyCards");
 storyCardsContainer.innerHTML = "";
 
 const todaysStories = availableStories.filter(story => story.today);
 const otherStories = availableStories.filter(story => !story.today);
 
 if (todaysStories.length > 0) {
 const todaysSection = document.createElement("div");
 todaysSection.className = "todays-story-section";
 todaysSection.innerHTML = "<h2>Tonight's Special</h2>";
 todaysStories.forEach(story => {
 const coverImage = `images/${story.file}/scene0.jpg`;
 
 const card = document.createElement("div");
 card.className = "story-card todays-story";
 card.innerHTML = `
 <img src="${coverImage}" alt="${story.title} Cover">
 <div class="story-title">${story.title}</div>
 `;
 card.addEventListener("click", () => {
 loadStory(story.file)
 .then(data => { loadStoryData(data, story.file); })
 .catch(err => { 
 console.error("Error loading story:", err);
 alert(`Failed to load story: ${err.message}`);
 });
 });
 todaysSection.appendChild(card);
 
 if (story.description) {
 const descriptionEl = document.createElement("p");
 descriptionEl.className = "story-description";
 descriptionEl.textContent = story.description;
 todaysSection.appendChild(descriptionEl);
 }
 });
 storyCardsContainer.appendChild(todaysSection);
 }
 
 if (otherStories.length > 0) {
 const otherSection = document.createElement("div");
 otherSection.className = "other-stories-section";
 otherSection.innerHTML = "<h2>More Sweet Dreams</h2>";
 
 const cardsContainer = document.createElement("div");
 cardsContainer.className = "story-cards-row";
 
 otherStories.forEach(story => {
 const coverImage = `images/${story.file}/cover.jpg`;
 
 const card = document.createElement("div");
 card.className = "story-card";
 card.innerHTML = `
 <img src="${coverImage}" alt="${story.title} Cover">
 <div class="story-title">${story.title}</div>
 `;
 card.addEventListener("click", () => {
 loadStory(story.file)
 .then(data => { loadStoryData(data, story.file); })
 .catch(err => { 
 console.error("Error loading story:", err);
 alert(`Failed to load story: ${err.message}`);
 });
 });
 cardsContainer.appendChild(card);
 });
 
 otherSection.appendChild(cardsContainer);
 storyCardsContainer.appendChild(otherSection);
 }
}
/* Keyboard shortcuts with debounce to prevent rapid firing:
 Space: Toggle play/pause.
 Left/Right Arrow: Previous/Next scene.
*/
let lastKeyTime = 0;
const keyDebounceTime = 300; // Minimum time between key presses in ms
document.addEventListener("keydown", (e) => {
 const now = Date.now();
 
 if (now - lastKeyTime < keyDebounceTime) {
 return;
 }
 
 lastKeyTime = now;
 
 if (e.code === "Space") {
 e.preventDefault();
 const playPauseBtn = document.getElementById("playPauseBtn");
 if (playPauseBtn) playPauseBtn.click();
 } else if (e.code === "ArrowLeft") {
 if (currentSceneIndex > 0 && !isTransitioning) showScene(currentSceneIndex - 1);
 } else if (e.code === "ArrowRight") {
 if (currentSceneIndex < currentStory.length - 1 && !isTransitioning) showScene(currentSceneIndex + 1);
 }
});
document.addEventListener("DOMContentLoaded", () => {
 setupGallery();
 
 const gallery = document.getElementById("gallery");
 const gameContainer = document.getElementById("gameContainer");
 
 gallery.classList.remove("hidden");
 gallery.style.display = "flex";
 
 gameContainer.classList.add("hidden");
 gameContainer.style.display = "none";
 
 updateBackgroundEffects();
 
 document.getElementById('zoomSlider').addEventListener('input', updateBackgroundEffects);
 document.getElementById('blurSlider').addEventListener('input', updateBackgroundEffects);
 
 document.getElementById('settingsIcon').addEventListener('click', () => {
 document.getElementById('settingsPanel').classList.toggle('hidden');
 });
 
 document.getElementById('closeSettings').addEventListener('click', () => {
 document.getElementById('settingsPanel').classList.add('hidden');
 });
 
 document.getElementById('loveNoteButton').addEventListener('click', () => {
 document.getElementById('loveNote').classList.toggle('hidden');
 });
 
 document.getElementById('closeLoveNote').addEventListener('click', () => {
 document.getElementById('loveNote').classList.add('hidden');
 });
 
 document.querySelector('.tab-button[data-tab="stories"]').classList.add('active');
 document.getElementById('storiesTab').classList.add('active');
 
 setupKeyboardNavigation();
});
/**
 * Loads a story file from the server
 * @param {string} storyFolder - The folder name containing the story
 * @returns {Promise} - Promise that resolves with the story data
 */
async function loadStory(storyFolder) {
 try {
 const response = await fetch(`stories/${storyFolder}.json`);
 if (!response.ok) {
 throw new Error(`Failed to load story: ${storyFolder} (HTTP ${response.status})`);
 }
 return await response.json();
 } catch (error) {
 console.error(`Error loading story ${storyFolder}:`, error);
 throw error;
 }
}
/**
 * Sets up keyboard navigation for stories
 */
function setupKeyboardNavigation() {
 document.addEventListener('keydown', function(event) {
 if (!document.getElementById("gameContainer").classList.contains("hidden") && !isTransitioning) {
 if (event.key === 'ArrowLeft' && currentSceneIndex > 0) {
 event.preventDefault();
 showScene(currentSceneIndex - 1);
 } else if (event.key === 'ArrowRight' && currentSceneIndex < currentStory.length - 1) {
 event.preventDefault();
 showScene(currentSceneIndex + 1);
 } else if (event.key === 'Escape') {
 event.preventDefault();
 returnToGallery();
 } else if (event.code === "Space") {
 e.preventDefault();
 const playPauseBtn = document.getElementById("playPauseBtn");
 if (playPauseBtn) playPauseBtn.click();
 }
 }
 }, { passive: false }); // Use passive: false to allow preventDefault
}
