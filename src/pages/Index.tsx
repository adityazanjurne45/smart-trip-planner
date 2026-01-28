import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import FeatureCards from "@/components/landing/FeatureCards";
import LiveMapPreview from "@/components/landing/LiveMapPreview";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustSignal from "@/components/landing/TrustSignal";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <div id="features">
          <FeatureCards />
        </div>
        <LiveMapPreview />
        <HowItWorks />
        <TrustSignal />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
