"use client";
import React, { useState, useEffect } from "react";
import "./signin.scss";
import {
  Grid,
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react"; // Import NextAuth hooks
import { useRouter } from "next/navigation";
import Link from "next/link";
import Slider from "react-slick";
import LogoImg from "../../assets/images/logo/logo-secondary.png";
import Image from "next/image";
const SignIn = () => {
  const { data: session } = useSession(); // Get authentication status
  const router = useRouter();

  const [signInFields, setSignInFields] = useState({
    email: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (session) {
      router.push("/dashboard"); // Redirect if already logged in
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signInFields.email || !signInFields.password) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "error",
      });
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: signInFields.email,
        password: signInFields.password,
      });

      if (res?.error) {
        setSnackbar({ open: true, message: res.error, severity: "error" });
      } else {
        setSnackbar({
          open: true,
          message: "Signed in successfully!",
          severity: "success",
        });

        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Something went wrong!",
        severity: "error",
      });
    }
  };
  const sliderSettings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="signin">
      <Grid container spacing={2}>
        {/* Form Section */}
        <Grid item xs={6}>
          <Container maxWidth="sm">
            <div className="signin--content">
              <Typography variant="h4" gutterBottom>
                Welcome Back!
              </Typography>
              <Typography
                variant="subtitle1"
                className="sub-title"
                gutterBottom
              >
                {session
                  ? "You are already logged in!"
                  : "Sign in to access your account"}
              </Typography>

              {/* If user is already logged in, show 'Go to Dashboard' button */}
              {session ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <form
                  className="signin--form"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={signInFields.email}
                        onChange={(e) =>
                          setSignInFields({
                            ...signInFields,
                            email: e.target.value,
                          })
                        }
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={signInFields.password}
                        onChange={(e) =>
                          setSignInFields({
                            ...signInFields,
                            password: e.target.value,
                          })
                        }
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        className="btn-primary"
                      >
                        Sign In
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        Don't have an account?{" "}
                        <Link
                          href="/signup"
                          style={{ color: "#1976d2", textDecoration: "none" }}
                        >
                          Sign Up
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </form>
              )}
            </div>
          </Container>
        </Grid>

        {/* Banner Section */}
        {/* Slider Section */}
        <Grid item xs={6} className="signup--banner">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src={LogoImg}
              alt="VERIFYNOW Logo"
              height={40}
              width="auto"
            />
          </div>
          <Slider {...sliderSettings}>
            <div className="slider-item">
              <h2>Why Citizenship Verification Matters?</h2>
              <h3>Ensure Security & Authenticity</h3>
              <p>
                Citizenship verification helps confirm your identity, ensuring
                secure access to services, preventing fraud, and complying with
                legal regulations. Our system verifies your citizenship status
                efficiently and accurately.
              </p>
            </div>
            <div className="slider-item">
              <h2>Seamless OCR-Based Verification</h2>
              <h3>Instant Document Scanning & Processing</h3>
              <p>
                Our advanced OCR technology scans and extracts essential details
                from your citizenship documents, reducing manual errors and
                speeding up the verification process within seconds.
              </p>
            </div>
            <div className="slider-item">
              <h2>Secure Digital Storage</h2>
              <h3>Access Your Documents Anytime</h3>
              <p>
                Store your verified citizenship documents securely in our
                encrypted digital vault. Retrieve them instantly whenever
                needed, eliminating the hassle of carrying physical copies.
              </p>
            </div>
            <div className="slider-item">
              <h2>Cross-Platform Accessibility</h2>
              <h3>Use Your Verified Identity Anywhere</h3>
              <p>
                Once verified, your citizenship credentials can be used across
                multiple platforms, saving time and eliminating the need for
                repeated verification on different services.
              </p>
            </div>
            <div className="slider-item">
              <h2>Privacy & Data Protection</h2>
              <h3>End-to-End Encryption for Your Security</h3>
              <p>
                Your personal data is protected with industry-leading encryption
                standards, ensuring that your information remains confidential,
                secure, and accessible only to authorized entities.
              </p>
            </div>
            <div className="slider-item">
              <h2>24/7 Assistance</h2>
              <h3>Need Help? Our Team is Here for You</h3>
              <p>
                Our dedicated support team is available round the clock to
                assist you with any issues related to citizenship verification,
                document storage, and secure access.
              </p>
            </div>
          </Slider>
        </Grid>
      </Grid>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignIn;
