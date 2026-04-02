import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/layout/Navbar";
import { Loader2, MapPin, Clock, Wallet, TrendingUp, Plus, Compass, Calendar, ArrowRight, Sparkles, BarChart3 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TravelAnalytics from "@/components/dashboard/TravelAnalytics";
import Achievements from "@/components/dashboard/Achievements";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { profile, pastTrips, loading: profileLoading } = useProfile(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    {
      icon: MapPin,
      label: "Trips Planned",
      value: pastTrips?.length || 0,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      label: "Days Traveled",
      value: pastTrips?.reduce((acc, trip) => acc + trip.duration, 0) || 0,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Wallet,
      label: "Avg Budget",
      value: pastTrips?.length
        ? `$${Math.round(pastTrips.reduce((acc, trip) => acc + trip.budget, 0) / pastTrips.length)}`
        : "$0",
      color: "text-travel-gold",
      bgColor: "bg-travel-gold/10",
    },
    {
      icon: TrendingUp,
      label: "Avg Rating",
      value: pastTrips?.filter(t => t.rating).length
        ? (pastTrips.filter(t => t.rating).reduce((acc, trip) => acc + (trip.rating || 0), 0) / pastTrips.filter(t => t.rating).length).toFixed(1)
        : "N/A",
      color: "text-travel-forest",
      bgColor: "bg-travel-forest/10",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'Traveler'}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome to your travel dashboard
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <Link to="/plan-trip" className="group">
              <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 hover:border-primary/40 transition-all hover:shadow-medium cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Plan New Trip</h3>
                    <p className="text-sm text-muted-foreground">Start your next adventure with AI</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/my-trips" className="group">
              <Card className="bg-gradient-to-br from-accent/10 to-travel-gold/5 border-accent/20 hover:border-accent/40 transition-all hover:shadow-medium cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Compass className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">View My Trips</h3>
                    <p className="text-sm text-muted-foreground">Browse your travel history</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-card border-border shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Trips Section */}
          <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Trips</h2>
              {pastTrips && pastTrips.length > 0 && (
                <Link to="/my-trips">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>

            {!pastTrips || pastTrips.length === 0 ? (
              <Card className="border-border shadow-soft">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Compass className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Trips Yet
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                    You haven't planned any trips yet. Start planning your first adventure!
                  </p>
                  <Link to="/plan-trip">
                    <Button variant="travel" className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Plan Your First Trip
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastTrips.slice(0, 3).map((trip, index) => (
                  <Card 
                    key={trip.id} 
                    className="border-border shadow-soft hover:shadow-medium transition-all"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm truncate max-w-[140px]">
                              {trip.destination}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              From {trip.boarding_point}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {trip.duration}d
                        </span>
                        <span className="flex items-center gap-1">
                          <Wallet className="w-3 h-3" />
                          ${trip.budget}
                        </span>
                        <span>{formatDate(trip.trip_date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          {/* Travel Analytics */}
          {pastTrips && pastTrips.length > 0 && (
            <div className="mt-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Travel Analytics</h2>
              </div>
              <TravelAnalytics trips={pastTrips} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
