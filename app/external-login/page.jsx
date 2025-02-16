"use client";

import {
  Alert,
  Button,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LogoImg from "../../assets/images/logo/logo-secondary.png";

export default function ExternalLogin() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [signInFields, setSignInFields] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();

    if (!signInFields.email || !signInFields.password) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "error",
      });

      return;
    }

    try {
      const { data } = await axios.post("/api/external-login", {
        email: signInFields.email,
        password: signInFields.password,
      });

      window.location.href = `http://localhost:5173?accessToken=${data.accessToken}`;
    } catch (err) {}
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

              {/* If user is already logged in, show 'Go to Dashboard' button */}

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
}
