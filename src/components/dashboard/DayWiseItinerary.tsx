import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Sun,
  Cloud,
  CloudRain,
  Utensils,
  Hotel,
  Car,
  Camera,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Recommendations, TripDetails } from "@/types/trip";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";


interface DayWiseItineraryProps {
  tripDetails: TripDetails;
  recommendations: Recommendations;
  weather?: {
    temp: number;
    condition: string;
    forecast?: Array<{ day: string; temp: number; condition: string }>;
  };
}

interface DayActivity {
  time: string;
  activity: string;
  type: "attraction" | "food" | "transport" | "hotel" | "leisure";
  duration: string;
  cost: string;
  icon: React.ElementType;
}

const generateDayActivities = (
  day: number,
  recommendations: Recommendations,
  totalDays: number
): DayActivity[] => {
  const activities: DayActivity[] = [];
  const placesPerDay = Math.ceil(recommendations.touristPlaces.length / totalDays);
  const startIndex = (day - 1) * placesPerDay;
  const dayPlaces = recommendations.touristPlaces.slice(startIndex, startIndex + placesPerDay);

  // Morning
  activities.push({
    time: "08:00",
    activity: "Breakfast at hotel",
    type: "food",
    duration: "1 hour",
    cost: "Included",
    icon: Utensils,
  });

  // Morning attraction
  if (dayPlaces[0]) {
    activities.push({
      time: "09:30",
      activity: dayPlaces[0].name,
      type: "attraction",
      duration: dayPlaces[0].estimatedTime,
      cost: dayPlaces[0].entryFee,
      icon: Camera,
    });
  }

  // Lunch
  activities.push({
    time: "13:00",
    activity: "Lunch at local restaurant",
    type: "food",
    duration: "1.5 hours",
    cost: "$15-25",
    icon: Utensils,
  });

  // Afternoon attraction
  if (dayPlaces[1]) {
    activities.push({
      time: "15:00",
      activity: dayPlaces[1].name,
      type: "attraction",
      duration: dayPlaces[1].estimatedTime,
      cost: dayPlaces[1].entryFee,
      icon: Camera,
    });
  }

  // Leisure time
  activities.push({
    time: "18:00",
    activity: "Free time / Shopping",
    type: "leisure",
    duration: "2 hours",
    cost: "Varies",
    icon: MapPin,
  });

  // Dinner
  activities.push({
    time: "20:00",
    activity: "Dinner",
    type: "food",
    duration: "1.5 hours",
    cost: "$20-35",
    icon: Utensils,
  });

  return activities;
};

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower.includes("rain") || lower.includes("storm")) return CloudRain;
  if (lower.includes("cloud")) return Cloud;
  return Sun;
};

const DayWiseItinerary = ({
  tripDetails,
  recommendations,
  weather,
}: DayWiseItineraryProps) => {
  const { formatAmount, formatPriceString } = useCurrency();
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const days = Array.from({ length: tripDetails.duration }, (_, i) => i + 1);

  
  const dailyBudget = Math.round(tripDetails.budget / tripDetails.duration);
  const estimatedDailyCost = 120; // Rough estimate
  const isBudgetTight = dailyBudget < estimatedDailyCost;

  return (
    <div className="space-y-6">
      {/* Trip Overview Header */}
      <Card className="travel-card overflow-hidden">
        <div className="travel-gradient-hero p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Your Trip</h3>
              <p className="text-2xl font-bold">
                {tripDetails.boardingPoint} → {tripDetails.destinationPoint}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <p className="text-sm opacity-80">Duration</p>
                <p className="font-bold">{tripDetails.duration} days</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <p className="text-sm opacity-80">Budget</p>
                <p className="font-bold">{formatAmount(tripDetails.budget)}</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <p className="text-sm opacity-80">Per Day</p>
                <p className="font-bold">{formatAmount(dailyBudget)}</p>

              </div>
            </div>
          </div>
        </div>

        {/* Smart Warnings */}
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {isBudgetTight && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                <AlertTriangle className="w-3 h-3" />
                Tight budget - Consider reducing activities
              </Badge>
            )}
            {tripDetails.duration > 7 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Extended trip - Rest days recommended
              </Badge>
            )}
            {weather && weather.temp > 35 && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1">
                <Sun className="w-3 h-3" />
                High temperatures expected - Stay hydrated
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Day-wise Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Day-by-Day Itinerary
        </h3>

        {days.map((day) => {
          const isExpanded = expandedDay === day;
          const activities = generateDayActivities(day, recommendations, tripDetails.duration);
          const WeatherIcon = weather?.forecast?.[day - 1] 
            ? getWeatherIcon(weather.forecast[day - 1].condition)
            : Sun;

          return (
            <Card
              key={day}
              className={cn(
                "travel-card transition-all cursor-pointer",
                isExpanded && "ring-2 ring-primary/20"
              )}
            >
              <CardHeader
                className="p-4 cursor-pointer"
                onClick={() => setExpandedDay(isExpanded ? null : day)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{day}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Day {day}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {activities.length} activities planned
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {weather?.forecast?.[day - 1] && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <WeatherIcon className="w-4 h-4" />
                        <span>{weather.forecast[day - 1].temp}°C</span>
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 px-4 pb-4 animate-fade-in">
                  <div className="relative pl-6 border-l-2 border-primary/20 space-y-4">
                    {activities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={index}
                          className="relative animate-slide-in-right"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                          <div className="bg-muted/50 rounded-lg p-4 ml-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center",
                                  activity.type === "attraction" && "bg-primary/10 text-primary",
                                  activity.type === "food" && "bg-travel-coral/10 text-travel-coral",
                                  activity.type === "transport" && "bg-travel-forest/10 text-travel-forest",
                                  activity.type === "hotel" && "bg-travel-gold/10 text-travel-gold",
                                  activity.type === "leisure" && "bg-muted text-muted-foreground"
                                )}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{activity.activity}</p>
                                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {activity.time}
                                    </span>
                                    <span>•</span>
                                    <span>{activity.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {activity.cost}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DayWiseItinerary;
