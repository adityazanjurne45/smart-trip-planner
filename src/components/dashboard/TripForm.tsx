import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Calendar, Wallet, Sparkles, Loader2 } from "lucide-react";
import { TripDetails } from "@/types/trip";
import { z } from "zod";

const tripSchema = z.object({
  boardingPoint: z.string().min(2, "Boarding point is required").max(100),
  destinationPoint: z.string().min(2, "Destination is required").max(100),
  duration: z.number().min(1, "Duration must be at least 1 day").max(30, "Duration cannot exceed 30 days"),
  budget: z.number().min(100, "Budget must be at least $100").max(100000, "Budget cannot exceed $100,000"),
});

interface TripFormProps {
  onSubmit: (details: TripDetails) => void;
}

const TripForm = ({ onSubmit }: TripFormProps) => {
  const [boardingPoint, setBoardingPoint] = useState("");
  const [destinationPoint, setDestinationPoint] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      boardingPoint: boardingPoint.trim(),
      destinationPoint: destinationPoint.trim(),
      duration: parseInt(duration) || 0,
      budget: parseInt(budget) || 0,
    };

    try {
      tripSchema.parse(data);
      setErrors({});
      onSubmit(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="travel-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Trip Details</h2>
          <p className="text-muted-foreground text-sm">Fill in your travel information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Boarding Point */}
          <div className="space-y-2">
            <Label htmlFor="boardingPoint" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Boarding Point
            </Label>
            <Input
              id="boardingPoint"
              placeholder="e.g., New York, USA"
              value={boardingPoint}
              onChange={(e) => setBoardingPoint(e.target.value)}
              className="h-12 rounded-xl"
            />
            {errors.boardingPoint && (
              <p className="text-sm text-destructive">{errors.boardingPoint}</p>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destinationPoint" className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-accent" />
              Destination
            </Label>
            <Input
              id="destinationPoint"
              placeholder="e.g., Paris, France"
              value={destinationPoint}
              onChange={(e) => setDestinationPoint(e.target.value)}
              className="h-12 rounded-xl"
            />
            {errors.destinationPoint && (
              <p className="text-sm text-destructive">{errors.destinationPoint}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-travel-forest" />
              Trip Duration (days)
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g., 7"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-12 rounded-xl"
            />
            {errors.duration && (
              <p className="text-sm text-destructive">{errors.duration}</p>
            )}
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-travel-gold" />
              Budget (USD)
            </Label>
            <Input
              id="budget"
              type="number"
              placeholder="e.g., 2000"
              min="100"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="h-12 rounded-xl"
            />
            {errors.budget && (
              <p className="text-sm text-destructive">{errors.budget}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="travel"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Recommendations...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Get AI Recommendations
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default TripForm;
