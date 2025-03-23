// Initialize WebGazer
window.webgazer.setGazeListener((data, timestamp) => {
    if (data) {
      window.dispatchEvent(new CustomEvent('webgazer-data', { detail: data }));
    }
  }).begin();
  
  console.log("WebGazer started in page context.");
  window.webgazer.showVideoPreview(true).showPredictionPoints(true);