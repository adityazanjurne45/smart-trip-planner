import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode, useEffect, useState } from 'react';
import { 
  Environment, 
  PerspectiveCamera,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload
} from '@react-three/drei';

interface Scene3DProps {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  enableEnvironment?: boolean;
}

const Scene3D = ({ 
  children, 
  className = "",
  cameraPosition = [0, 2, 10],
  enableEnvironment = true
}: Scene3DProps) => {
  const [dpr, setDpr] = useState(1.5);
  
  useEffect(() => {
    // Adaptive quality based on device
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    
    if (isMobile || isLowEnd) {
      setDpr(1);
    } else {
      setDpr(Math.min(window.devicePixelRatio, 2));
    }
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={dpr}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        shadows="soft"
      >
        <Suspense fallback={null}>
          <PerspectiveCamera 
            makeDefault 
            position={cameraPosition} 
            fov={50}
          />
          
          {/* Adaptive performance */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          
          {/* Lighting setup for photorealistic look */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.3}
            color="#ffeedd"
          />
          
          {/* Environment for reflections */}
          {enableEnvironment && (
            <Environment preset="sunset" background={false} />
          )}
          
          {children}
          
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
