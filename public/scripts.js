const run = async () => {
  // Load face detection models
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  ]);

  // Access webcam streamM
  const videoFeedEl = document.getElementById("video-feed");
  const canvas = document.getElementById("canvas");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    videoFeedEl.srcObject = stream;
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("Error accessing webcam. Please check permissions.");
  }

  // Ensure canvas matches the video dimensions
  videoFeedEl.addEventListener("loadedmetadata", () => {
    canvas.width = videoFeedEl.videoWidth;
    canvas.height = videoFeedEl.videoHeight;
  });

  let faceMatcher = null;

  // Handle image upload for face comparison
  document
    .getElementById("imageUpload")
    .addEventListener("change", async (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const refImage = new Image();
        refImage.src = e.target.result;

        refImage.onload = async () => {
          const refFaceAiData = await faceapi
            .detectSingleFace(refImage)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (refFaceAiData) {
            faceMatcher = new faceapi.FaceMatcher(refFaceAiData);
            alert("Face from image has been detected and set for comparison.");
          } else {
            alert("No face detected in the image.");
          }
        };
      };
      reader.readAsDataURL(file);
    });

  // Perform real-time face detection and comparison on the video feed
  setInterval(async () => {
    if (!faceMatcher) return;

    // Detect faces from the video feed
    const faceAIData = await faceapi
      .detectAllFaces(videoFeedEl)
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Compare each detected face with the uploaded reference image
    const matchStatusEl = document.getElementById("match-status");
    let matched = false;

    faceAIData.forEach((face) => {
      const { descriptor } = face;
      const bestMatch = faceMatcher.findBestMatch(descriptor);

      // Set the label to "Person Matched" if a match is found, otherwise "Unknown"
      if (bestMatch.label === "unknown") {
        matchStatusEl.textContent = "Unknown";
      } else {
        matchStatusEl.textContent = "Person Matched";
        matched = true;
      }
    });

    // If no faces are detected, reset the message
    if (!matched && faceAIData.length === 0) {
      matchStatusEl.textContent = "No face detected";
    }
  }, 200);
};

run();
