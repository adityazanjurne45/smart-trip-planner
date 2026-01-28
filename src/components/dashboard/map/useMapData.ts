import { useMemo } from "react";
import { TripDetails, Recommendations } from "@/pages/Dashboard";
import { MarkerData } from "./MapMarkers";

// Simulated coordinates for demo (in real app, use geocoding API)
const cityCoordinates: Record<string, [number, number]> = {
  // India
  "mumbai": [19.0760, 72.8777],
  "delhi": [28.6139, 77.2090],
  "bangalore": [12.9716, 77.5946],
  "chennai": [13.0827, 80.2707],
  "kolkata": [22.5726, 88.3639],
  "hyderabad": [17.3850, 78.4867],
  "pune": [18.5204, 73.8567],
  "jaipur": [26.9124, 75.7873],
  "goa": [15.2993, 74.1240],
  "kerala": [10.8505, 76.2711],
  "agra": [27.1767, 78.0081],
  "varanasi": [25.3176, 82.9739],
  "udaipur": [24.5854, 73.7125],
  "shimla": [31.1048, 77.1734],
  "manali": [32.2396, 77.1887],
  // International
  "paris": [48.8566, 2.3522],
  "london": [51.5074, -0.1278],
  "new york": [40.7128, -74.0060],
  "tokyo": [35.6762, 139.6503],
  "dubai": [25.2048, 55.2708],
  "singapore": [1.3521, 103.8198],
  "bangkok": [13.7563, 100.5018],
  "bali": [-8.3405, 115.0920],
  "sydney": [-33.8688, 151.2093],
  "rome": [41.9028, 12.4964],
};

// Get coordinates for a city (with fuzzy matching)
const getCityCoordinates = (cityName: string): [number, number] => {
  const normalizedName = cityName.toLowerCase().trim();
  
  // Exact match
  if (cityCoordinates[normalizedName]) {
    return cityCoordinates[normalizedName];
  }
  
  // Partial match
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (normalizedName.includes(city) || city.includes(normalizedName)) {
      return coords;
    }
  }
  
  // Default to random offset from center of India
  return [20.5937 + Math.random() * 5, 78.9629 + Math.random() * 5];
};

// Generate attraction coordinates around destination
const generateAttractionCoordinates = (
  center: [number, number],
  count: number,
  radius: number = 0.05
): [number, number][] => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count;
    const r = radius * (0.5 + Math.random() * 0.5);
    return [
      center[0] + r * Math.cos(angle),
      center[1] + r * Math.sin(angle),
    ] as [number, number];
  });
};

// Calculate distance between two points (Haversine formula)
const calculateDistance = (
  point1: [number, number],
  point2: [number, number]
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((point2[0] - point1[0]) * Math.PI) / 180;
  const dLon = ((point2[1] - point1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1[0] * Math.PI) / 180) *
      Math.cos((point2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Generate a curved route between two points
const generateRoute = (
  start: [number, number],
  end: [number, number],
  numPoints: number = 50
): [number, number][] => {
  const points: [number, number][] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // Add some curve
    const curve = Math.sin(t * Math.PI) * 0.02;
    const lat = start[0] + (end[0] - start[0]) * t + curve;
    const lng = start[1] + (end[1] - start[1]) * t + curve * 0.5;
    points.push([lat, lng]);
  }
  
  return points;
};

// Estimate travel time based on distance and vehicle type
const estimateTravelTime = (
  distanceKm: number,
  vehicleType: "car" | "bike"
): string => {
  const avgSpeed = vehicleType === "car" ? 40 : 30; // km/h in city
  const hours = distanceKm / avgSpeed;
  
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
};

export const useMapData = (
  tripDetails: TripDetails,
  recommendations: Recommendations | null
) => {
  return useMemo(() => {
    const startCoords = getCityCoordinates(tripDetails.boardingPoint);
    const endCoords = getCityCoordinates(tripDetails.destinationPoint);
    
    // Generate markers
    const markers: MarkerData[] = [
      {
        position: startCoords,
        name: tripDetails.boardingPoint,
        description: "Your starting point",
        type: "start",
      },
      {
        position: endCoords,
        name: tripDetails.destinationPoint,
        description: "Your destination",
        type: "end",
      },
    ];
    
    // Add attraction markers
    if (recommendations?.touristPlaces) {
      const attractionCoords = generateAttractionCoordinates(
        endCoords,
        recommendations.touristPlaces.length
      );
      
      recommendations.touristPlaces.forEach((place, index) => {
        markers.push({
          position: attractionCoords[index],
          name: place.name,
          description: place.description,
          type: "attraction",
        });
      });
    }
    
    // Add hotel markers
    if (recommendations?.hotels) {
      const hotelCoords = generateAttractionCoordinates(
        endCoords,
        recommendations.hotels.length,
        0.03
      );
      
      recommendations.hotels.forEach((hotel, index) => {
        markers.push({
          position: hotelCoords[index],
          name: hotel.name,
          description: `${hotel.pricePerNight}/night • ⭐ ${hotel.rating}`,
          type: "hotel",
        });
      });
    }
    
    // Generate main route
    const mainRoute = generateRoute(startCoords, endCoords);
    
    // Calculate distance and time
    const totalDistance = calculateDistance(startCoords, endCoords);
    
    // Determine vehicle type from recommendations
    const vehicleType: "car" | "bike" = 
      recommendations?.vehicles?.some(v => 
        v.type.toLowerCase().includes("bike") || 
        v.type.toLowerCase().includes("motorcycle")
      ) ? "bike" : "car";
    
    const estimatedTime = estimateTravelTime(totalDistance, vehicleType);
    
    // Determine traffic level based on distance and random factor
    const trafficLevel: "low" | "medium" | "high" = 
      totalDistance > 500 ? "high" : totalDistance > 200 ? "medium" : "low";
    
    // Calculate center and bounds
    const center: [number, number] = [
      (startCoords[0] + endCoords[0]) / 2,
      (startCoords[1] + endCoords[1]) / 2,
    ];
    
    // Determine zoom level based on distance
    const zoomLevel = totalDistance > 1000 ? 4 : totalDistance > 500 ? 5 : totalDistance > 100 ? 7 : 10;
    
    return {
      markers,
      mainRoute,
      startCoords,
      endCoords,
      center,
      zoomLevel,
      vehicleType,
      distance: `${totalDistance.toFixed(1)} km`,
      duration: estimatedTime,
      trafficLevel,
    };
  }, [tripDetails, recommendations]);
};

export { calculateDistance, generateRoute };
