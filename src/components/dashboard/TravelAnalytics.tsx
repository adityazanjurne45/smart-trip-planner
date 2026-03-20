import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Wallet, TrendingUp, Globe, BarChart3 } from "lucide-react";
import { PastTrip } from "@/types/profile";

interface TravelAnalyticsProps {
  trips: PastTrip[];
}

const TravelAnalytics = ({ trips }: TravelAnalyticsProps) => {
  const totalTrips = trips.length;
  const totalDays = trips.reduce((sum, t) => sum + t.duration, 0);
  const avgBudget = totalTrips > 0 ? Math.round(trips.reduce((sum, t) => sum + t.budget, 0) / totalTrips) : 0;
  const uniqueCities = new Set(trips.map((t) => t.destination)).size;
  const avgRating = trips.filter((t) => t.rating).length > 0
    ? (trips.filter((t) => t.rating).reduce((s, t) => s + (t.rating || 0), 0) / trips.filter((t) => t.rating).length).toFixed(1)
    : "N/A";

  // Most visited destinations
  const destCounts: Record<string, number> = {};
  trips.forEach((t) => { destCounts[t.destination] = (destCounts[t.destination] || 0) + 1; });
  const topDestinations = Object.entries(destCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Monthly distribution
  const monthCounts: Record<string, number> = {};
  trips.forEach((t) => {
    const month = new Date(t.trip_date).toLocaleString("en-US", { month: "short" });
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });

  const stats = [
    { icon: MapPin, label: "Total Trips", value: totalTrips, color: "text-primary", bg: "bg-primary/10" },
    { icon: Globe, label: "Cities Visited", value: uniqueCities, color: "text-accent", bg: "bg-accent/10" },
    { icon: Clock, label: "Days Traveled", value: totalDays, color: "text-travel-coral", bg: "bg-travel-coral/10" },
    { icon: Wallet, label: "Avg Budget", value: `$${avgBudget}`, color: "text-travel-gold", bg: "bg-travel-gold/10" },
    { icon: TrendingUp, label: "Avg Rating", value: avgRating, color: "text-travel-forest", bg: "bg-travel-forest/10" },
    { icon: BarChart3, label: "Total Spent", value: `$${trips.reduce((s, t) => s + t.budget, 0)}`, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border shadow-soft">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Destinations */}
      {topDestinations.length > 0 && (
        <Card className="border-border shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Top Destinations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topDestinations.map(([dest, count], i) => (
              <div key={dest} className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary w-6">{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{dest}</span>
                    <span className="text-xs text-muted-foreground">{count} trip{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(count / totalTrips) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Travel Months */}
      {Object.keys(monthCounts).length > 0 && (
        <Card className="border-border shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              Travel by Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-24">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => {
                const count = monthCounts[m] || 0;
                const maxCount = Math.max(...Object.values(monthCounts), 1);
                const height = count > 0 ? Math.max((count / maxCount) * 100, 10) : 4;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${count > 0 ? "bg-primary" : "bg-muted"}`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[9px] text-muted-foreground">{m}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TravelAnalytics;
