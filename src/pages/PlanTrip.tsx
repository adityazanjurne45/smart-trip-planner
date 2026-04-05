import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/layout/Navbar";
import TripWizard from "@/components/dashboard/TripWizard";
import TripRecommendations from "@/components/dashboard/TripRecommendations";
import AIAssistant from "@/components/dashboard/AIAssistant";
import AIProcessingScreen from "@/components/dashboard/AIProcessingScreen";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { Loader2, MapPin, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { TripDetails, Recommendations } from "@/types/trip";
import SurpriseMe from "@/components/dashboard/SurpriseMe";

const PlanTrip = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showProcessingScreen, setShowProcessingScreen] = useState(false);
  const navigate = useNavigate();

  const { profile } = useProfile(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session?.user) navigate("/auth");
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleTripSubmit = (details: TripDetails) => {
    setTripDetails(details);
    setShowProcessingScreen(true);
    setIsGenerating(true);
  };

  const handleProcessingComplete = () => {};

  const handleRecommendationsGenerated = (recs: Recommendations) => {
    setRecommendations(recs);
    setIsGenerating(false);
    setShowProcessingScreen(false);
  };

  const handleNewTrip = () => {
    setTripDetails(null);
    setRecommendations(null);
    setShowProcessingScreen(false);
    setActiveTab("overview");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (showProcessingScreen && tripDetails && !recommendations) {
    return (
      <>
        <AIProcessingScreen tripDetails={tripDetails} onComplete={handleProcessingComplete} />
        <div style={{ display: 'none' }}>
          <TripRecommendations
            tripDetails={tripDetails}
            recommendations={recommendations}
            isGenerating={isGenerating}
            onGenerated={handleRecommendationsGenerated}
            onNewTrip={handleNewTrip}
            userProfile={profile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Plan Your Trip</h1>
                <p className="text-muted-foreground">Let our AI create the perfect travel plan for you</p>
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
          <div className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
            {!tripDetails ? (
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border shadow-soft p-8">
                  <TripWizard onSubmit={handleTripSubmit} />
                </div>
                <SurpriseMe
                  onSelect={(destination, duration, budget) => {
                    handleTripSubmit({
                      boardingPoint: "Your City",
                      destinationPoint: destination,
                      duration,
                      budget,
                    });
                  }}
                />
              </div>
            ) : (
              <ErrorBoundary fallbackMessage="Something went wrong loading your trip recommendations. Please try planning again.">
                <TripRecommendations
                  tripDetails={tripDetails}
                  recommendations={recommendations}
                  isGenerating={isGenerating}
                  onGenerated={handleRecommendationsGenerated}
                  onNewTrip={handleNewTrip}
                  userProfile={profile}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </ErrorBoundary>
            )}
          </div>
        </div>
      </main>

      {/* AI Travel Assistant */}
      <AIAssistant
        tripDetails={tripDetails ?? undefined}
        recommendations={recommendations ?? undefined}
        onTabRequest={(tab) => setActiveTab(tab)}
      />
    </div>
  );
};

export default PlanTrip;
