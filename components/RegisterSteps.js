// app/components/RegisterSteps.js
"use client"; // Indicate that this is a client component

import React from "react";
import { Grid } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import Image from "next/image"; // Importing the Image component
import filterMockup from "../assets/images/mockup.png"; // Adjust the import path as needed
import { Login, Profile, Setting } from "iconsax-react"; // Importing necessary icons

import "./style.scss"; // Adjust the import path based on your styles

const RegisterSteps = () => {
  return (
    <div className="register-steps" id="register">
      <Grid container spacing={3}>
        <Grid
          item
          md={5}
          sm={12}
          className="register-steps--img"
          sx={{ flex: "1" }}
        >
          <div
            className="register-steps--img"
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex", // Ensure flex is set for centering
            }}
          >
            <Image
              src={filterMockup}
              alt="Filter Mockup"
              layout="responsive" // Use layout as needed
              width={500} // Specify width
              height={300} // Specify height
              style={{ objectFit: "cover", width: "auto" }} // Additional styling to control how the image fits
            />
          </div>
        </Grid>
        <Grid item md={7} sm={12} className="register-steps--content">
          <h3 className="timeline-heading">
            How to Register and Use
            <span className="title-main">
              {" "}
              <br /> VerifyNow?
            </span>
          </h3>
          <Timeline position="alternate" className="timeline">
            <TimelineItem>
              <TimelineSeparator className="timeline-seperator">
                <TimelineConnector />
                <TimelineDot className="timeline-bg">
                  <Login />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <h3 className="timeline-title">Create an Account</h3>
                <p className="timeline-content">
                  Sign up with your email and set a secure password. You’ll
                  receive a verification link to confirm your account.
                </p>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot className="timeline-bg">
                  <Profile />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <h3 className="timeline-title">
                  Upload Your Identity Document
                </h3>
                <p className="timeline-content">
                  Choose a valid citizenship document and upload a clear image.
                </p>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot className="timeline-bg">
                  <Setting />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <h3 className="timeline-title">Real-Time Verification</h3>
                <p className="timeline-content">
                  Complete the process by allowing facial recognition.This
                  ensures an extra layer of security and confirms your identity.
                </p>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Grid>
      </Grid>
    </div>
  );
};

export default RegisterSteps;
