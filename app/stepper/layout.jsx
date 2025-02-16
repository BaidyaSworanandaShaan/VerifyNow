"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import UploadDocument from "./upload-document/page";
import FacialRecognition from "./facial-recognition/page";
import DocumentVerification from "./document-verification/page";
import DocumentStorage from "./document-storage/page";
import Success from "./sucess/page";
import "./stepper.scss";
import { useCookies } from "react-cookie";
import axios from "axios";

// Step definitions
const steps = [
  {
    label: "Upload Document",
    path: "/stepper/upload-document",
    component: <UploadDocument />,
  },
  {
    label: "Facial Recognition",
    path: "/stepper/facial-recognition",
    component: <FacialRecognition />,
  },
  {
    label: "Document Verification",
    path: "/stepper/document-verification",
    component: <DocumentVerification />,
  },
  {
    label: "Secure Storage",
    path: "/stepper/document-storage",
    component: <DocumentStorage />,
  },
];

export default function HorizontalLinearStepper() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies([
    "extractedInfo",
    "croppedFace",
    "uploadedFiles",
  ]);
  const [activeStep, setActiveStep] = React.useState(0);

  const extractedInfo = cookies.extractedInfo || {};
  const croppedFace = cookies.croppedFace || {};
  const uploadedFiles = Array.isArray(cookies.uploadedFiles)
    ? cookies.uploadedFiles
    : [];

  // Sync step with URL
  React.useEffect(() => {
    const currentPath = window.location.pathname;
    const stepIndex = steps.findIndex((step) => step.path === currentPath);
    if (stepIndex !== -1) {
      setActiveStep(stepIndex);
    }
  }, []);

  // Function to save extracted data
  const saveExtractedData = async () => {
    console.log("Extracted Info:", extractedInfo);

    const {
      citizenshipNumber,
      fullName,
      sex,
      dob,
      birthPlace,
      permanentAddress,
      wardNumber,
    } = extractedInfo;

    const frontImg = uploadedFiles[0] || null;
    const backImg = uploadedFiles[1] || null;
    const userImg = croppedFace || null;

    const updatedData = {
      certificateNumber: citizenshipNumber,
      fullName,
      gender: sex,
      dob: dob ? `${dob.year}-${dob.month}-${dob.day}` : null,
      birthplace: birthPlace?.district || null,
      permanentAddress: permanentAddress?.district || null,
      wardNumber,
      frontImg,
      backImg,
      userImg,
    };

    console.log("Saving data:", updatedData);

    try {
      const response = await axios.post("/api/saveCitizenship", updatedData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Data saved successfully:", response.data);

      // Remove cookies after successful submission
      removeCookie("extractedInfo", {
        path: "/",
        domain: window.location.hostname,
      });
      removeCookie("croppedFace", {
        path: "/",
        domain: window.location.hostname,
      });
      removeCookie("uploadedFiles", {
        path: "/",
        domain: window.location.hostname,
      });

      // Navigate to success page
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Next step handler
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      router.push(steps[nextStep].path);
    } else {
      saveExtractedData();
    }
  };

  // Back step handler
  const handleBack = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      router.push(steps[prevStep].path);
    }
  };

  // Reset stepper
  const handleReset = () => {
    setActiveStep(0);
    router.push(steps[0].path);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: "100%", margin: "100px 0" }}>
        <Stepper activeStep={activeStep} className="stepper-header">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ mt: 2, mb: 1 }}>{steps[activeStep].component}</Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                pt: 2,
                justifyContent: "center",
              }}
            >
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
}
