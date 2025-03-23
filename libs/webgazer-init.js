// Initialize WebGazer
window.webgazer.setGazeListener((data, timestamp) => {
    if (data) {
      window.dispatchEvent(new CustomEvent('webgazer-data', { detail: data }));
    }
  }).begin()
    .then(() => {
      console.log("WebGazer started in page context.");
      window.webgazer.showVideoPreview(true).showPredictionPoints(true); // Enable prediction points
    })
    .catch((error) => {
      console.error("Error starting WebGazer:", error);
    });
  
  // Ensure the video feed is visible for debugging
  const video = document.querySelector("video");
  if (video) {
    video.style.position = "fixed";
    video.style.bottom = "10px";
    video.style.right = "10px";
    video.style.width = "200px";
    video.style.zIndex = "1000";
    video.style.border = "2px solid red";
  } else {
    console.warn("WebGazer video feed not found.");
  }