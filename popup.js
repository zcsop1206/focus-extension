document.getElementById("enableTracking").addEventListener("change", function () {
    chrome.storage.sync.set({ trackingEnabled: this.checked });
  });
  