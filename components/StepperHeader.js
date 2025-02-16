import { Container, Typography } from "@mui/material";
import React from "react";

const StepperHeader = ({ title, subTitle }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
      >
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}
      >
        {subTitle}
      </Typography>
    </Container>
  );
};

export default StepperHeader;
