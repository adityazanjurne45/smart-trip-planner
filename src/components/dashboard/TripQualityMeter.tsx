import { useState } from "react";
import { Sparkles, Check, Scale, AlertTriangle, Zap, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Destination attraction data
const CITY_ATTRACTIONS: Record<string, number> = {
  // India
  goa: 20, mumbai: 18, delhi: 22, jaipur: 15, manali: 12, shimla: 10,
  udaipur: 12, varanasi: 14, agra: 8, pune: 10, hyderabad: 14,
  chennai: 12, bangalore: 15, kolkata: 16, kochi: 10, mysore: 8,
  darjeeling: 8, rishikesh: 7, amritsar: 6, jodhpur: 9, satara: 6,
  ooty: 7, munnar: 8, alleppey: 6, kodaikanal: 7, pondicherry: 8,
  // International
  paris: 25, london: 28, "new york": 30, tokyo: 25, dubai: 18,
  singapore: 15, bangkok: 20, bali: 16, rome: 22, barcelona: 18,
  istanbul: 20, sydney: 18, "los angeles": 20, amsterdam: 14,
  prague: 12, vienna: 14, berlin: 16, lisbon: 12, "kuala lumpur": 14,
  maldives: 8, "hong kong": 16, seoul: 18, cairo: 12, athens: 14,
  "san francisco": 15, miami: 12, toronto: 14, vancouver: 10,
};

const NEARBY_PLACES: Record<string, string[]> = {
  goa: ["Gokarna", "Hampi", "Dudhsagar Falls", "Karwar"],
  mumbai: ["Lonavala", "Alibaug", "Matheran", "Mahabaleshwar"],
  delhi: ["Agra", "Jaipur", "Rishikesh", "Mathura"],
  jaipur: ["Pushkar", "Ajmer", "Ranthambore", "Udaipur"],
  manali: ["Kasol", "Solang Valley", "Rohtang Pass", "Kullu"],
  shimla: ["Kufri", "Chail", "Naldehra", "Mashobra"],
  udaipur: ["Mount Abu", "Chittorgarh", "Kumbhalgarh", "Ranakpur"],
  pune: ["Lonavala", "Mahabaleshwar", "Lavasa", "Panchgani"],
  satara: ["Mahabaleshwar", "Panchgani", "Kaas Plateau", "Thoseghar"],
  paris: ["Versailles", "Giverny", "Fontainebleau", "Chartres"],
  london: ["Stonehenge", "Bath", "Oxford", "Cambridge"],
  tokyo: ["Yokohama", "Kamakura", "Nikko", "Hakone"],
  dubai: ["Abu Dhabi", "Sharjah", "Fujairah", "Ras Al Khaimah"],
  singapore: ["Sentosa", "Johor Bahru", "Batam", "Bintan"],
  bangkok: ["Pattaya", "Ayutthaya", "Kanchanaburi", "Hua Hin"],
  bali: ["Ubud", "Seminyak", "Nusa Penida", "Gili Islands"],
  rome: ["Florence", "Pompeii", "Tivoli", "Orvieto"],
  barcelona: ["Montserrat", "Girona", "Sitges", "Tarragona"],
};

interface TripQualityMeterProps {
  destination: string;
  duration: number;
  onDurationChange: (days: number) => void;
}

type QualityState = "perfect" | "slightly-stretched" | "overstretched" | "rushed";

const getAttractionCount = (destination: string): number => {
  const key = destination.toLowerCase().trim();
  for (const [city, count] of Object.entries(CITY_ATTRACTIONS)) {
    if (key.includes(city) || city.includes(key)) return count;
  }
  return 10; // default
};

const getNearbyPlaces = (destination: string): string[] => {
  const key = destination.toLowerCase().trim();
  for (const [city, places] of Object.entries(NEARBY_PLACES)) {
    if (key.includes(city) || city.includes(key)) return places;
  }
  return [];
};

const TripQualityMeter = ({ destination, duration, onDurationChange }: TripQualityMeterProps) => {
  const [showNearby, setShowNearby] = useState(false);

  const attractions = getAttractionCount(destination);
  const idealMin = Math.ceil(attractions * 0.5);
  const idealMax = Math.ceil(attractions * 0.75);
  const nearby = getNearbyPlaces(destination);

  const getQuality = (): QualityState => {
    if (duration >= idealMin && duration <= idealMax) return "perfect";
    if (duration > idealMax && duration <= idealMax * 1.4) return "slightly-stretched";
    if (duration > idealMax * 1.4) return "overstretched";
    return "rushed";
  };

  const quality = getQuality();

  const config: Record<QualityState, { icon: typeof Check; label: string; message: string; color: string; bgColor: string; barColor: string; barWidth: string }> = {
    perfect: {
      icon: Check,
      label: "Perfect",
      message: "Great choice! Your trip duration is well balanced.",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
      barColor: "bg-emerald-500",
      barWidth: "75%",
    },
    "slightly-stretched": {
      icon: Scale,
      label: "Slightly Stretched",
      message: "Your trip may feel a bit stretched. You might have extra free time.",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      barColor: "bg-amber-500",
      barWidth: "55%",
    },
    overstretched: {
      icon: AlertTriangle,
      label: "Overstretched",
      message: "Your trip is longer than needed for this destination.",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
      barColor: "bg-orange-500",
      barWidth: "35%",
    },
    rushed: {
      icon: Zap,
      label: "Rushed",
      message: "Your trip might feel rushed. You may not cover all attractions.",
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      barColor: "bg-red-500",
      barWidth: "90%",
    },
  };

  const c = config[quality];
  const Icon = c.icon;

  const smartMessage = quality === "perfect"
    ? "Your trip looks perfectly planned 🎯"
    : quality === "overstretched" || quality === "slightly-stretched"
    ? "You have extra time — consider exploring nearby destinations"
    : "Your itinerary may feel rushed — consider adding 1–2 more days";

  return (
    <div className="space-y-4 animate-fade-up mt-6">
      {/* AI Insight Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Insight</span>
      </div>

      {/* Quality Meter Card */}
      <div className={cn("rounded-2xl border p-4 transition-all", c.bgColor)}>
        <div className="flex items-start gap-3">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", c.bgColor)}>
            <Icon className={cn("w-5 h-5", c.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("font-semibold text-sm", c.color)}>{c.label}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{attractions} attractions</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.message}</p>

            {/* Quality Bar */}
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-700", c.barColor)} style={{ width: c.barWidth }} />
            </div>
          </div>
        </div>
      </div>

      {/* Ideal Duration Suggestion */}
      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0 h-4">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Suggested
              </Badge>
            </div>
            <p className="text-sm text-foreground font-medium">
              Ideal duration: <strong>{idealMin}–{idealMax} days</strong>
            </p>
          </div>
          {(duration < idealMin || duration > idealMax) && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs h-8"
              onClick={() => onDurationChange(idealMin)}
            >
              Apply {idealMin}d
            </Button>
          )}
        </div>
      </div>

      {/* Smart Summary */}
      <p className="text-xs text-muted-foreground italic text-center">{smartMessage}</p>

      {/* Nearby Destinations (if overstretched) */}
      {(quality === "overstretched" || quality === "slightly-stretched") && nearby.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <button
            onClick={() => setShowNearby(!showNearby)}
            className="flex items-center gap-2 w-full text-left"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Explore nearby destinations</span>
            <ArrowRight className={cn("w-4 h-4 text-muted-foreground ml-auto transition-transform", showNearby && "rotate-90")} />
          </button>
          {showNearby && (
            <div className="flex flex-wrap gap-2 animate-fade-up">
              {nearby.map((place) => (
                <Badge
                  key={place}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-xs py-1"
                >
                  {place}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripQualityMeter;
