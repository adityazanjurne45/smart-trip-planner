import { Shield, MapPin, Phone, Users, Heart, User, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SAFETY_TIPS: Record<string, { tips: string[]; icon: typeof User; color: string; bgColor: string }> = {
  solo: {
    icon: User,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    tips: [
      "Avoid isolated areas at night",
      "Share your live location with someone you trust",
      "Keep emergency contacts saved and accessible",
      "Prefer well-reviewed and safe transport options",
      "Stay at popular, well-rated accommodations",
      "Keep digital and physical copies of important documents",
    ],
  },
  couple: {
    icon: Heart,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",
    tips: [
      "Choose safe and couple-friendly accommodations",
      "Avoid unsafe or unfamiliar areas, especially at night",
      "Keep important documents stored securely",
      "Research local customs regarding public behavior",
      "Book verified and reputable tour operators",
      "Share your itinerary with a family member",
    ],
  },
  family: {
    icon: Users,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    tips: [
      "Prioritize safe and kid-friendly locations",
      "Carry a basic medical kit for emergencies",
      "Avoid risky or adventure-heavy activities with children",
      "Plan emergency procedures for kids and elders",
      "Choose accommodations with family-friendly amenities",
      "Keep children's identification and medical info handy",
    ],
  },
  friends: {
    icon: UserPlus,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    tips: [
      "Avoid overly risky activities without proper safety gear",
      "Stay together when exploring unknown areas",
      "Practice responsible socializing and awareness",
      "Designate emergency meetup points",
      "Share itinerary and accommodation details with each other",
      "Keep a group emergency fund for unexpected situations",
    ],
  },
};

interface SafetyRecommendationsProps {
  travelStyle: string;
}

const SafetyRecommendations = ({ travelStyle }: SafetyRecommendationsProps) => {
  const data = SAFETY_TIPS[travelStyle];
  if (!data) return null;

  const Icon = data.icon;

  return (
    <div className="space-y-3 animate-fade-up mt-6">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Smart Safety Tips</span>
      </div>

      <div className={cn("rounded-2xl border p-4", data.bgColor)}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className={cn("w-5 h-5", data.color)} />
          <span className={cn("font-semibold text-sm capitalize", data.color)}>
            {travelStyle} Travel Safety
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 ml-auto">
            AI Generated
          </Badge>
        </div>

        <ul className="space-y-2">
          {data.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className={cn("mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0", data.color.replace("text-", "bg-"))} />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SafetyRecommendations;
