import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TripDetails, Recommendations, PlaceImage } from "@/types/trip";
import { Map, Maximize2, Minimize2, RotateCcw, Play, Pause, Navigation, Layers, Camera, ImageOff } from "lucide-react";
import { useMapData } from "./map/useMapData";
import { fetchPlaceImages } from "@/lib/api/images";
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

// Component for destination preview with real images
const DestinationPreview = ({ destination }: { destination: string }) => {
  const [image, setImage] = useState<PlaceImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        const images = await fetchPlaceImages(destination, 'destination', 1);
        if (images.length > 0) {
          setImage(images[0]);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadImage();
  }, [destination]);

  return (
    <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border overflow-hidden w-52">
      {isLoading ? (
        <div className="w-full h-24 bg-muted animate-pulse flex items-center justify-center">
          <Camera className="w-6 h-6 text-muted-foreground" />
        </div>
      ) : error || !image ? (
        <div className="w-full h-24 bg-muted flex items-center justify-center">
          <ImageOff className="w-6 h-6 text-muted-foreground" />
        </div>
      ) : (
        <img 
          src={image.thumbUrl}
          alt={destination}
          className="w-full h-24 object-cover"
        />
      )}
      <div className="p-3">
        <h4 className="font-semibold text-foreground text-sm">{destination}</h4>
        <p className="text-xs text-muted-foreground">Your destination</p>
        {image && (
          <a 
            href={image.photographerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline mt-1 block"
          >
            Photo by {image.photographer}
          </a>
        )}
      </div>
    </div>
  );
};

// Custom icon creator with cleaner design
const createCustomIcon = (type: "hotel" | "attraction" | "start" | "end" | "transport") => {
  const configs = {
    start: { bg: "#22c55e", icon: "🚀", size: 40 },
    end: { bg: "#8b5cf6", icon: "📍", size: 40 },
    attraction: { bg: "#ef4444", icon: "🎯", size: 36 },
    hotel: { bg: "#3b82f6", icon: "🏨", size: 36 },
    transport: { bg: "#f59e0b", icon: "🚗", size: 36 },
  };

  const config = configs[type];

  return L.divIcon({
    html: `
      <div style="
        background: ${config.bg};
        width: ${config.size}px;
        height: ${config.size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 3px solid white;
      ">
        <div style="transform: rotate(45deg); font-size: ${config.size * 0.45}px;">
          ${config.icon}
        </div>
      </div>
    `,
    className: "custom-map-marker",
    iconSize: [config.size, config.size],
    iconAnchor: [config.size / 2, config.size],
    popupAnchor: [0, -config.size],
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
  const [mapStyle, setMapStyle] = useState<"satellite" | "street">("satellite");
  
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

    // Satellite/Hybrid tile layer
    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri",
      }
    );

    const streetLayer = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    // Add labels overlay for satellite view
    const labelsLayer = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
      {
        attribution: '',
      }
    );

    satelliteLayer.addTo(map);
    labelsLayer.addTo(map);

    // Store layers for switching
    (map as any)._customLayers = { satelliteLayer, streetLayer, labelsLayer };

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

  // Handle map style toggle
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    
    const map = mapRef.current;
    const layers = (map as any)._customLayers;
    if (!layers) return;

    if (mapStyle === "satellite") {
      map.removeLayer(layers.streetLayer);
      layers.satelliteLayer.addTo(map);
      layers.labelsLayer.addTo(map);
    } else {
      map.removeLayer(layers.satelliteLayer);
      map.removeLayer(layers.labelsLayer);
      layers.streetLayer.addTo(map);
    }
  }, [mapStyle, mapReady]);

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
    
    // Clear existing markers and polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add route polyline with glow effect
    L.polyline(mainRoute, {
      color: "#3b82f6",
      weight: 8,
      opacity: 0.3,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    L.polyline(mainRoute, {
      color: "#3b82f6",
      weight: 4,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
      dashArray: vehicleType === "bike" ? "10, 5" : undefined,
    }).addTo(map);

    // Add markers with clean info popups
    markers.forEach((marker) => {
      const icon = createCustomIcon(marker.type);
      
      const popupContent = `
        <div style="min-width: 180px; padding: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 20px;">${
              marker.type === "start" ? "🚀" : 
              marker.type === "end" ? "📍" : 
              marker.type === "hotel" ? "🏨" : "🎯"
            }</span>
            <h4 style="font-weight: 600; margin: 0; font-size: 14px;">${marker.name}</h4>
          </div>
          ${marker.description ? `<p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">${marker.description}</p>` : ""}
          <span style="display: inline-block; padding: 3px 10px; font-size: 11px; border-radius: 9999px; background: ${
            marker.type === "hotel" ? "rgba(59, 130, 246, 0.1)" : 
            marker.type === "attraction" ? "rgba(239, 68, 68, 0.1)" : 
            "rgba(34, 197, 94, 0.1)"
          }; color: ${
            marker.type === "hotel" ? "#3b82f6" : 
            marker.type === "attraction" ? "#ef4444" : 
            "#22c55e"
          }; text-transform: capitalize; font-weight: 500;">
            ${marker.type}
          </span>
        </div>
      `;
      
      L.marker(marker.position, { icon })
        .bindPopup(popupContent)
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

  const toggleMapStyle = () => {
    setMapStyle(prev => prev === "satellite" ? "street" : "satellite");
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
            onClick={toggleMapStyle}
            className="h-9 w-9"
            title={mapStyle === "satellite" ? "Switch to street view" : "Switch to satellite view"}
          >
            <Layers className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAnimating(prev => !prev)}
            className="h-9 w-9"
            title={isAnimating ? "Pause animation" : "Play animation"}
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Map container */}
      <div className={`relative ${isExpanded ? "h-[calc(100%-64px)]" : "h-[400px] md:h-[500px]"}`}>
        <div ref={mapContainerRef} className="h-full w-full" />
        
        {/* Destination Preview Card with real images */}
        <div className="absolute top-4 right-4 z-[1000]">
          <DestinationPreview destination={tripDetails.destinationPoint} />
        </div>

        {/* Legend overlay */}
        <div className="absolute top-4 left-4 z-[1000]">
          <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border p-3 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Map Legend</h4>
            <div className="flex items-center gap-2 text-sm">
              <span>🚀</span>
              <span className="text-foreground">Departure</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>📍</span>
              <span className="text-foreground">Destination</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>🏨</span>
              <span className="text-foreground">Hotels</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>🎯</span>
              <span className="text-foreground">Attractions</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>{vehicleType === "car" ? "🚗" : "🏍️"}</span>
              <span className="text-foreground">Transport</span>
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
