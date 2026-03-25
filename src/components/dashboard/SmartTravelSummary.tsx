import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { TripDetails, Recommendations } from "@/types/trip";
import { cn } from "@/lib/utils";

interface SmartTravelSummaryProps {
  tripDetails: TripDetails;
  recommendations: Recommendations;
}

function generateSummary(tripDetails: TripDetails, recommendations: Recommendations) {
  const { duration, budget, travelMood } = tripDetails;
  const placeCount = recommendations.touristPlaces.length;
  const dailyBudget = budget / duration;
  const ratio = placeCount > 0 ? duration / placeCount : 1;

  const insights: { emoji: string; text: string; tone: "positive" | "neutral" | "caution" }[] = [];

  // Pacing analysis
  if (ratio >= 0.8 && ratio <= 1.5) {
    insights.push({ emoji: "🎯", text: "Your trip is perfectly balanced — great pacing!", tone: "positive" });
  } else if (ratio > 1.5) {
    insights.push({ emoji: "🧘", text: "You have extra free time — perfect for spontaneous exploration.", tone: "neutral" });
  } else {
    insights.push({ emoji: "⚡", text: "Your itinerary is a bit packed — consider relaxing your schedule.", tone: "caution" });
  }

  // Budget insight
  if (dailyBudget >= 200) {
    insights.push({ emoji: "✨", text: "Generous budget — enjoy premium experiences!", tone: "positive" });
  } else if (dailyBudget >= 80) {
    insights.push({ emoji: "💰", text: "Comfortable budget for a balanced trip.", tone: "positive" });
  } else {
    insights.push({ emoji: "💡", text: "Budget-friendly trip — our AI picked the best value options.", tone: "neutral" });
  }

  // Mood insight
  if (travelMood) {
    const moodMessages: Record<string, string> = {
      chill: "🏖️ Relaxation-focused picks to help you unwind.",
      adventure: "🏔️ Thrilling activities handpicked for your adventurous spirit!",
      romantic: "💕 Curated romantic spots for unforgettable moments.",
      spiritual: "🕊️ Peaceful & spiritual destinations for inner calm.",
    };
    insights.push({ emoji: "", text: moodMessages[travelMood] || "", tone: "positive" });
  }

  return insights.filter(i => i.text);
}

const SmartTravelSummary = ({ tripDetails, recommendations }: SmartTravelSummaryProps) => {
  const insights = generateSummary(tripDetails, recommendations);

  return (
    <Card className="travel-card border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">AI Travel Summary</span>
        </div>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "text-sm rounded-lg px-3 py-2",
                insight.tone === "positive" && "bg-travel-forest/5 text-travel-forest",
                insight.tone === "neutral" && "bg-primary/5 text-foreground",
                insight.tone === "caution" && "bg-travel-gold/10 text-travel-gold"
              )}
            >
              {insight.text}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartTravelSummary;
