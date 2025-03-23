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
      document.head.appendChild(initScript);
    };
  
    document.head.appendChild(webGazerScript);
  
    let lastFocusedElement = null;
    let lostFocusTimeout = null;
  
    // Start focus tracking only after calibration is complete
    window.addEventListener('calibration-complete', () => {
      console.log("Starting focus tracking after calibration...");
      window.addEventListener('webgazer-data', (event) => {
        const data = event.detail;
        handleGaze(data);
      });
    });
  
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
  
      // Avoid reapplying bionic reading to already bolded text
      element.innerHTML = element.innerHTML.replace(
        /\b(?!<b[^>]*>)(\w{2,})(?!<\/b>)/g, // Match words not already inside <b> tags
        "<b style='color: red;'>$1</b>"
      );
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