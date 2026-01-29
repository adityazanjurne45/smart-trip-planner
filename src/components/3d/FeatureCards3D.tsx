import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Brain, Map, Wallet, Hotel, Car, Shield, LucideIcon } from 'lucide-react';

interface FeatureData {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  position: [number, number, number];
}

const features: FeatureData[] = [
  {
    icon: Brain,
    title: "AI Recommendations",
    description: "Smart suggestions based on your preferences and travel history.",
    color: "#14b8a6",
    position: [-4, 0, 0],
  },
  {
    icon: Map,
    title: "Smart Maps",
    description: "Interactive routes with real-time traffic navigation.",
    color: "#f97316",
    position: [0, 0, 0],
  },
  {
    icon: Wallet,
    title: "Budget Optimization",
    description: "Get the most out of your budget with smart tips.",
    color: "#eab308",
    position: [4, 0, 0],
  },
  {
    icon: Hotel,
    title: "Hotel Suggestions",
    description: "Curated stays near attractions with transparent pricing.",
    color: "#22c55e",
    position: [-2, -3, 0],
  },
  {
    icon: Car,
    title: "Vehicle Options",
    description: "Smart transport based on distance and conditions.",
    color: "#ef4444",
    position: [2, -3, 0],
  },
];

// Single 3D Feature Card
const FeatureCard3D = ({ 
  feature, 
  index 
}: { 
  feature: FeatureData; 
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Hover lift effect
      const targetY = hovered ? 0.3 : 0;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        0.1
      );
      
      // Subtle rotation on hover
      const targetRotY = hovered ? 0.1 : 0;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotY,
        0.1
      );
    }
  });

  const Icon = feature.icon;

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.1} 
      floatIntensity={0.3}
      position={feature.position}
    >
      <group>
        <RoundedBox
          ref={meshRef}
          args={[3.2, 2.4, 0.15]}
          radius={0.12}
          smoothness={4}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            roughness={0.1}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.5}
            ior={1.5}
          />
        </RoundedBox>
        
        {/* Card content */}
        <Html
          transform
          occlude={false}
          position={[0, 0, 0.1]}
          style={{
            width: '280px',
            pointerEvents: 'none',
          }}
          center
        >
          <div className="text-center p-4">
            <div 
              className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: `${feature.color}20` }}
            >
              <Icon className="w-7 h-7" style={{ color: feature.color }} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </Html>
      </group>
    </Float>
  );
};

// Features Section 3D
const FeatureCards3D = () => {
  return (
    <>
      {features.map((feature, index) => (
        <FeatureCard3D key={feature.title} feature={feature} index={index} />
      ))}
    </>
  );
};

export default FeatureCards3D;
