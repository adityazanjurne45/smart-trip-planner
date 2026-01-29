import { useState, useEffect, Suspense } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

// Lazy load 3D components for performance
import Hero3D from "@/components/3d/Hero3D";
import FeaturesSection3D from "@/components/3d/FeaturesSection3D";
import MapPreview3D from "@/components/3d/MapPreview3D";
import TrustSignal3D from "@/components/3d/TrustSignal3D";

// Fallback loading component
const Loading3D = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Loading immersive experience...</p>
    </div>
  </div>
);

// Device capability check
const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    supports3D: true,
    isLowEnd: false,
    isMobile: false
  });
  
  useEffect(() => {
    const checkCapabilities = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const supports3D = !!gl;
      
      const isMobile = window.innerWidth < 768;
      const isLowEnd = navigator.hardwareConcurrency <= 4;
      
      setCapabilities({ supports3D, isLowEnd, isMobile });
    };
    
    checkCapabilities();
    window.addEventListener('resize', checkCapabilities);
    return () => window.removeEventListener('resize', checkCapabilities);
  }, []);
  
  return capabilities;
};

const Index = () => {
  const { supports3D, isLowEnd, isMobile } = useDeviceCapabilities();
  const [is3DReady, setIs3DReady] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure smooth initial load
    const timer = setTimeout(() => setIs3DReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show fallback for unsupported devices
  if (!supports3D) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <div className="h-screen flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                WebGL Not Supported
              </h1>
              <p className="text-muted-foreground mb-6">
                Please use a modern browser to experience Travello's immersive features.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <Suspense fallback={<Loading3D />}>
          {is3DReady && (
            <>
              <Hero3D />
              <div id="features">
                <FeaturesSection3D />
              </div>
              <MapPreview3D />
              <TrustSignal3D />
            </>
          )}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
