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
  webgazer.showVideoPreview(true).showPredictionPoints(true);

  let lastFocusedElement = null;
  let lostFocusTimeout = null;

  function handleGaze(data) {
    const x = data.x;
    const y = data.y;
    const element = document.elementFromPoint(x, y);

    if (element && (element.tagName === "P" || element.tagName === "SPAN" || element.tagName === "DIV")) {
      if (lastFocusedElement !== element) {
        console.log("Focused on new element:", element);
        lastFocusedElement = element;

        if (lostFocusTimeout) {
          clearTimeout(lostFocusTimeout);
          lostFocusTimeout = null;
        }
      }
    } else {
      if (!lostFocusTimeout) {
        lostFocusTimeout = setTimeout(() => {
          console.log("User lost focus. Applying bionic reading...");
          if (lastFocusedElement) {
            applyBionicReading(lastFocusedElement);
          }
        }, 2000);
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

// Listen for messages from popup or background scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startWebGazer") {
    webgazer.begin();
    console.log("WebGazer started.");
  } else if (message.action === "stopWebGazer") {
    webgazer.end();
    console.log("WebGazer stopped.");
  }
});