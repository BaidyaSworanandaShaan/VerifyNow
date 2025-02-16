"use client";
import React, { useState, useEffect } from "react";
import "./signup.scss";
import {
  Grid,
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Slider from "react-slick";
import LogoImg from "../../assets/images/logo/logo-secondary.png";
import Image from "next/image";
const Signup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const [signUpFields, setSignUpFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = signUpFields;
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

    if (!name) newErrors.name = "Name is required.";
    else if (name.length < 3)
      newErrors.name = "Name must be at least 3 characters long.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post("/api/user", {
          name,
          email,
          password,
        });

        if (response.status === 201) {
          setSnackbar({
            open: true,
            message: "User registered successfully!",
            severity: "success",
          });
          setTimeout(() => router.push("/signin"), 1000);
        }
      } catch (error) {
        let errorMessage = "An unexpected error occurred. Try again later.";
        if (error.response) {
          errorMessage =
            error.response.data.message || "Signup failed. Please try again.";
        }
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      }
    }
  };

  if (status === "loading") return <p>Loading...</p>;

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
    <div className="signup">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Container maxWidth="sm">
            <div className="signup--content">
              <Typography variant="h4" gutterBottom className="sign-title">
                Join VerifyNow Today
              </Typography>
              <Typography
                variant="subtitle1"
                className="sub-title"
                gutterBottom
              >
                Secure Your Identity and Streamline Your Experience
              </Typography>
              <form
                className="signup--form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      value={signUpFields.name}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          name: e.target.value,
                        })
                      }
                      margin="normal"
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email"
                      type="email"
                      variant="outlined"
                      fullWidth
                      value={signUpFields.email}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          email: e.target.value,
                        })
                      }
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={signUpFields.password}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          password: e.target.value,
                        })
                      }
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={signUpFields.confirmPassword}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          confirmPassword: e.target.value,
                        })
                      }
                      margin="normal"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      className="btn-primary"
                      variant="contained"
                      color="primary"
                      fullWidth
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Already have an account?{" "}
                      <Link
                        href="/signin"
                        style={{ color: "#1976d2", textDecoration: "none" }}
                      >
                        Sign In
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        </Grid>

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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
