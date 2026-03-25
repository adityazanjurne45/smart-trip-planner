import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const MOODS = [
  { value: "chill", label: "Chill", emoji: "😌", desc: "Cafes, lakes & sunset points", color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500" },
  { value: "adventure", label: "Adventure", emoji: "⚡", desc: "Trekking, rafting & hiking", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500" },
  { value: "romantic", label: "Romantic", emoji: "❤️", desc: "Scenic views & couple spots", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500" },
  { value: "spiritual", label: "Spiritual", emoji: "🧘", desc: "Temples & peaceful retreats", color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500" },
];

interface TripMoodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TripMoodSelector = ({ value, onChange }: TripMoodSelectorProps) => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">What's your travel mood?</h2>
        <p className="text-muted-foreground">AI will tailor places & activities to match your vibe</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MOODS.map((mood) => {
          const isSelected = value === mood.value;
          return (
            <button
              key={mood.value}
              onClick={() => onChange(mood.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all",
                isSelected
                  ? `${mood.border} ${mood.bg} shadow-sm`
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className={cn("font-semibold text-sm", isSelected ? mood.color : "text-foreground")}>
                {mood.label}
              </span>
              <span className="text-xs text-muted-foreground text-center">{mood.desc}</span>
            </button>
          );
        })}
      </div>

      {value && (
        <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 rounded-lg px-3 py-2 border border-primary/10 animate-fade-in">
          <Sparkles className="w-3 h-3" />
          AI will prioritize {MOODS.find(m => m.value === value)?.desc.toLowerCase()} for your trip
        </div>
      )}
    </div>
  );
};

export default TripMoodSelector;
