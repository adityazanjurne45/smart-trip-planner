import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TripDetails, Recommendations } from "@/pages/Dashboard";
import { Map, Maximize2, Minimize2, RotateCcw, Play, Pause, MapPin, Building2, Navigation } from "lucide-react";
import { useMapData } from "./map/useMapData";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface TripMapProps {
  tripDetails: TripDetails;
  recommendations: Recommendations | null;
}

// Custom icon creator
const createCustomIcon = (color: string, emoji: string) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        <div style="transform: rotate(45deg); font-size: 16px;">
          ${emoji}
        </div>
      </div>
    `,
    className: "custom-map-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const createVehicleIcon = (type: "car" | "bike") => {
  const emoji = type === "car" ? "🚗" : "🏍️";
  return L.divIcon({
    html: `<div style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${emoji}</div>`,
    className: "vehicle-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const TripMap = ({ tripDetails, recommendations }: TripMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const animationRef = useRef<number>();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  
  const {
    markers,
    mainRoute,
    center,
    zoomLevel,
    vehicleType,
    distance,
    duration,
    trafficLevel,
  } = useMapData(tripDetails, recommendations);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoomLevel,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    mapRef.current = map;
    setMapReady(true);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map view when center/zoom changes
  useEffect(() => {
    if (mapRef.current && mapReady) {
      mapRef.current.setView(center, zoomLevel);
    }
  }, [center, zoomLevel, mapReady]);

  // Add markers and route
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    
    // Clear existing layers except tile layer
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // Add route polyline with glow effect
    const glowLine = L.polyline(mainRoute, {
      color: "#3b82f6",
      weight: 8,
      opacity: 0.3,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    const mainLine = L.polyline(mainRoute, {
      color: "#3b82f6",
      weight: 4,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
      dashArray: vehicleType === "bike" ? "10, 5" : undefined,
    }).addTo(map);

    // Add markers
    markers.forEach((marker) => {
      const iconConfig = {
        start: { color: "#22c55e", emoji: "🚀" },
        end: { color: "#8b5cf6", emoji: "🎯" },
        attraction: { color: "#ef4444", emoji: "📍" },
        hotel: { color: "#3b82f6", emoji: "🏨" },
      };
      
      const config = iconConfig[marker.type];
      const icon = createCustomIcon(config.color, config.emoji);
      
      L.marker(marker.position, { icon })
        .bindPopup(`
          <div style="min-width: 150px; padding: 8px;">
            <h4 style="font-weight: 600; margin-bottom: 4px;">${marker.name}</h4>
            ${marker.description ? `<p style="font-size: 12px; color: #666; margin-bottom: 8px;">${marker.description}</p>` : ""}
            <span style="display: inline-block; padding: 2px 8px; font-size: 11px; border-radius: 9999px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; text-transform: capitalize;">
              ${marker.type}
            </span>
          </div>
        `)
        .addTo(map);
    });

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [markers, mainRoute, vehicleType, mapReady]);

  // Animate vehicle along route
  useEffect(() => {
    if (!mapRef.current || !mapReady || !isAnimating || mainRoute.length < 2) return;

    const map = mapRef.current;
    let currentIndex = 0;
    
    // Create vehicle marker
    if (vehicleMarkerRef.current) {
      map.removeLayer(vehicleMarkerRef.current);
    }
    
    const vehicleIcon = createVehicleIcon(vehicleType);
    vehicleMarkerRef.current = L.marker(mainRoute[0], { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(map);

    const animateVehicle = () => {
      if (!isAnimating || !vehicleMarkerRef.current) return;
      
      currentIndex = (currentIndex + 1) % mainRoute.length;
      vehicleMarkerRef.current.setLatLng(mainRoute[currentIndex]);
      
      animationRef.current = requestAnimationFrame(() => {
        setTimeout(animateVehicle, 50);
      });
    };

    animateVehicle();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mainRoute, vehicleType, isAnimating, mapReady]);

  // Handle animation toggle
  useEffect(() => {
    if (!isAnimating && vehicleMarkerRef.current && mapRef.current) {
      mapRef.current.removeLayer(vehicleMarkerRef.current);
      vehicleMarkerRef.current = null;
    }
  }, [isAnimating]);

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoomLevel);
    }
  };

  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  const trafficColors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };

  const trafficLabels = {
    low: "Light Traffic",
    medium: "Moderate Traffic",
    high: "Heavy Traffic",
  };

  return (
    <div className={`travel-card overflow-hidden transition-all duration-300 ${
      isExpanded ? "fixed inset-4 z-50" : "relative"
    }`}>
      {/* Map header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Map className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Interactive Route Map</h3>
            <p className="text-sm text-muted-foreground">
              {tripDetails.boardingPoint} → {tripDetails.destinationPoint}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAnimation}
            className="h-9 w-9"
            title={isAnimating ? "Pause animation" : "Play animation"}
          >
            {isAnimating ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-9 w-9"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-9 w-9"
            title={isExpanded ? "Minimize" : "Fullscreen"}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Map container */}
      <div className={`relative ${isExpanded ? "h-[calc(100%-64px)]" : "h-[400px] md:h-[500px]"}`}>
        <div ref={mapContainerRef} className="h-full w-full" />
        
        {/* Legend overlay */}
        <div className="absolute top-4 left-4 z-[1000]">
          <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border p-3 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Legend</h4>
            <div className="flex items-center gap-2 text-sm">
              <span>🚀</span>
              <span className="text-foreground">Boarding Point</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>🎯</span>
              <span className="text-foreground">Destination</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>📍</span>
              <span className="text-foreground">Attractions</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>🏨</span>
              <span className="text-foreground">Hotels</span>
            </div>
          </div>
        </div>
        
        {/* Route info overlay */}
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[1000]">
          <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border p-4 space-y-3">
            {/* Route header */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground truncate max-w-[100px]">{tripDetails.boardingPoint}</span>
              </div>
              <Navigation className="w-4 h-4 text-muted-foreground rotate-90" />
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-muted-foreground truncate max-w-[100px]">{tripDetails.destinationPoint}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold text-foreground">{distance}</div>
                <div className="text-xs text-muted-foreground">Distance</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">{duration}</div>
                <div className="text-xs text-muted-foreground">Est. Time</div>
              </div>
              <div className="text-center">
                <div className={`font-semibold ${trafficColors[trafficLevel]}`}>{trafficLabels[trafficLevel]}</div>
                <div className="text-xs text-muted-foreground">Traffic</div>
              </div>
            </div>

            {/* Vehicle indicator */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-border">
              <span className="text-xl">{vehicleType === "car" ? "🚗" : "🏍️"}</span>
              <span className="text-sm text-muted-foreground">
                Traveling by {vehicleType === "car" ? "Car" : "Bike"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default TripMap;
