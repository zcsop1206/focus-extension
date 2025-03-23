// Initialize WebGazer
window.webgazer.setGazeListener((data, timestamp) => {
    if (data) {
      const smoothedData = window.webgazer.getCurrentPrediction(); // Get smoothed gaze data
      if (smoothedData) {
        window.dispatchEvent(new CustomEvent('webgazer-data', { detail: smoothedData }));
      }
    }
  }).begin()
    .then(() => {
      console.log("WebGazer started in page context.");
      window.webgazer.showVideoPreview(true).showPredictionPoints(true); // Enable prediction points
      startCalibration(() => {
        console.log("Calibration complete. Starting focus tracking...");
        window.dispatchEvent(new Event('calibration-complete')); // Notify that calibration is complete
      });
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
  
  // Rigorous Calibration Process
  function startCalibration(onComplete) {
    const calibrationPoints = [];
    const gridSize = 5; // 5x5 grid
    const margin = 5; // Margin in percentage to prevent points from touching the edges
  
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        calibrationPoints.push({
          x: `${margin + (i * (100 - 2 * margin)) / (gridSize - 1)}%`,
          y: `${margin + (j * (100 - 2 * margin)) / (gridSize - 1)}%`,
        });
      }
    }
  
    const calibrationContainer = document.createElement("div");
    calibrationContainer.id = "calibration-container";
    calibrationContainer.style.position = "fixed";
    calibrationContainer.style.top = "0";
    calibrationContainer.style.left = "0";
    calibrationContainer.style.width = "100vw";
    calibrationContainer.style.height = "100vh";
    calibrationContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    calibrationContainer.style.zIndex = "10000";
    calibrationContainer.style.display = "flex";
    calibrationContainer.style.justifyContent = "center";
    calibrationContainer.style.alignItems = "center";
  
    calibrationPoints.forEach((point) => {
      const calibrationPoint = document.createElement("div");
      calibrationPoint.style.position = "absolute";
      calibrationPoint.style.width = "20px";
      calibrationPoint.style.height = "20px";
      calibrationPoint.style.backgroundColor = "red";
      calibrationPoint.style.borderRadius = "50%";
      calibrationPoint.style.cursor = "pointer";
      calibrationPoint.style.left = point.x;
      calibrationPoint.style.top = point.y;
      calibrationPoint.style.transform = "translate(-50%, -50%)";
  
      let clickCount = 0; // Require multiple clicks for each point
      const requiredClicks = 5;
  
      calibrationPoint.addEventListener("click", () => {
        clickCount++;
        console.log(`Calibration point clicked at (${point.x}, ${point.y}) - Click ${clickCount}/${requiredClicks}`);
        window.webgazer.recordScreenPosition(
          parseInt(window.innerWidth * (parseFloat(point.x) / 100), 10),
          parseInt(window.innerHeight * (parseFloat(point.y) / 100), 10)
        );
  
        if (clickCount >= requiredClicks) {
          calibrationPoint.style.backgroundColor = "green";
          setTimeout(() => calibrationPoint.remove(), 500);
        }
      });
  
      calibrationContainer.appendChild(calibrationPoint);
    });
  
    document.body.appendChild(calibrationContainer);
  
    // Remove calibration container after all points are clicked
    const observer = new MutationObserver(() => {
      if (calibrationContainer.childElementCount === 0) {
        calibrationContainer.remove();
        observer.disconnect();
        console.log("Calibration complete.");
        if (typeof onComplete === "function") {
          onComplete(); // Call the callback function after calibration is complete
        }
      }
    });
  
    observer.observe(calibrationContainer, { childList: true });
  }