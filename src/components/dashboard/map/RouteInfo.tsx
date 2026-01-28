import { Clock, Navigation, AlertTriangle, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteInfoProps {
  distance: string;
  duration: string;
  trafficLevel?: "low" | "medium" | "high";
  vehicleType: "car" | "bike";
  fromName: string;
  toName: string;
}

const RouteInfo = ({
  distance,
  duration,
  trafficLevel = "low",
  vehicleType,
  fromName,
  toName,
}: RouteInfoProps) => {
  const trafficColors = {
    low: "text-green-500 bg-green-500/10",
    medium: "text-yellow-500 bg-yellow-500/10",
    high: "text-red-500 bg-red-500/10",
  };

  const trafficLabels = {
    low: "Light Traffic",
    medium: "Moderate Traffic",
    high: "Heavy Traffic",
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[1000]">
      <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border p-4 space-y-3">
        {/* Route header */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground truncate max-w-[100px]">{fromName}</span>
          </div>
          <Navigation className="w-4 h-4 text-muted-foreground rotate-90" />
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-muted-foreground truncate max-w-[100px]">{toName}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Gauge className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{distance}</div>
              <div className="text-xs text-muted-foreground">Distance</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{duration}</div>
              <div className="text-xs text-muted-foreground">Est. Time</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", trafficColors[trafficLevel])}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className={cn("text-sm font-semibold", trafficColors[trafficLevel].split(" ")[0])}>
                {trafficLabels[trafficLevel]}
              </div>
              <div className="text-xs text-muted-foreground">Traffic</div>
            </div>
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
  );
};

export default RouteInfo;
