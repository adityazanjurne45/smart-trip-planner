import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingCardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  children: React.ReactNode;
  glassEffect?: boolean;
}

// Glass-effect floating card for 3D UI
export const FloatingCard = ({ 
  position, 
  rotation = [0, 0, 0],
  children,
  glassEffect = true
}: FloatingCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      
      // Hover effect
      const targetScale = hovered ? 1.05 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position} rotation={rotation as unknown as THREE.Euler}>
        <RoundedBox
          ref={meshRef}
          args={[4, 2.5, 0.1]}
          radius={0.1}
          smoothness={4}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshPhysicalMaterial
            color={glassEffect ? "#ffffff" : "#1e3a5f"}
            transparent
            opacity={glassEffect ? 0.15 : 0.9}
            roughness={0.1}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={glassEffect ? 0.6 : 0}
            ior={1.5}
          />
        </RoundedBox>
        
        {/* HTML content overlay */}
        <Html
          transform
          occlude
          position={[0, 0, 0.1]}
          style={{
            width: '350px',
            pointerEvents: 'none',
          }}
        >
          {children}
        </Html>
      </group>
    </Float>
  );
};

// Animated 3D vehicle
export const Vehicle3D = ({ 
  type = 'car',
  position = [0, 0, 0] as [number, number, number],
  animate = true
}: {
  type?: 'car' | 'bike';
  position?: [number, number, number];
  animate?: boolean;
}) => {
  const vehicleRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  
  // Simple road curve for animation
  const roadCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-15, -1.5, 5),
    new THREE.Vector3(-5, -1.5, 2),
    new THREE.Vector3(0, -1.5, 0),
    new THREE.Vector3(5, -1.5, -2),
    new THREE.Vector3(15, -1.5, -5),
  ]);
  
  useFrame((state, delta) => {
    if (vehicleRef.current && animate) {
      progressRef.current += delta * 0.05;
      if (progressRef.current > 1) progressRef.current = 0;
      
      const point = roadCurve.getPoint(progressRef.current);
      const tangent = roadCurve.getTangent(progressRef.current);
      
      vehicleRef.current.position.copy(point);
      vehicleRef.current.lookAt(point.clone().add(tangent));
    }
  });

  if (type === 'car') {
    return (
      <group ref={vehicleRef} position={position}>
        {/* Car body */}
        <mesh castShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.3, 0.4]} />
          <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Car top */}
        <mesh castShadow position={[0.05, 0.4, 0]}>
          <boxGeometry args={[0.4, 0.2, 0.35]} />
          <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Wheels */}
        {[[-0.25, 0, 0.2], [-0.25, 0, -0.2], [0.25, 0, 0.2], [0.25, 0, -0.2]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        ))}
      </group>
    );
  }
  
  // Motorcycle
  return (
    <group ref={vehicleRef} position={position}>
      {/* Bike body */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.15, 0.15]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.03, 8, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.03, 8, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
};

// Glowing button effect
export const GlowingButton3D = ({
  position,
  onClick,
  children
}: {
  position: [number, number, number];
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
      const scale = hovered ? 1.1 : 1;
      const pressScale = clicked ? 0.95 : 1;
      meshRef.current.scale.setScalar(scale * pressScale * (hovered ? pulse : 1));
    }
  });

  return (
    <Float speed={3} floatIntensity={0.2}>
      <group position={position}>
        {/* Glow effect behind button */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[2.5, 0.8]} />
          <meshBasicMaterial 
            color="#f97316" 
            transparent 
            opacity={hovered ? 0.4 : 0.2}
          />
        </mesh>
        
        <RoundedBox
          ref={meshRef}
          args={[2.2, 0.6, 0.15]}
          radius={0.08}
          smoothness={4}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => { setHovered(false); setClicked(false); }}
          onPointerDown={() => setClicked(true)}
          onPointerUp={() => { setClicked(false); onClick?.(); }}
        >
          <meshStandardMaterial 
            color="#f97316"
            metalness={0.3}
            roughness={0.4}
            emissive="#f97316"
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </RoundedBox>
        
        <Html
          transform
          position={[0, 0, 0.1]}
          style={{ pointerEvents: 'none' }}
        >
          {children}
        </Html>
      </group>
    </Float>
  );
};
