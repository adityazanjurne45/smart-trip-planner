import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/layout/Navbar";
import TripWizard from "@/components/dashboard/TripWizard";
import TripRecommendations from "@/components/dashboard/TripRecommendations";
import AIAssistant from "@/components/dashboard/AIAssistant";
import { Loader2, MapPin, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { TripDetails, Recommendations } from "@/types/trip";

const PlanTrip = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const { profile } = useProfile(user?.id);

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
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Plan Your Trip
                </h1>
                <p className="text-muted-foreground">
                  Let our AI create the perfect travel plan for you
                </p>
              </div>
            </div>
            {profile && !tripDetails && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mt-4">
                <Sparkles className="w-4 h-4" />
                AI Personalization Active
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {!tripDetails ? (
              <div className="bg-card rounded-2xl border border-border shadow-soft p-8">
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

export default PlanTrip;
