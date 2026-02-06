import { useMemo } from "react";
import { 
  Shirt, 
  Umbrella, 
  Sun, 
  Snowflake, 
  Wind, 
  ThermometerSun, 
  CloudRain,
  Glasses,
  Footprints,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherData {
  temp: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
}

interface WeatherSuggestionsProps {
  weather: WeatherData;
  className?: string;
}

interface Suggestion {
  icon: typeof Shirt;
  text: string;
  priority: "high" | "medium" | "low";
  color: string;
}

const getWeatherSuggestions = (weather: WeatherData): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const { temp, condition, humidity, windSpeed } = weather;
  const conditionLower = condition.toLowerCase();

  // Temperature-based suggestions
  if (temp <= 5) {
    suggestions.push({
      icon: Snowflake,
      text: "Pack heavy winter jackets, thermals, and warm layers",
      priority: "high",
      color: "text-blue-500 bg-blue-100",
    });
    suggestions.push({
      icon: Footprints,
      text: "Bring waterproof boots with good grip for icy conditions",
      priority: "high",
      color: "text-blue-500 bg-blue-100",
    });
  } else if (temp <= 15) {
    suggestions.push({
      icon: Shirt,
      text: "Carry warm clothes, sweaters, and a light jacket",
      priority: "high",
      color: "text-amber-500 bg-amber-100",
    });
  } else if (temp >= 35) {
    suggestions.push({
      icon: ThermometerSun,
      text: "Extreme heat! Light cotton clothes & stay hydrated",
      priority: "high",
      color: "text-red-500 bg-red-100",
    });
    suggestions.push({
      icon: Glasses,
      text: "Sunglasses and sunscreen are essential",
      priority: "high",
      color: "text-travel-gold bg-travel-gold/20",
    });
    suggestions.push({
      icon: AlertTriangle,
      text: "Avoid outdoor activities during peak afternoon hours",
      priority: "high",
      color: "text-red-500 bg-red-100",
    });
  } else if (temp >= 25) {
    suggestions.push({
      icon: Sun,
      text: "Light, breathable cotton clothes recommended",
      priority: "medium",
      color: "text-travel-gold bg-travel-gold/20",
    });
    suggestions.push({
      icon: Glasses,
      text: "Don't forget sunglasses and sunscreen",
      priority: "medium",
      color: "text-travel-gold bg-travel-gold/20",
    });
  } else {
    suggestions.push({
      icon: Shirt,
      text: "Pleasant weather! Pack light layers for versatility",
      priority: "low",
      color: "text-travel-forest bg-travel-forest/20",
    });
  }

  // Condition-based suggestions
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle") || conditionLower.includes("shower")) {
    suggestions.push({
      icon: Umbrella,
      text: "Carry umbrella or raincoat - rain expected",
      priority: "high",
      color: "text-primary bg-primary/20",
    });
    suggestions.push({
      icon: Footprints,
      text: "Waterproof footwear recommended",
      priority: "medium",
      color: "text-primary bg-primary/20",
    });
  }

  if (conditionLower.includes("storm") || conditionLower.includes("thunder")) {
    suggestions.push({
      icon: AlertTriangle,
      text: "Thunderstorm warning! Avoid open areas and stay indoors",
      priority: "high",
      color: "text-red-500 bg-red-100",
    });
  }

  if (conditionLower.includes("snow")) {
    suggestions.push({
      icon: Snowflake,
      text: "Snow expected! Pack insulated waterproof gear",
      priority: "high",
      color: "text-blue-500 bg-blue-100",
    });
  }

  if (conditionLower.includes("fog") || conditionLower.includes("mist") || conditionLower.includes("haze")) {
    suggestions.push({
      icon: CloudRain,
      text: "Low visibility expected - drive carefully",
      priority: "medium",
      color: "text-muted-foreground bg-muted",
    });
  }

  // Wind-based suggestions
  if (windSpeed && windSpeed > 10) {
    suggestions.push({
      icon: Wind,
      text: "Strong winds expected - secure loose items",
      priority: "medium",
      color: "text-primary bg-primary/20",
    });
  }

  // Humidity-based suggestions
  if (humidity && humidity > 80 && temp > 25) {
    suggestions.push({
      icon: ThermometerSun,
      text: "High humidity! Wear moisture-wicking fabrics",
      priority: "medium",
      color: "text-amber-500 bg-amber-100",
    });
  }

  return suggestions;
};

const WeatherSuggestions = ({ weather, className }: WeatherSuggestionsProps) => {
  const suggestions = useMemo(() => getWeatherSuggestions(weather), [weather]);

  if (suggestions.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Travel Suggestions</h4>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl transition-all",
                suggestion.priority === "high" 
                  ? "bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 border border-red-200 dark:border-red-800"
                  : "bg-muted/50 border border-border"
              )}
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", suggestion.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{suggestion.text}</p>
                {suggestion.priority === "high" && (
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium mt-1 inline-block">
                    Important
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherSuggestions;
