import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, MapPin, Wallet, Star, Compass, Globe, Mountain, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementsProps {
  tripsCount: number;
  citiesVisited: number;
  avgBudget: number;
  avgRating: number;
}

const BADGES = [
  { id: "first_trip", icon: MapPin, label: "First Trip", desc: "Planned your first adventure", color: "text-primary", bg: "bg-primary/10", unlock: (p: AchievementsProps) => p.tripsCount >= 1 },
  { id: "explorer", icon: Compass, label: "Explorer", desc: "Planned 5+ trips", color: "text-accent", bg: "bg-accent/10", unlock: (p: AchievementsProps) => p.tripsCount >= 5 },
  { id: "globetrotter", icon: Globe, label: "Globetrotter", desc: "Visited 10+ cities", color: "text-travel-coral", bg: "bg-travel-coral/10", unlock: (p: AchievementsProps) => p.citiesVisited >= 10 },
  { id: "budget_pro", icon: Wallet, label: "Budget Traveler", desc: "Avg budget under $500", color: "text-travel-forest", bg: "bg-travel-forest/10", unlock: (p: AchievementsProps) => p.tripsCount >= 1 && p.avgBudget < 500 },
  { id: "luxury", icon: Star, label: "Luxury Explorer", desc: "Avg budget over $3000", color: "text-travel-gold", bg: "bg-travel-gold/10", unlock: (p: AchievementsProps) => p.tripsCount >= 1 && p.avgBudget > 3000 },
  { id: "high_rated", icon: Heart, label: "Top Reviewer", desc: "Avg rating 4+", color: "text-rose-500", bg: "bg-rose-500/10", unlock: (p: AchievementsProps) => p.avgRating >= 4 },
  { id: "adventurer", icon: Mountain, label: "Adventurer", desc: "Planned 3+ trips", color: "text-violet-500", bg: "bg-violet-500/10", unlock: (p: AchievementsProps) => p.tripsCount >= 3 },
  { id: "veteran", icon: Trophy, label: "Travel Veteran", desc: "Planned 10+ trips", color: "text-amber-500", bg: "bg-amber-500/10", unlock: (p: AchievementsProps) => p.tripsCount >= 10 },
];

const Achievements = (props: AchievementsProps) => {
  const unlocked = BADGES.filter((b) => b.unlock(props));
  const locked = BADGES.filter((b) => !b.unlock(props));

  return (
    <Card className="travel-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-travel-gold" />
          Achievements
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">
            {unlocked.length}/{BADGES.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = badge.unlock(props);
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center",
                  isUnlocked
                    ? `${badge.bg} border-transparent shadow-sm`
                    : "bg-muted/30 border-dashed border-border opacity-50"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isUnlocked ? badge.bg : "bg-muted")}>
                  <Icon className={cn("w-5 h-5", isUnlocked ? badge.color : "text-muted-foreground")} />
                </div>
                <span className={cn("text-xs font-semibold", isUnlocked ? "text-foreground" : "text-muted-foreground")}>
                  {badge.label}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">{badge.desc}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
