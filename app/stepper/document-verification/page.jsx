"use client";
import StepperHeader from "@/components/StepperHeader";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {
  TextField,
  Grid,
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";

const DocumentVerification = () => {
  const [cookies, setCookies] = useCookies(["extractedInfo"]);
  const [editableInfo, setEditableInfo] = useState(cookies.extractedInfo || {});

  // Log updated cookies whenever they change
  useEffect(() => {
    console.log("Updated Cookies:", cookies.extractedInfo);
  }, [cookies.extractedInfo]);

  if (!cookies.extractedInfo) {
    return <div>No extracted info found.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditableInfo((prevInfo) => {
      let updatedInfo;

      // Handle the 'dob' field separately since it's a nested object
      if (["year", "month", "day"].includes(name)) {
        updatedInfo = {
          ...prevInfo,
          dob: {
            ...prevInfo.dob,
            [name]: value,
          },
        };
      }
      // Handle nested objects for birthPlace and permanentAddress
      else if (name === "birthPlace" || name === "permanentAddress") {
        updatedInfo = {
          ...prevInfo,
          [name]: {
            ...prevInfo[name],
            district: value,
          },
        };
      } else {
        updatedInfo = {
          ...prevInfo,
          [name]: value,
        };
      }

      console.log("Updated State Before Setting Cookies:", updatedInfo);
      setCookies("extractedInfo", updatedInfo, { path: "/" }); // Ensure cookie updates persist
      return updatedInfo;
    });
  };

  return (
    <div>
      <StepperHeader
        title="Verify Your Citizenship Document"
        subTitle="Double-check the extracted information for accuracy before proceeding with secure storage."
      />
      <Typography className="title">Extracted Information:</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Certificate No"
            variant="outlined"
            fullWidth
            name="citizenshipNumber"
            value={editableInfo.citizenshipNumber || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            name="fullName"
            value={editableInfo.fullName || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              name="sex"
              value={editableInfo.sex || ""}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Year of Birth"
            variant="outlined"
            fullWidth
            name="year"
            value={editableInfo.dob?.year || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Month of Birth"
            variant="outlined"
            fullWidth
            name="month"
            value={editableInfo.dob?.month || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Day of Birth"
            variant="outlined"
            fullWidth
            name="day"
            value={editableInfo.dob?.day || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Birth Place"
            variant="outlined"
            fullWidth
            name="birthPlace"
            value={editableInfo.birthPlace?.district || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Permanent Address"
            variant="outlined"
            fullWidth
            name="permanentAddress"
            value={editableInfo.permanentAddress?.district || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Ward Number"
            variant="outlined"
            fullWidth
            name="wardNumber"
            value={editableInfo.wardNumber || ""}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      {/* <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Final Data Saved:", editableInfo)}
        >
          Save
        </Button>
      </Box> */}
    </div>
  );
};

export default DocumentVerification;
