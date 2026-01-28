import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Building2, Hotel, Navigation } from "lucide-react";

// Custom icon creator
const createCustomIcon = (color: string, iconType: "attraction" | "hotel" | "start" | "end") => {
  const iconHtml = `
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
      <div style="transform: rotate(45deg); color: white; font-size: 16px;">
        ${iconType === "attraction" ? "📍" : iconType === "hotel" ? "🏨" : iconType === "start" ? "🚀" : "🎯"}
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "custom-map-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

interface MarkerData {
  position: [number, number];
  name: string;
  description?: string;
  type: "attraction" | "hotel" | "start" | "end";
}

interface MapMarkersProps {
  markers: MarkerData[];
}

const MapMarkers = ({ markers }: MapMarkersProps) => {
  const getColor = (type: MarkerData["type"]) => {
    switch (type) {
      case "attraction":
        return "#ef4444"; // coral/red
      case "hotel":
        return "#3b82f6"; // blue
      case "start":
        return "#22c55e"; // green
      case "end":
        return "#8b5cf6"; // purple
      default:
        return "#6b7280";
    }
  };

  return (
    <>
      {markers.map((marker, index) => (
        <Marker
          key={`${marker.type}-${index}`}
          position={marker.position}
          icon={createCustomIcon(getColor(marker.type), marker.type)}
        >
          <Popup>
            <div className="p-2 min-w-[150px]">
              <h4 className="font-semibold text-foreground">{marker.name}</h4>
              {marker.description && (
                <p className="text-sm text-muted-foreground mt-1">{marker.description}</p>
              )}
              <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">
                {marker.type}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapMarkers;
export type { MarkerData };
