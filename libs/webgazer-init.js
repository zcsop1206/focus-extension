// Initialize WebGazer
window.webgazer.setGazeListener((data, timestamp) => {
    if (data) {
      window.dispatchEvent(new CustomEvent('webgazer-data', { detail: data }));
    }
  }).begin()
    .then(() => {
      console.log("WebGazer started in page context.");
      window.webgazer.showVideoPreview(true).showPredictionPoints(true); // Enable prediction points
      startCalibration(); // Start calibration process
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
  
  // Calibration process
  function startCalibration() {
    const calibrationPoints = [
      { x: "10%", y: "10%" },
      { x: "50%", y: "10%" },
      { x: "90%", y: "10%" },
      { x: "10%", y: "50%" },
      { x: "50%", y: "50%" },
      { x: "90%", y: "50%" },
      { x: "10%", y: "90%" },
      { x: "50%", y: "90%" },
      { x: "90%", y: "90%" },
    ];
  
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
  
      calibrationPoint.addEventListener("click", () => {
        console.log(`Calibration point clicked at (${point.x}, ${point.y})`);
        window.webgazer.recordScreenPosition(
          parseInt(point.x, 10),
          parseInt(point.y, 10)
        );
        calibrationPoint.style.backgroundColor = "green";
        setTimeout(() => calibrationPoint.remove(), 500);
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
      }
    });
  
    observer.observe(calibrationContainer, { childList: true });
  }