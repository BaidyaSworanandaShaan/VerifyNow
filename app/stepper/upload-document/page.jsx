"use client";

import StepperHeader from "@/components/StepperHeader";
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Tesseract from "tesseract.js";
import * as faceapi from "face-api.js";

const UploadDocument = () => {
  const [files, setFiles] = useState([]); // Store uploaded file base64
  const [cookies, setCookie] = useCookies([
    "uploadedFiles",
    "croppedFace",
    "extractedText",
  ]);
  const [photo, setPhoto] = useState(null); // Detected photo (base64)
  const [textInfo, setTextInfo] = useState(""); // Extracted text from second image
  const [isProcessing, setIsProcessing] = useState(false); // Processing state

  // Load FaceAPI models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Assumes models are stored in the /public/models directory
      await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)]);
      console.log("FaceAPI models loaded successfully.");
    };
    loadModels();
  }, []);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length + files.length > 2) {
      alert("You can only upload up to 2 documents.");
      return;
    }

    const newFiles = await Promise.all(
      selectedFiles.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const updatedFiles = [...files, ...newFiles].slice(0, 2);
    setFiles(updatedFiles);

    // Save files to cookies
    setCookie("uploadedFiles", JSON.stringify(updatedFiles), {
      path: "/",
      maxAge: 3600, // 1 hour
    });

    if (updatedFiles.length === 2) {
      processDocuments(updatedFiles);
    }
  };

  const processDocuments = async (files) => {
    setIsProcessing(true);

    try {
      // Extract photo from the first image (front side)
      const frontBlob = await fetch(files[0]).then((res) => res.blob());
      const frontImage = await faceapi.bufferToImage(frontBlob);

      // Detect face in the full image
      const detections = await faceapi.detectSingleFace(
        frontImage,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections) {
        console.log("Face detected:", detections);
        const { box } = detections; // Get bounding box of the detected face

        // Crop the detected face
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = box.width;
        canvas.height = box.height;
        ctx.drawImage(
          frontImage,
          box.x, // Start X position
          box.y, // Start Y position
          box.width, // Width of the cropped area
          box.height, // Height of the cropped area
          0,
          0,
          box.width,
          box.height
        );

        const croppedFace = canvas.toDataURL(); // Convert the cropped image to base64
        setPhoto(croppedFace); // Set the cropped face as the photo

        // Save cropped face to cookies
        setCookie("croppedFace", croppedFace, {
          path: "/",
          maxAge: 3600, // 1 hour
        });
      } else {
        alert(
          "Image can't be found in the citizenship card. No face detected."
        );
        console.error("Face detection failed.");
        setIsProcessing(false);
        return;
      }

      // Extract text from the second image (back side)
      Tesseract.recognize(files[1], "eng", {
        logger: (m) => console.log(m), // Optional logging
      })
        .then(({ data: { text } }) => {
          console.log("OCR text extracted:", text);
          setTextInfo(text); // Store extracted text

          // Save extracted text to cookies
          setCookie("extractedText", text, {
            path: "/",
            maxAge: 3600, // 1 hour
          });
          setIsProcessing(false); // Stop processing
        })
        .catch((error) => {
          console.error("Error during OCR:", error);
          setIsProcessing(false);
        });
    } catch (error) {
      console.error("Error processing documents:", error);
      setIsProcessing(false);
    }
  };

  const handleClearFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    // Update cookies
    setCookie("uploadedFiles", JSON.stringify(updatedFiles), {
      path: "/",
    });
  };

  return (
    <Container maxWidth="md">
      <StepperHeader
        title="Upload Your Documents"
        subTitle="Please upload exactly 2 valid documents: front and back of the citizenship card."
      />
      <Box sx={{ p: 2 }}>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={files.length >= 2 || isProcessing}
          accept="image/*"
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            className="btn-primary"
            variant="contained"
            color="primary"
            component="span"
            fullWidth
            sx={{ mb: 2 }}
          >
            {files.length === 0
              ? "Choose Documents to Upload"
              : "+ Add More Documents"}
          </Button>
        </label>

        {files.length > 0 && (
          <Box
            mt={2}
            sx={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {files.map((file, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ border: "1px solid #ddd", padding: 1, borderRadius: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {index === 0 ? "Citizenship Front" : "Citizenship Back"}
                </Typography>
                <Button
                  onClick={() => handleClearFile(index)}
                  variant="outlined"
                  color="error"
                  size="small"
                  disabled={isProcessing}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        )}

        {files.length === 2 && !isProcessing && (
          <Typography variant="body1" color="success.main" mt={2}>
            Documents are being processed automatically.
          </Typography>
        )}

        {isProcessing && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <CircularProgress />
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
              Processing your documents. Please wait...
            </Typography>
          </Box>
        )}
      </Box>

      {photo && (
        <Box mt={4} sx={{ textAlign: "center" }}>
          <Typography variant="h6" mb={2}>
            Extracted Photo:
          </Typography>
          <Image
            src={photo}
            alt="Detected Face"
            width={150}
            height={150}
            style={{ borderRadius: "50%" }}
          />
        </Box>
      )}

      {/* {textInfo && (
        <Box mt={4}>
          <Typography variant="h6">Extracted Text:</Typography>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {textInfo}
          </pre>
        </Box>
      )} */}
    </Container>
  );
};

export default UploadDocument;
