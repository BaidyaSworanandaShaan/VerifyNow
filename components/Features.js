import React from "react";
import Grid from "@mui/material/Grid";

import "./style.scss"; // Adjust the import path based on your styles

import { Edit, Car, Money, Calendar } from "iconsax-react"; // Import icons or add new ones as needed

export const features = [
  {
    id: 1,
    title: "Instant  Verification",
    description:
      "Complete identity verification with  OCR and facial recognition.",
    icon: <Edit />,
  },
  {
    id: 2,
    title: "Advanced Security",
    description: "Keep data safe with industry-leading AES encryption",
    icon: <Calendar />, // Replace with an appropriate icon
  },
  {
    id: 3,
    title: "User-Friendly",
    description: "Quickly, let OCR extract details for fast verification.",
    icon: <Car />, // Replace with an appropriate icon
  },
  {
    id: 4,
    title: "Seamless  Integration",
    description:
      "Integrate effortlessly into business operations, enhancing experience.",
    icon: <Money />, // Replace with an appropriate icon
  },

  // Add more features here if needed
];

const Features = ({ title = "", subTitle = "" }) => {
  return (
    <section className="features" id="features">
      <div className="title">
        <span className="sub-title">{subTitle}</span>
        <h1 className="main-title">{title}</h1>
      </div>

      <Grid container spacing={3}>
        {features.map((service) => (
          <Grid item xs={3} key={service.id}>
            <div className="content">
              <div className="icon-circle-bg">{service.icon}</div>
              <div className="desc">
                <h3 className="desc-title">{service.title}</h3>
                <p className="desc-para">{service.description}</p>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default Features;
