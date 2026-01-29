import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, 
  Cloud, 
  Sky,
  MeshReflectorMaterial,
  Text3D,
  Center
} from '@react-three/drei';
import * as THREE from 'three';

// Ground plane with reflection
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#1a3a4a"
        metalness={0.5}
        mirror={0.5}
      />
    </mesh>
  );
};

// Floating mountain/landmark shapes
const FloatingLandmark = ({ position, scale = 1, color = "#2dd4bf" }: { 
  position: [number, number, number];
  scale?: number;
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={1}
    >
      <mesh 
        ref={meshRef} 
        position={position} 
        scale={scale}
        castShadow
      >
        <coneGeometry args={[1, 2.5, 4]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </Float>
  );
};

// Road/path element
const Road = () => {
  const roadRef = useRef<THREE.Mesh>(null);
  
  const roadCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-15, -1.9, 5),
      new THREE.Vector3(-5, -1.9, 2),
      new THREE.Vector3(0, -1.9, 0),
      new THREE.Vector3(5, -1.9, -2),
      new THREE.Vector3(15, -1.9, -5),
    ]);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(roadCurve, 64, 0.3, 8, false);
  }, [roadCurve]);

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial 
        color="#374151" 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

// Animated clouds
const AnimatedClouds = () => {
  return (
    <>
      <Cloud
        opacity={0.5}
        speed={0.4}
        bounds={[10, 2, 2]}
        segments={20}
        position={[-10, 8, -10]}
      />
      <Cloud
        opacity={0.3}
        speed={0.3}
        bounds={[8, 1.5, 2]}
        segments={15}
        position={[10, 10, -15]}
      />
      <Cloud
        opacity={0.4}
        speed={0.5}
        bounds={[12, 2, 3]}
        segments={25}
        position={[0, 12, -20]}
      />
    </>
  );
};

// Sun glow effect
const SunGlow = () => {
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1);
    }
  });

  return (
    <mesh ref={glowRef} position={[20, 15, -30]}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial 
        color="#fbbf24" 
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
};

// Main travel world scene
const TravelWorld = () => {
  return (
    <>
      {/* Sky backdrop */}
      <Sky
        distance={450000}
        sunPosition={[20, 15, -30]}
        inclination={0.5}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={0.5}
        turbidity={10}
      />
      
      {/* Sun glow */}
      <SunGlow />
      
      {/* Clouds */}
      <AnimatedClouds />
      
      {/* Ground with reflection */}
      <Ground />
      
      {/* Road */}
      <Road />
      
      {/* Floating landmarks - representing destinations */}
      <FloatingLandmark position={[-8, 2, -5]} scale={1.5} color="#14b8a6" />
      <FloatingLandmark position={[6, 3, -8]} scale={2} color="#0891b2" />
      <FloatingLandmark position={[-3, 1.5, -3]} scale={1} color="#0d9488" />
      <FloatingLandmark position={[10, 2.5, -12]} scale={1.8} color="#06b6d4" />
      <FloatingLandmark position={[-12, 4, -15]} scale={2.5} color="#22d3d1" />
      
      {/* Smaller decorative elements */}
      <Float speed={3} floatIntensity={0.5}>
        <mesh position={[3, 0.5, 2]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.3} />
        </mesh>
      </Float>
      
      <Float speed={2.5} floatIntensity={0.8}>
        <mesh position={[-4, 1, 3]} castShadow>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.2} />
        </mesh>
      </Float>
    </>
  );
};

export default TravelWorld;
