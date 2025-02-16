import Features from "@/components/Features";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import RegisterSteps from "@/components/RegisterSteps";
import SignupBanner from "@/components/SignupBanner";
import { Container } from "@mui/material";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <Container maxWidth="lg">
        {/* Explore cutting-edge features section */}
        <Features
          subTitle="Features"
          title="Explore Our Cutting-Edge Features"
        />

        {/* Registration steps */}
        <RegisterSteps />

        {/* Signup banner */}
        <SignupBanner />
      </Container>
    </main>
  );
}
