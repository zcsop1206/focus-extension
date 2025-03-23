// Load WebGazer.js
const webGazerScript = document.createElement('script');
webGazerScript.src = "https://webgazer.cs.brown.edu/webgazer.js";
document.head.appendChild(webGazerScript);

webGazerScript.onload = async function () {
  console.log("WebGazer.js loaded successfully.");

  // Start WebGazer
  await webgazer.setGazeListener((data, timestamp) => {
    if (data) {
      handleGaze(data);
    }
  }).begin();

  console.log("WebGazer started.");
  
  // Make the WebGazer video feed visible for debugging
  webgazer.showVideoPreview(true).showPredictionPoints(true);

  let lastFocusedElement = null;
  let lostFocusTimeout = null;

  function handleGaze(data) {
    const x = data.x; // Gaze X-coordinate
    const y = data.y; // Gaze Y-coordinate

    // Find the element under the gaze point
    const element = document.elementFromPoint(x, y);

    if (element && (element.tagName === "P" || element.tagName === "SPAN" || element.tagName === "DIV")) {
      if (lastFocusedElement !== element) {
        console.log("Focused on new element:", element);
        lastFocusedElement = element;

        // Clear the lost focus timeout if the user is focused
        if (lostFocusTimeout) {
          clearTimeout(lostFocusTimeout);
          lostFocusTimeout = null;
        }
      }
    } else {
      // If the user is not focused on a valid element, start the lost focus timer
      if (!lostFocusTimeout) {
        lostFocusTimeout = setTimeout(() => {
          console.log("User lost focus. Applying bionic reading...");
          if (lastFocusedElement) {
            applyBionicReading(lastFocusedElement);
          }
        }, 2000); // Trigger after 2 seconds of lost focus
      }
    }
  }

  function applyBionicReading(element) {
    console.log("Applying bionic reading to:", element);
    element.innerHTML = element.innerHTML.replace(/\b(\w{2,})/g, "<b style='color: red;'>$1</b>");
  }

  function resetText(element) {
    console.log("Resetting text for:", element);
    element.innerHTML = element.innerHTML.replace(/<b style='color: red;'>(.*?)<\/b>/g, "$1");
  }
};