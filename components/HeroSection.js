import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./style.scss"; // Import your stylesheet
import bannerImg from "../assets/images/bannerimg.png"; // Adjust the import path as needed
import Image from "next/image";
import Link from "next/link";
const HeroSection = () => {
  return (
    <div className="banner">
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        spacing={2}
      >
        {/* Text Section */}
        <Grid item xs={12} className="text-section">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" className="banner-title">
              Revolutionize Your Document Verification Process
            </Typography>
            <Typography variant="h5" className="banner-subtitle">
              Join VerifyNow and unlock the power of quick and secure citizen
              data management! Our streamlined process allows you to
              effortlessly extract and manage citizen information in minutes—no
              more manual data entry or complicated procedures.
            </Typography>
            <Box sx={{ marginTop: 3, display: "flex", gap: "10px" }}>
              <Link href="/signin" passHref>
                <Button
                  variant="contained"
                  color="primary"
                  className="btn-primary"
                >
                  Get Started
                </Button>
              </Link>

              <Button
                variant="outlined"
                color="primary"
                href="#"
                className="btn-secondary"
              >
                View Demo
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} className="image-section">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%" // Optional: Adjusts height to center vertically
          >
            <Image
              src={bannerImg} // Example image URL
              alt="facial recognition image"
              className="banner-image"
              width={700} // Set an appropriate width
              height={700}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default HeroSection;
