import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shuffle, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SURPRISE_DESTINATIONS = [
  { city: "Goa", country: "India", emoji: "🏖️", vibe: "Beach Paradise", duration: 5, budget: 800 },
  { city: "Manali", country: "India", emoji: "🏔️", vibe: "Mountain Escape", duration: 4, budget: 600 },
  { city: "Jaipur", country: "India", emoji: "🏰", vibe: "Royal Heritage", duration: 3, budget: 500 },
  { city: "Bali", country: "Indonesia", emoji: "🌴", vibe: "Tropical Bliss", duration: 7, budget: 1500 },
  { city: "Paris", country: "France", emoji: "🗼", vibe: "City of Love", duration: 5, budget: 3000 },
  { city: "Tokyo", country: "Japan", emoji: "🗾", vibe: "Culture & Tech", duration: 6, budget: 2500 },
  { city: "Rishikesh", country: "India", emoji: "🧘", vibe: "Spiritual Retreat", duration: 4, budget: 400 },
  { city: "Dubai", country: "UAE", emoji: "🌆", vibe: "Luxury & Adventure", duration: 5, budget: 3500 },
  { city: "Udaipur", country: "India", emoji: "💎", vibe: "Romantic Lakeside", duration: 3, budget: 700 },
  { city: "Swiss Alps", country: "Switzerland", emoji: "⛷️", vibe: "Snow Adventure", duration: 6, budget: 4000 },
  { city: "Kerala", country: "India", emoji: "🌿", vibe: "Nature & Wellness", duration: 5, budget: 700 },
  { city: "Santorini", country: "Greece", emoji: "🌅", vibe: "Island Romance", duration: 5, budget: 2800 },
];

interface SurpriseMeProps {
  onSelect: (destination: string, duration: number, budget: number) => void;
}

const SurpriseMe = ({ onSelect }: SurpriseMeProps) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealed, setRevealed] = useState<typeof SURPRISE_DESTINATIONS[0] | null>(null);
  const [shuffleIndex, setShuffleIndex] = useState(0);

  const handleSurprise = () => {
    setIsRevealing(true);
    setRevealed(null);

    let count = 0;
    const interval = setInterval(() => {
      setShuffleIndex(Math.floor(Math.random() * SURPRISE_DESTINATIONS.length));
      count++;
      if (count > 12) {
        clearInterval(interval);
        const pick = SURPRISE_DESTINATIONS[Math.floor(Math.random() * SURPRISE_DESTINATIONS.length)];
        setRevealed(pick);
        setIsRevealing(false);
      }
    }, 150);
  };

  const shuffled = SURPRISE_DESTINATIONS[shuffleIndex];

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
      <CardContent className="p-6 text-center">
        {!isRevealing && !revealed && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Shuffle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Feeling Adventurous?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Let AI pick a surprise destination for you!
              </p>
            </div>
            <Button variant="travel" className="gap-2" onClick={handleSurprise}>
              <Sparkles className="w-4 h-4" />
              Surprise Me!
            </Button>
          </div>
        )}

        {isRevealing && (
          <div className="space-y-4 animate-pulse">
            <div className="text-6xl">{shuffled.emoji}</div>
            <p className="text-lg font-bold text-foreground">{shuffled.city}</p>
            <p className="text-sm text-muted-foreground">Finding your perfect destination...</p>
          </div>
        )}

        {revealed && !isRevealing && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-6xl animate-bounce">{revealed.emoji}</div>
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">{revealed.vibe}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {revealed.city}, {revealed.country}
              </h3>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>{revealed.duration} days</span>
              <span>•</span>
              <span>~${revealed.budget}</span>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                variant="travel"
                className="gap-2"
                onClick={() => onSelect(revealed.city, revealed.duration, revealed.budget)}
              >
                <ArrowRight className="w-4 h-4" />
                Plan This Trip
              </Button>
              <Button variant="outline" className="gap-2 rounded-xl" onClick={handleSurprise}>
                <Shuffle className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurpriseMe;
