import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripDetails, Recommendations } from "@/pages/Dashboard";
import { MapPin, Building2, Car, ArrowLeft, Loader2, Clock, DollarSign, Star, Navigation, Save, Check, Calendar, Map, List, MapPinned } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import WeatherCard from "./WeatherCard";
import DayWiseItinerary from "./DayWiseItinerary";
import TripWarnings from "./TripWarnings";
import TripActions from "./TripActions";
import TripMap from "./TripMap";
import { UserProfile } from "@/types/profile";

interface TripRecommendationsProps {
  tripDetails: TripDetails;
  recommendations: Recommendations | null;
  isGenerating: boolean;
  onGenerated: (recs: Recommendations) => void;
  onNewTrip: () => void;
  userProfile?: UserProfile | null;
}

const TripRecommendations = ({
  tripDetails,
  recommendations,
  isGenerating,
  onGenerated,
  onNewTrip,
  userProfile,
}: TripRecommendationsProps) => {
  const { toast } = useToast();
  const [tripSaved, setTripSaved] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [weather, setWeather] = useState<{ temp: number; condition: string } | undefined>();

  useEffect(() => {
    if (isGenerating && !recommendations) {
      generateRecommendations();
    }
  }, [isGenerating]);

  const generateRecommendations = async () => {
    try {
      // Build user preferences object
      const userPreferences = userProfile ? {
        travel_style: userProfile.travel_style,
        accommodation_type: userProfile.accommodation_type,
        transportation_choice: userProfile.transportation_choice,
        traffic_sensitivity: userProfile.traffic_sensitivity,
        food_preference: userProfile.food_preference,
        language_preference: userProfile.language_preference,
        budget_range_min: userProfile.budget_range_min,
        budget_range_max: userProfile.budget_range_max,
      } : undefined;

      const { data, error } = await supabase.functions.invoke("generate-trip-recommendations", {
        body: { ...tripDetails, userPreferences },
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

  const saveToHistory = async () => {
    setSavingTrip(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from('past_trips').insert({
        user_id: user.id,
        destination: tripDetails.destinationPoint,
        boarding_point: tripDetails.boardingPoint,
        duration: tripDetails.duration,
        budget: tripDetails.budget,
        trip_date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;

      setTripSaved(true);
      toast({
        title: "Trip saved!",
        description: "This trip has been added to your history.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingTrip(false);
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
              {userProfile && (
                <span className="block mt-1 text-sm text-primary">
                  Personalizing based on your travel preferences
                </span>
              )}
            </p>
          </div>
          {/* Progress animation */}
          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Button variant="ghost" onClick={onNewTrip} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          New Trip
        </Button>
        <TripActions
          tripDetails={tripDetails}
          recommendations={recommendations}
          onSaveTrip={saveToHistory}
          isSaving={savingTrip}
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="gap-2">
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <MapPinned className="w-4 h-4" />
            <span className="hidden sm:inline">Map</span>
          </TabsTrigger>
          <TabsTrigger value="itinerary" className="gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Day-by-Day</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Details</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          {/* Weather & Trip Summary Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weather Card */}
            <WeatherCard destination={tripDetails.destinationPoint} onWeatherLoad={setWeather} />
            
            {/* Trip Summary */}
            <div className="travel-card p-6 bg-primary/5 border-primary/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary font-medium mb-2">
                  <Navigation className="w-4 h-4" />
                  Your Trip Summary
                </div>
                <p className="text-foreground">{recommendations.summary}</p>
              </div>
              <div className="flex gap-6 text-sm mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{tripDetails.duration}</div>
                  <div className="text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">${tripDetails.budget}</div>
                  <div className="text-muted-foreground">Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{recommendations.touristPlaces.length}</div>
                  <div className="text-muted-foreground">Places</div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Warnings */}
          <TripWarnings
            tripDetails={tripDetails}
            recommendations={recommendations}
            weather={weather}
          />

          {/* Quick View Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="travel-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-travel-coral/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-travel-coral" />
                </div>
                <span className="font-medium text-foreground">Top Attractions</span>
              </div>
              <ul className="space-y-2">
                {recommendations.touristPlaces.slice(0, 3).map((place, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-medium">{i + 1}.</span>
                    {place.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="travel-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Best Hotels</span>
              </div>
              <ul className="space-y-2">
                {recommendations.hotels.slice(0, 3).map((hotel, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center justify-between">
                    <span className="truncate">{hotel.name}</span>
                    <span className="text-primary font-medium">{hotel.pricePerNight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="travel-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-travel-forest/10 flex items-center justify-center">
                  <Car className="w-4 h-4 text-travel-forest" />
                </div>
                <span className="font-medium text-foreground">Transport</span>
              </div>
              <ul className="space-y-2">
                {recommendations.vehicles.map((vehicle, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center justify-between">
                    <span>{vehicle.type}</span>
                    <span className="text-travel-forest font-medium">{vehicle.estimatedCost}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="animate-fade-in">
          <TripMap tripDetails={tripDetails} recommendations={recommendations} />
        </TabsContent>

        {/* Day-by-Day Itinerary Tab */}
        <TabsContent value="itinerary" className="animate-fade-in">
          <DayWiseItinerary
            tripDetails={tripDetails}
            recommendations={recommendations}
            weather={weather}
          />
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-8 animate-fade-in">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripRecommendations;
