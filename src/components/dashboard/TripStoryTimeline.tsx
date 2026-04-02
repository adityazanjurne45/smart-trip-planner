import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, MapPin, Utensils, Car, Hotel, Coffee, Camera, Download } from "lucide-react";
import { DayItinerary, TripDetails } from "@/types/trip";
import { cn } from "@/lib/utils";

interface TripStoryTimelineProps {
  itinerary: DayItinerary[];
  tripDetails: TripDetails;
}

const ACTIVITY_ICONS: Record<string, typeof MapPin> = {
  attraction: Camera,
  food: Utensils,
  transport: Car,
  hotel: Hotel,
  leisure: Coffee,
};

const ACTIVITY_COLORS: Record<string, string> = {
  attraction: "bg-travel-coral/10 text-travel-coral border-travel-coral/20",
  food: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  transport: "bg-travel-forest/10 text-travel-forest border-travel-forest/20",
  hotel: "bg-primary/10 text-primary border-primary/20",
  leisure: "bg-violet-500/10 text-violet-500 border-violet-500/20",
};

const TripStoryTimeline = ({ itinerary, tripDetails }: TripStoryTimelineProps) => {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <Card className="travel-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Your Trip Story
          </CardTitle>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {tripDetails.boardingPoint} → {tripDetails.destinationPoint}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />

          {itinerary.map((day, dayIdx) => (
            <div key={day.day} className="relative mb-6 last:mb-0">
              {/* Day marker */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold z-10 relative shadow-sm">
                  D{day.day}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{day.theme}</p>
                  {day.travelTip && (
                    <p className="text-xs text-muted-foreground italic">💡 {day.travelTip}</p>
                  )}
                </div>
              </div>

              {/* Activities */}
              <div className="ml-12 space-y-2">
                {day.activities.map((activity, actIdx) => {
                  const Icon = ACTIVITY_ICONS[activity.type] || MapPin;
                  const colorClass = ACTIVITY_COLORS[activity.type] || "bg-muted text-muted-foreground border-border";

                  return (
                    <div
                      key={actIdx}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-sm",
                        colorClass
                      )}
                    >
                      <div className="mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.activity}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{activity.time}</span>
                          <span>•</span>
                          <span>{activity.duration}</span>
                          {activity.cost !== "Free" && activity.cost !== "0" && (
                            <>
                              <span>•</span>
                              <span>{activity.cost}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripStoryTimeline;
