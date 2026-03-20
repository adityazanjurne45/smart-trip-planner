import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, Check, Download } from "lucide-react";
import { TripDetails, Recommendations } from "@/types/trip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface OfflineTripToggleProps {
  tripDetails: TripDetails;
  recommendations: Recommendations;
}

const STORAGE_KEY = "travello_offline_trips";

const OfflineTripToggle = ({ tripDetails, recommendations }: OfflineTripToggleProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const tripKey = `${tripDetails.boardingPoint}-${tripDetails.destinationPoint}-${tripDetails.startDate || ""}`;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      setIsSaved(!!saved[tripKey]);
    } catch {
      setIsSaved(false);
    }
  }, [tripKey]);

  const toggleOffline = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (isSaved) {
        delete saved[tripKey];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        setIsSaved(false);
        toast({ title: "Removed from offline", description: "Trip data cleared from local storage." });
      } else {
        saved[tripKey] = {
          tripDetails,
          recommendations: {
            summary: recommendations.summary,
            touristPlaces: recommendations.touristPlaces,
            hotels: recommendations.hotels,
            vehicles: recommendations.vehicles,
            safetyInfo: recommendations.safetyInfo,
            cultureTips: recommendations.cultureTips,
            dayWiseItinerary: recommendations.dayWiseItinerary,
            costSavingTips: recommendations.costSavingTips,
          },
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        setIsSaved(true);
        toast({ title: "Saved for offline!", description: "You can access this trip without internet." });
      }
    } catch {
      toast({ title: "Error", description: "Could not save trip data.", variant: "destructive" });
    }
  };

  return (
    <Button
      variant={isSaved ? "default" : "outline"}
      size="sm"
      onClick={toggleOffline}
      className={cn("gap-2 rounded-xl", isSaved && "bg-travel-forest hover:bg-travel-forest/90")}
    >
      {isSaved ? (
        <>
          <Check className="w-4 h-4" />
          Saved Offline
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Save Offline
        </>
      )}
    </Button>
  );
};

export default OfflineTripToggle;
