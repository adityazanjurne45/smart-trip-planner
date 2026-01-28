import { MapPin, Building2, Navigation, Flag } from "lucide-react";

const MapLegend = () => {
  const legendItems = [
    { icon: "🚀", label: "Boarding Point", color: "#22c55e" },
    { icon: "🎯", label: "Destination", color: "#8b5cf6" },
    { icon: "📍", label: "Attractions", color: "#ef4444" },
    { icon: "🏨", label: "Hotels", color: "#3b82f6" },
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000]">
      <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border p-3 space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Legend</h4>
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="text-base">{item.icon}</span>
            <span className="text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
