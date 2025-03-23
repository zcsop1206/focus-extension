// Load face-api.js
const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.min.js";
document.head.appendChild(script);

script.onload = async function () {
  console.log("face-api.js loaded successfully.");

  await faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/");
  console.log("TinyFaceDetector model loaded.");

  await faceapi.nets.faceLandmark68TinyNet.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/");
  console.log("FaceLandmark68TinyNet model loaded.");

  // Start webcam
  const video = document.createElement("video");
  document.body.appendChild(video);
  video.style.position = "fixed";
  video.style.bottom = "10px";
  video.style.right = "10px";
  video.style.width = "200px"; // Make the video feed visible for debugging
  video.style.zIndex = "1000";
  video.style.border = "2px solid red";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    console.log("Webcam started.");
  } catch (error) {
    console.error("Error accessing webcam:", error);
    return;
  }

  video.onloadedmetadata = () => {
    video.play();
    console.log("Video feed started.");
    trackFocus();
  };

  async function trackFocus() {
    console.log("Starting focus tracking...");
    while (true) {
      try {
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
        if (detections) {
          const { x, y } = detections.detection.box;
          console.log("Face detected at:", { x, y });

          if (x < 50 || x > 300 || y < 50 || y > 300) {
            console.log("Face out of focus. Applying bionic reading...");
            applyBionicReading();
            setTimeout(() => {
              console.log("Resetting text...");
              resetText();
            }, 2000); // Revert after 2s
          }
        } else {
          console.log("No face detected.");
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }

      await new Promise(r => setTimeout(r, 1000)); // Check every second
    }
  }
};

function applyBionicReading() {
  console.log("Applying bionic reading...");
  document.querySelectorAll("p, span, div").forEach(el => {
    el.innerHTML = el.innerHTML.replace(/\b(\w{2,})/g, "<b>$1</b>");
  });
}

function resetText() {
  console.log("Resetting text to original...");
  document.querySelectorAll("b").forEach(el => {
    el.outerHTML = el.innerHTML;
  });
}