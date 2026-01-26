import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TripDetails, Recommendations } from "@/pages/Dashboard";
import { MapPin, Building2, Car, ArrowLeft, Loader2, Clock, DollarSign, Star, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TripRecommendationsProps {
  tripDetails: TripDetails;
  recommendations: Recommendations | null;
  isGenerating: boolean;
  onGenerated: (recs: Recommendations) => void;
  onNewTrip: () => void;
}

const TripRecommendations = ({
  tripDetails,
  recommendations,
  isGenerating,
  onGenerated,
  onNewTrip,
}: TripRecommendationsProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (isGenerating && !recommendations) {
      generateRecommendations();
    }
  }, [isGenerating]);

  const generateRecommendations = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-trip-recommendations", {
        body: tripDetails,
      });

      if (error) {
        console.error("Edge function error:", error);
        if (error.message?.includes("429")) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment and try again.",
            variant: "destructive",
          });
        } else if (error.message?.includes("402")) {
          toast({
            title: "Usage limit reached",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        onGenerated({
          touristPlaces: [],
          hotels: [],
          vehicles: [],
          summary: "Unable to generate recommendations at this time. Please try again later.",
        });
        return;
      }

      if (data?.recommendations) {
        onGenerated(data.recommendations);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
      onGenerated({
        touristPlaces: [],
        hotels: [],
        vehicles: [],
        summary: "Unable to generate recommendations at this time. Please try again later.",
      });
    }
  };

  if (isGenerating) {
    return (
      <div className="travel-card p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Generating Your Trip Plan
            </h3>
            <p className="text-muted-foreground">
              Our AI is finding the best recommendations for your trip from {tripDetails.boardingPoint} to {tripDetails.destinationPoint}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Trip Summary */}
      <div className="travel-card p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <Navigation className="w-4 h-4" />
              Your Trip Summary
            </div>
            <p className="text-foreground">{recommendations.summary}</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-foreground">{tripDetails.duration}</div>
              <div className="text-muted-foreground">Days</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground">${tripDetails.budget}</div>
              <div className="text-muted-foreground">Budget</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tourist Places */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-travel-coral/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-travel-coral" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Tourist Places</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.touristPlaces.map((place, index) => (
            <div key={index} className="travel-card p-5">
              <h3 className="font-semibold text-foreground mb-2">{place.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{place.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {place.estimatedTime}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  {place.entryFee}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotels */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Recommended Hotels</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.hotels.map((hotel, index) => (
            <div key={index} className="travel-card p-5">
              <h3 className="font-semibold text-foreground mb-1">{hotel.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{hotel.location}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-travel-gold fill-travel-gold" />
                  <span className="text-foreground font-medium">{hotel.rating}</span>
                </div>
                <div className="text-primary font-semibold">{hotel.pricePerNight}/night</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicles */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-travel-forest/10 flex items-center justify-center">
            <Car className="w-5 h-5 text-travel-forest" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Transportation Options</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.vehicles.map((vehicle, index) => (
            <div key={index} className="travel-card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{vehicle.type}</h3>
                <span className="text-primary font-semibold">{vehicle.estimatedCost}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-2">{vehicle.reason}</p>
              <p className="text-xs text-muted-foreground">Best for: {vehicle.suitableFor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-4">
        <Button variant="travel-outline" onClick={onNewTrip}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Plan Another Trip
        </Button>
      </div>
    </div>
  );
};

export default TripRecommendations;
