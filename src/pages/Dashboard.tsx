import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/layout/Navbar";
import TripWizard from "@/components/dashboard/TripWizard";
import TripRecommendations from "@/components/dashboard/TripRecommendations";
import AIAssistant from "@/components/dashboard/AIAssistant";
import { Loader2, Sparkles, MapPin, Clock, Wallet, TrendingUp } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";

export interface TripDetails {
  boardingPoint: string;
  destinationPoint: string;
  duration: number;
  budget: number;
}

export interface Recommendations {
  touristPlaces: {
    name: string;
    description: string;
    estimatedTime: string;
    entryFee: string;
  }[];
  hotels: {
    name: string;
    pricePerNight: string;
    rating: string;
    location: string;
  }[];
  vehicles: {
    type: string;
    reason: string;
    estimatedCost: string;
    suitableFor: string;
  }[];
  summary: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const { profile, pastTrips } = useProfile(user?.id);

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

  const handleTripSubmit = (details: TripDetails) => {
    setTripDetails(details);
    setIsGenerating(true);
  };

  const handleRecommendationsGenerated = (recs: Recommendations) => {
    setRecommendations(recs);
    setIsGenerating(false);
  };

  const handleNewTrip = () => {
    setTripDetails(null);
    setRecommendations(null);
  };

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

  if (loading) {
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
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'Traveler'}! 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                  {tripDetails
                    ? `Your trip from ${tripDetails.boardingPoint} to ${tripDetails.destinationPoint}`
                    : "Ready to plan your next adventure?"}
                </p>
              </div>
              {profile && !tripDetails && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  AI Personalization Active
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards - Show when not viewing recommendations */}
          {!tripDetails && pastTrips && pastTrips.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {stats.map((stat, index) => (
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
          )}

          {/* Main Content */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {!tripDetails ? (
              <div className="bg-card rounded-2xl border border-border shadow-soft p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Plan Your Trip</h2>
                  <p className="text-muted-foreground">
                    Enter your trip details and let our AI find the best options for you
                  </p>
                </div>
                <TripWizard onSubmit={handleTripSubmit} />
              </div>
            ) : (
              <TripRecommendations
                tripDetails={tripDetails}
                recommendations={recommendations}
                isGenerating={isGenerating}
                onGenerated={handleRecommendationsGenerated}
                onNewTrip={handleNewTrip}
                userProfile={profile}
              />
            )}
          </div>
        </div>
      </main>

      {/* AI Travel Assistant */}
      <AIAssistant tripDetails={tripDetails ?? undefined} recommendations={recommendations ?? undefined} />
    </div>
  );
};

export default Dashboard;
