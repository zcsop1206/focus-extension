chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.executeScript({
      target: { allFrames: true },
      files: ["content.js"]
    });
  });
  