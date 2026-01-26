import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/layout/Navbar";
import TripForm from "@/components/dashboard/TripForm";
import TripRecommendations from "@/components/dashboard/TripRecommendations";
import { Loader2 } from "lucide-react";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {tripDetails ? "Your Trip Recommendations" : "Plan Your Trip"}
            </h1>
            <p className="text-muted-foreground">
              {tripDetails
                ? `AI-powered recommendations for your trip from ${tripDetails.boardingPoint} to ${tripDetails.destinationPoint}`
                : "Enter your trip details and let our AI find the best options for you"}
            </p>
          </div>

          {/* Content */}
          {!tripDetails ? (
            <TripForm onSubmit={handleTripSubmit} />
          ) : (
            <TripRecommendations
              tripDetails={tripDetails}
              recommendations={recommendations}
              isGenerating={isGenerating}
              onGenerated={handleRecommendationsGenerated}
              onNewTrip={handleNewTrip}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
