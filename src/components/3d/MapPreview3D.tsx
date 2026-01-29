import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, 
  Html, 
  Line,
  Sphere,
  OrbitControls
} from '@react-three/drei';
import * as THREE from 'three';
import Scene3D from './Scene3D';

// 3D Globe with route
const Globe = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={globeRef} position={[0, 0, 0]}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshPhysicalMaterial
        color="#1a5f7a"
        metalness={0.2}
        roughness={0.6}
        clearcoat={0.3}
        clearcoatRoughness={0.2}
      />
      {/* Landmass hints */}
      <mesh>
        <sphereGeometry args={[3.02, 32, 32]} />
        <meshBasicMaterial 
          color="#2dd4bf" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
    </mesh>
  );
};

// Animated route on globe
const AnimatedRoute = () => {
  const lineRef = useRef<THREE.Line>(null);
  const vehicleRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);
  
  // Create a curved route
  const routePoints = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.5, 1, 1.5),
      new THREE.Vector3(-1, 2.5, 1),
      new THREE.Vector3(1, 2.8, 0.5),
      new THREE.Vector3(2.5, 1.5, -1),
    ]);
    return curve.getPoints(50);
  }, []);
  
  const routeCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(routePoints);
  }, [routePoints]);
  
  useFrame((state, delta) => {
    if (vehicleRef.current) {
      progressRef.current += delta * 0.1;
      if (progressRef.current > 1) progressRef.current = 0;
      
      const point = routeCurve.getPoint(progressRef.current);
      vehicleRef.current.position.copy(point);
      
      const tangent = routeCurve.getTangent(progressRef.current);
      vehicleRef.current.lookAt(point.clone().add(tangent));
    }
  });

  return (
    <>
      {/* Route line */}
      <Line
        points={routePoints}
        color="#f97316"
        lineWidth={3}
        dashed={false}
      />
      
      {/* Start point */}
      <Sphere args={[0.1, 16, 16]} position={routePoints[0]}>
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </Sphere>
      
      {/* End point */}
      <Sphere args={[0.1, 16, 16]} position={routePoints[routePoints.length - 1]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </Sphere>
      
      {/* Moving vehicle */}
      <mesh ref={vehicleRef}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial 
          color="#f97316" 
          emissive="#f97316" 
          emissiveIntensity={0.5}
        />
      </mesh>
    </>
  );
};

// Route info overlay
const RouteInfo = () => {
  return (
    <Html
      position={[4, 2, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/50 w-64">
        <h4 className="font-semibold text-foreground mb-3">Live Route Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Distance</span>
            <span className="text-foreground font-medium">1,240 km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="text-foreground font-medium">14h 30m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Traffic</span>
            <span className="text-travel-forest font-medium">Light</span>
          </div>
        </div>
      </div>
    </Html>
  );
};

// Map Preview Scene
const MapPreviewContent = () => {
  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#60a5fa" />
      
      <Globe />
      <AnimatedRoute />
      <RouteInfo />
    </>
  );
};

const MapPreview3D = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-card py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              🗺️ Interactive Maps
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Visualize Your Journey in{" "}
              <span className="text-accent">Real-Time</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Our 3D map system brings your travel plans to life. Watch animated vehicles 
              traverse routes between destinations, hotels, and tourist spots with 
              real-time traffic updates.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                <div className="text-2xl font-bold text-accent mb-1">Real-time</div>
                <div className="text-sm text-muted-foreground">Traffic Updates</div>
              </div>
            </div>
          </div>
          
          {/* 3D Globe */}
          <div className="h-[500px] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-background to-muted/20 border border-border/30">
            <Scene3D 
              cameraPosition={[0, 0, 8]}
              enableEnvironment={false}
            >
              <MapPreviewContent />
            </Scene3D>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPreview3D;
