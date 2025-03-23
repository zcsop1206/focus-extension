// Load face-api.js
const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.min.js";
document.head.appendChild(script);

script.onload = async function () {
  await faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/");
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/");
  
  // Start webcam
  const video = document.createElement("video");
  document.body.appendChild(video);
  video.style.position = "absolute";
  video.style.top = "-1000px"; // Hide video feed
  navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => video.srcObject = stream);

  video.onloadedmetadata = () => {
    video.play();
    trackFocus();
  };

  async function trackFocus() {
    while (true) {
      const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
      if (detections) {
        const { x, y } = detections.detection.box;
        if (x < 50 || x > 300 || y < 50 || y > 300) {
          applyBionicReading();
          setTimeout(resetText, 2000); // Revert after 2s
        }
      }
      await new Promise(r => setTimeout(r, 1000)); // Check every second
    }
  }
};

function applyBionicReading() {
  document.querySelectorAll("p, span, div").forEach(el => {
    el.innerHTML = el.innerHTML.replace(/\b(\w{2,})/g, "<b>$1</b>");
  });
}

function resetText() {
  document.querySelectorAll("b").forEach(el => {
    el.outerHTML = el.innerHTML;
  });
}
