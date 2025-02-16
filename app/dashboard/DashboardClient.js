"use client";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useCookies } from "react-cookie";

const DashboardClient = ({ session, initialData }) => {
  const [citizenshipData, setCitizenshipData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [cookies, setCookie, removeCookie] = useCookies([
    "extractedInfo",
    "croppedFace",
    "uploadedFiles",
  ]);

  async function getCitizenship(userId) {
    const response = await axios.get(`/api/user/${userId}`);
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete("/api/deleteCitizenship");
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: "success",
      });
      removeCookie("extractedInfo", { path: "/" });
      removeCookie("croppedFace", { path: "/" });
      removeCookie("uploadedFiles", { path: "/" });
      setTimeout(() => window.location.reload(), 2000); // Reload after 2 sec
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to delete",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Container sx={{ marginTop: "150px" }}>
        <Typography variant="h3" gutterBottom>
          Welcome to your Dashboard, {session?.user?.name || "User"}! 🎉
        </Typography>

        {!citizenshipData ? (
          <Typography
            variant="h6"
            paragraph
            sx={{ lineHeight: "1.7", marginBottom: "20px", textAlign: "" }}
          >
            To enhance your security and streamline your verification process,
            we require you to upload your ID document for facial verification.
            This helps ensure that your identity is securely validated while
            allowing for faster and more convenient future verifications. Your
            document will be safely stored and can be used whenever needed,
            eliminating the hassle of re-uploading it each time. Rest assured,
            your data is protected and used only for verification purposes.
            <br /> <br /> Simply upload your ID, follow the quick verification
            steps, and you’re all set. <strong>Let’s get started! </strong>
          </Typography>
        ) : (
          <div>
            <Typography variant="h6" paragraph>
              Your verification data is successfully processed:
            </Typography>
            <Table sx={{ marginTop: "20px" }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Field</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Value</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Certificate Number</TableCell>
                  <TableCell>{citizenshipData.certificateNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>{citizenshipData.fullName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gender</TableCell>
                  <TableCell>{citizenshipData.gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>{citizenshipData.dob}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Birthplace</TableCell>
                  <TableCell>{citizenshipData.birthplace}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Permanent Address</TableCell>
                  <TableCell>{citizenshipData.permanentAddress}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ward Number</TableCell>
                  <TableCell>{citizenshipData.wardNumber}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {citizenshipData.image && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Typography variant="h6">Citizenship Image</Typography>
                <Image
                  width={200}
                  height={200}
                  src={citizenshipData.image}
                  alt="Citizenship Document"
                />
              </div>
            )}

            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenDialog(true)}
              disabled={loading}
              sx={{ marginTop: "20px" }}
            >
              {loading ? "Deleting..." : "🗑️ Delete Citizenship"}
            </Button>
          </div>
        )}

        {!citizenshipData && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/stepper"
            className="btn-primary"
          >
            ✅ Proceed to Verification
          </Button>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your citizenship record? This
              action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              {loading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default DashboardClient;
