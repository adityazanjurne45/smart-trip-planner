import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CameraControllerProps {
  targetPosition?: [number, number, number];
  targetLookAt?: [number, number, number];
  enableOrbit?: boolean;
  autoRotate?: boolean;
  transitionSpeed?: number;
}

const CameraController = ({
  targetPosition = [0, 2, 10],
  targetLookAt = [0, 0, 0],
  enableOrbit = true,
  autoRotate = true,
  transitionSpeed = 0.02
}: CameraControllerProps) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPosRef = useRef(new THREE.Vector3(...targetPosition));
  const targetLookRef = useRef(new THREE.Vector3(...targetLookAt));
  
  useEffect(() => {
    targetPosRef.current.set(...targetPosition);
    targetLookRef.current.set(...targetLookAt);
  }, [targetPosition, targetLookAt]);
  
  useFrame(() => {
    // Smooth camera transition
    camera.position.lerp(targetPosRef.current, transitionSpeed);
    
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookRef.current, transitionSpeed);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={enableOrbit}
      enablePan={false}
      enableRotate={enableOrbit}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      minDistance={5}
      maxDistance={30}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      dampingFactor={0.05}
      enableDamping
    />
  );
};

export default CameraController;
