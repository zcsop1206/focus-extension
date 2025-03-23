document.getElementById("start").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "startWebGazer" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error starting WebGazer:", chrome.runtime.lastError.message);
      } else {
        console.log("WebGazer started:", response);
      }
    });
  });
});

document.getElementById("stop").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "stopWebGazer" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error stopping WebGazer:", chrome.runtime.lastError.message);
      } else {
        console.log("WebGazer stopped:", response);
      }
    });
  });
});