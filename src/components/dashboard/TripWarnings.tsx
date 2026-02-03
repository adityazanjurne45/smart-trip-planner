import { AlertTriangle, DollarSign, Clock, CloudRain, Info, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TripDetails, Recommendations } from "@/types/trip";
import { cn } from "@/lib/utils";

interface TripWarningsProps {
  tripDetails: TripDetails;
  recommendations: Recommendations;
  weather?: {
    temp: number;
    condition: string;
  };
}

interface Warning {
  type: "error" | "warning" | "info" | "success";
  title: string;
  description: string;
  icon: React.ElementType;
}

const TripWarnings = ({ tripDetails, recommendations, weather }: TripWarningsProps) => {
  const warnings: Warning[] = [];
  const dailyBudget = tripDetails.budget / tripDetails.duration;

  // Budget warnings
  const estimatedMinDaily = 80; // Minimum for budget travel
  const estimatedComfortableDaily = 150; // Comfortable travel
  
  if (dailyBudget < estimatedMinDaily) {
    warnings.push({
      type: "error",
      title: "Very Tight Budget",
      description: `Your daily budget of $${Math.round(dailyBudget)} is below the recommended minimum of $${estimatedMinDaily}. Consider extending your budget or reducing trip duration.`,
      icon: DollarSign,
    });
  } else if (dailyBudget < estimatedComfortableDaily) {
    warnings.push({
      type: "warning",
      title: "Budget Consideration",
      description: `Daily budget of $${Math.round(dailyBudget)} is tight. You may need to choose between some activities or opt for budget accommodations.`,
      icon: DollarSign,
    });
  } else {
    warnings.push({
      type: "success",
      title: "Budget Looks Good",
      description: `Your daily budget of $${Math.round(dailyBudget)} should be comfortable for this destination.`,
      icon: CheckCircle2,
    });
  }

  // Duration warnings
  if (tripDetails.duration < 3 && recommendations.touristPlaces.length > 3) {
    warnings.push({
      type: "warning",
      title: "Short Duration",
      description: "You have more attractions than days. Consider extending your trip or prioritizing must-see locations.",
      icon: Clock,
    });
  }

  if (tripDetails.duration > 14) {
    warnings.push({
      type: "info",
      title: "Extended Trip",
      description: "For trips over 2 weeks, consider building in rest days and flexible time for spontaneous discoveries.",
      icon: Info,
    });
  }

  // Weather warnings
  if (weather) {
    if (weather.condition.toLowerCase().includes("rain")) {
      warnings.push({
        type: "warning",
        title: "Rain Expected",
        description: "Pack rain gear and have indoor alternatives ready. Some outdoor activities may be affected.",
        icon: CloudRain,
      });
    }
    if (weather.temp > 35) {
      warnings.push({
        type: "warning",
        title: "Extreme Heat",
        description: "High temperatures expected. Plan outdoor activities for early morning or evening, stay hydrated.",
        icon: AlertTriangle,
      });
    }
    if (weather.temp < 5) {
      warnings.push({
        type: "info",
        title: "Cold Weather",
        description: "Pack warm clothing. Indoor attractions and heated transport recommended.",
        icon: Info,
      });
    }
  }

  // Places coverage
  const totalPlaces = recommendations.touristPlaces.length;
  const placesPerDay = totalPlaces / tripDetails.duration;
  
  if (placesPerDay > 2) {
    warnings.push({
      type: "warning",
      title: "Packed Schedule",
      description: `You have ${totalPlaces} attractions across ${tripDetails.duration} days. This might feel rushed. Focus on quality over quantity.`,
      icon: Clock,
    });
  }

  return (
    <div className="space-y-3">
      {warnings.map((warning, index) => {
        const Icon = warning.icon;
        return (
          <Alert
            key={index}
            className={cn(
              "animate-fade-in",
              warning.type === "error" && "border-destructive/50 bg-destructive/5",
              warning.type === "warning" && "border-amber-500/50 bg-amber-50 dark:bg-amber-900/10",
              warning.type === "info" && "border-blue-500/50 bg-blue-50 dark:bg-blue-900/10",
              warning.type === "success" && "border-travel-forest/50 bg-travel-forest/5"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                warning.type === "error" && "text-destructive",
                warning.type === "warning" && "text-amber-600",
                warning.type === "info" && "text-blue-600",
                warning.type === "success" && "text-travel-forest"
              )}
            />
            <AlertTitle
              className={cn(
                warning.type === "error" && "text-destructive",
                warning.type === "warning" && "text-amber-700 dark:text-amber-400",
                warning.type === "info" && "text-blue-700 dark:text-blue-400",
                warning.type === "success" && "text-travel-forest"
              )}
            >
              {warning.title}
            </AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              {warning.description}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
};

export default TripWarnings;
