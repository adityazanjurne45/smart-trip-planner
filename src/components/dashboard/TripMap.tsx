import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { TripDetails, Recommendations } from "@/pages/Dashboard";
import { Map, Maximize2, Minimize2, RotateCcw, Play, Pause } from "lucide-react";
import MapMarkers from "./map/MapMarkers";
import AnimatedRoute from "./map/AnimatedRoute";
import RouteInfo from "./map/RouteInfo";
import MapLegend from "./map/MapLegend";
import { useMapData } from "./map/useMapData";
import "leaflet/dist/leaflet.css";

// Fix for default markers
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Map controller component
const MapController = ({ 
  center, 
  zoom,
  shouldReset 
}: { 
  center: [number, number]; 
  zoom: number;
  shouldReset: boolean;
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (shouldReset) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [shouldReset, center, zoom, map]);
  
  return null;
};

interface TripMapProps {
  tripDetails: TripDetails;
  recommendations: Recommendations | null;
}

const TripMap = ({ tripDetails, recommendations }: TripMapProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  
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

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
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
        <MapContainer
          key={`map-${resetKey}`}
          center={center}
          zoom={zoomLevel}
          className="h-full w-full"
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          <MapController 
            center={center} 
            zoom={zoomLevel} 
            shouldReset={resetKey > 0}
          />
          
          {/* Animated route */}
          <AnimatedRoute
            positions={mainRoute}
            color="#3b82f6"
            vehicleType={vehicleType}
            animate={isAnimating}
            showVehicle={isAnimating}
            routeId={`${tripDetails.boardingPoint}-${tripDetails.destinationPoint}-${resetKey}`}
          />
          
          {/* Markers */}
          <MapMarkers markers={markers} />
        </MapContainer>
        
        {/* Legend */}
        <MapLegend />
        
        {/* Route info overlay */}
        <RouteInfo
          distance={distance}
          duration={duration}
          trafficLevel={trafficLevel}
          vehicleType={vehicleType}
          fromName={tripDetails.boardingPoint}
          toName={tripDetails.destinationPoint}
        />
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
