"use client";
import StepperHeader from "@/components/StepperHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const DocumentStorage = () => {
  const [cookies, setCookies] = useCookies([
    "extractedInfo",
    "croppedFace",
    "uploadedFiles",
  ]);
  const [finalInfo, setFinalInfo] = useState(cookies.extractedInfo || {});
  const [croppedFace, setCroppedFace] = useState(cookies.croppedFace || "");
  const [uploadedFiles, setUploadedFiles] = useState(
    cookies.uploadedFiles || []
  );

  useEffect(() => {
    // Whenever the state changes, update the cookies
    setCookies("extractedInfo", finalInfo);
    setCookies("croppedFace", croppedFace);
    setCookies("uploadedFiles", uploadedFiles);
  }, [finalInfo, croppedFace, uploadedFiles, setCookies]);

  // Check if there's no data
  if (Object.keys(finalInfo).length === 0) {
    return <Typography>No data available to display</Typography>;
  }

  return (
    <div>
      <StepperHeader
        title="Secure Storage"
        subTitle="If everything looks correct, proceed to save them securely."
      />

      <TableContainer sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Entries</strong>
              </TableCell>
              <TableCell>
                <strong>Value</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(finalInfo).map(([key, value]) => {
              // Handle nested objects (like dob, birthPlace, permanentAddress)
              if (typeof value === "object" && value !== null) {
                return Object.entries(value).map(([nestedKey, nestedValue]) => (
                  <TableRow key={`${key}-${nestedKey}`}>
                    <TableCell>{`${key} - ${nestedKey}`}</TableCell>
                    <TableCell>{nestedValue || "N/A"}</TableCell>
                  </TableRow>
                ));
              }
              return (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value || "N/A"}</TableCell>
                </TableRow>
              );
            })}
            {/* Displaying cropped face image */}
            {croppedFace && (
              <TableRow>
                <TableCell>Profile Image</TableCell>
                <TableCell>
                  <Image
                    width={200}
                    height={200}
                    src={croppedFace}
                    alt="Cropped Face"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </TableCell>
              </TableRow>
            )}
            {/* Displaying uploaded files */}
            {uploadedFiles.length > 0 &&
              uploadedFiles.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index === 0 ? "Citizenship Front" : "Citizenship Back"}
                  </TableCell>
                  <TableCell>
                    <Image
                      width={200}
                      height={200}
                      src={file}
                      alt={`Uploaded File ${index + 1}`}
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DocumentStorage;
