import { useEffect, useState, useRef } from "react";
import { Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";

interface AnimatedRouteProps {
  positions: [number, number][];
  color?: string;
  vehicleType: "car" | "bike";
  animate?: boolean;
  showVehicle?: boolean;
  routeId: string;
}

const createVehicleIcon = (type: "car" | "bike", rotation: number = 0) => {
  const emoji = type === "car" ? "🚗" : "🏍️";
  
  return L.divIcon({
    html: `
      <div style="
        font-size: 28px;
        transform: rotate(${rotation}deg);
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        transition: transform 0.3s ease;
      ">
        ${emoji}
      </div>
    `,
    className: "vehicle-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const AnimatedRoute = ({
  positions,
  color = "#3b82f6",
  vehicleType,
  animate = true,
  showVehicle = true,
  routeId,
}: AnimatedRouteProps) => {
  const map = useMap();
  const [animatedPositions, setAnimatedPositions] = useState<[number, number][]>([]);
  const [vehiclePosition, setVehiclePosition] = useState<[number, number] | null>(null);
  const [vehicleRotation, setVehicleRotation] = useState(0);
  const animationRef = useRef<number>();
  const vehicleAnimationRef = useRef<number>();

  // Calculate rotation angle between two points
  const calculateRotation = (from: [number, number], to: [number, number]) => {
    const dx = to[1] - from[1];
    const dy = to[0] - from[0];
    return (Math.atan2(dx, dy) * 180) / Math.PI;
  };

  // Animate route drawing
  useEffect(() => {
    if (!animate || positions.length < 2) {
      setAnimatedPositions(positions);
      return;
    }

    setAnimatedPositions([]);
    let currentIndex = 0;
    const pointsPerFrame = Math.max(1, Math.floor(positions.length / 60));

    const animateRoute = () => {
      if (currentIndex < positions.length) {
        setAnimatedPositions(positions.slice(0, currentIndex + pointsPerFrame));
        currentIndex += pointsPerFrame;
        animationRef.current = requestAnimationFrame(animateRoute);
      } else {
        setAnimatedPositions(positions);
      }
    };

    animationRef.current = requestAnimationFrame(animateRoute);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [positions, animate, routeId]);

  // Animate vehicle along route
  useEffect(() => {
    if (!showVehicle || positions.length < 2) return;

    let currentIndex = 0;
    const speed = 50; // ms per point

    const animateVehicle = () => {
      if (currentIndex < positions.length - 1) {
        setVehiclePosition(positions[currentIndex]);
        setVehicleRotation(calculateRotation(positions[currentIndex], positions[currentIndex + 1]));
        currentIndex++;
        vehicleAnimationRef.current = window.setTimeout(animateVehicle, speed);
      } else {
        // Loop animation
        currentIndex = 0;
        vehicleAnimationRef.current = window.setTimeout(animateVehicle, 1000);
      }
    };

    vehicleAnimationRef.current = window.setTimeout(animateVehicle, 500);

    return () => {
      if (vehicleAnimationRef.current) {
        clearTimeout(vehicleAnimationRef.current);
      }
    };
  }, [positions, showVehicle, routeId]);

  return (
    <>
      {/* Shadow/glow effect */}
      <Polyline
        positions={animatedPositions}
        pathOptions={{
          color: color,
          weight: 8,
          opacity: 0.3,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      {/* Main route line */}
      <Polyline
        positions={animatedPositions}
        pathOptions={{
          color: color,
          weight: 4,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
          dashArray: vehicleType === "bike" ? "10, 5" : undefined,
        }}
      />
      {/* Animated vehicle */}
      {showVehicle && vehiclePosition && (
        <Marker
          position={vehiclePosition}
          icon={createVehicleIcon(vehicleType, vehicleRotation)}
          zIndexOffset={1000}
        />
      )}
    </>
  );
};

export default AnimatedRoute;
