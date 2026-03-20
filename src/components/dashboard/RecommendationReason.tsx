import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationReasonProps {
  reasons: string[];
  className?: string;
}

const RecommendationReason = ({ reasons, className }: RecommendationReasonProps) => {
  if (!reasons.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5 mt-2", className)}>
      {reasons.map((reason, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-primary/5 text-primary border border-primary/10"
        >
          <Sparkles className="w-2.5 h-2.5" />
          {reason}
        </span>
      ))}
    </div>
  );
};

export function getPlaceReasons(place: { entryFee: string; crowdLevel?: string; bestTimeToVisit?: string }): string[] {
  const reasons: string[] = [];
  if (place.entryFee?.toLowerCase().includes("free")) reasons.push("Free entry");
  if (place.crowdLevel === "low") reasons.push("Low crowd");
  if (place.bestTimeToVisit) reasons.push("Best time matched");
  if (!reasons.length) reasons.push("Matches your itinerary");
  return reasons;
}

export function getHotelReasons(hotel: { pricePerNight: string; rating: string; isBestLocation?: boolean; isEcoFriendly?: boolean }, budget: number, duration: number): string[] {
  const reasons: string[] = [];
  const price = parseInt(hotel.pricePerNight.replace(/[^0-9]/g, "")) || 0;
  const dailyBudget = budget / duration;
  if (price > 0 && price <= dailyBudget * 0.4) reasons.push("Fits your budget");
  if (parseFloat(hotel.rating) >= 4) reasons.push("Highly rated");
  if (hotel.isBestLocation) reasons.push("Great location");
  if (hotel.isEcoFriendly) reasons.push("Eco-friendly");
  if (!reasons.length) reasons.push("AI recommended");
  return reasons;
}

export function getVehicleReasons(vehicle: { isEcoFriendly?: boolean; suitableFor: string }): string[] {
  const reasons: string[] = [];
  if (vehicle.isEcoFriendly) reasons.push("Eco-friendly option");
  if (vehicle.suitableFor) reasons.push(`Best for ${vehicle.suitableFor.split(",")[0].trim().toLowerCase()}`);
  if (!reasons.length) reasons.push("Recommended for this route");
  return reasons;
}

export default RecommendationReason;
