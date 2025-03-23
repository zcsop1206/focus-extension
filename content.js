if (!window.webGazerInjected) {
    window.webGazerInjected = true;
  
    // Inject WebGazer.js into the page
    const webGazerScript = document.createElement('script');
    webGazerScript.src = chrome.runtime.getURL("libs/webgazer.js");
    webGazerScript.onload = () => {
      console.log("WebGazer.js loaded successfully.");
  
      // Inject the initialization script
      const initScript = document.createElement('script');
      initScript.src = chrome.runtime.getURL("libs/webgazer-init.js");
      initScript.onload = () => {
        console.log("WebGazer initialization script loaded.");
      };
      document.head.appendChild(initScript);
    };
  
    document.head.appendChild(webGazerScript);
  
    let lastFocusedElement = null;
    let lostFocusTimeout = null;
    let gazeHistory = []; // Store recent gaze points
    const maxHistoryLength = 10; // Number of points to average for stabilization
  
    // Start focus tracking only after calibration is complete
    window.addEventListener('calibration-complete', () => {
      console.log("Calibration complete. Starting focus tracking...");
      window.addEventListener('webgazer-data', (event) => {
        const data = event.detail;
        if (data) {
          handleGaze(data);
        }
      });
    });
  
    function handleGaze(data) {
      const x = data.x;
      const y = data.y;
  
      // Add the current gaze point to the history
      gazeHistory.push({ x, y });
  
      // Remove the oldest point if the history exceeds the maximum length
      if (gazeHistory.length > maxHistoryLength) {
        gazeHistory.shift();
      }
  
      // Calculate the average gaze point
      const avgX = gazeHistory.reduce((sum, point) => sum + point.x, 0) / gazeHistory.length;
      const avgY = gazeHistory.reduce((sum, point) => sum + point.y, 0) / gazeHistory.length;
  
      const element = document.elementFromPoint(avgX, avgY);
  
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
  
      // Avoid reapplying bionic reading to already bolded text
      element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Only process plain text nodes
          const updatedText = node.textContent.replace(
            /\b(?!<b[^>]*>)(\w{2,})(?!<\/b>)/g, // Match words not already inside <b> tags
            "<b style='color: red;'>$1</b>"
          );
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = updatedText;
  
          // Replace the text node with the processed content
          while (tempDiv.firstChild) {
            element.insertBefore(tempDiv.firstChild, node);
          }
          element.removeChild(node);
        }
      });
    }
  
    function resetText(element) {
      console.log("Resetting text for:", element);
  
      // Remove all <b> tags and restore the original text
      element.innerHTML = element.innerHTML.replace(/<b[^>]*>(.*?)<\/b>/g, "$1");
    }
  
    // Listen for messages from popup or background scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "startWebGazer") {
        const startScript = document.createElement('script');
        startScript.src = chrome.runtime.getURL("libs/webgazer-init.js");
        document.head.appendChild(startScript);
      } else if (message.action === "stopWebGazer") {
        const stopScript = document.createElement('script');
        stopScript.textContent = `window.webgazer.end(); console.log("WebGazer stopped.");`;
        document.head.appendChild(stopScript);
      }
    });
  }