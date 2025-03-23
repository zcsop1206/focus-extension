// Add a simple calibration process
function startCalibration() {
    const calibrationDiv = document.createElement('div');
    calibrationDiv.id = 'calibration-container';
    calibrationDiv.style.position = 'fixed';
    calibrationDiv.style.top = '0';
    calibrationDiv.style.left = '0';
    calibrationDiv.style.width = '100vw';
    calibrationDiv.style.height = '100vh';
    calibrationDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    calibrationDiv.style.zIndex = '10000';
    calibrationDiv.style.display = 'flex';
    calibrationDiv.style.justifyContent = 'center';
    calibrationDiv.style.alignItems = 'center';
  
    const calibrationButton = document.createElement('button');
    calibrationButton.textContent = 'Click to Calibrate';
    calibrationButton.style.padding = '20px';
    calibrationButton.style.fontSize = '20px';
    calibrationButton.style.cursor = 'pointer';
  
    calibrationButton.addEventListener('click', () => {
      calibrationDiv.remove();
      window.webgazer.begin();
      console.log("Calibration started. Follow the dots on the screen.");
    });
  
    calibrationDiv.appendChild(calibrationButton);
    document.body.appendChild(calibrationDiv);
  }
  
  // Start calibration when the script is loaded
  startCalibration();