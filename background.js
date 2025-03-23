chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
      // Check if the URL is valid and not restricted
      if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:")) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"]
          });
        } catch (error) {
          console.error("Script execution failed:", error);
        }
      } else {
        console.warn("Cannot inject script into restricted URL:", tab.url);
      }
    }
  });