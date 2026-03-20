import { Button } from "@/components/ui/button";
import { User, Heart, Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = [
  { value: "solo", label: "Solo", icon: User, desc: "Independent exploration" },
  { value: "couple", label: "Couple", icon: Heart, desc: "Romantic getaway" },
  { value: "family", label: "Family", icon: Users, desc: "Safe & comfortable" },
  { value: "friends", label: "Friends", icon: UserPlus, desc: "Adventure & fun" },
];

interface TravelStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TravelStyleSelector = ({ value, onChange }: TravelStyleSelectorProps) => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Who's traveling?</h2>
        <p className="text-muted-foreground">This helps AI personalize recommendations</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STYLES.map((style) => {
          const Icon = style.icon;
          const isSelected = value === style.value;
          return (
            <button
              key={style.value}
              onClick={() => onChange(style.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                isSelected ? "bg-primary/10" : "bg-muted"
              )}>
                <Icon className={cn("w-6 h-6", isSelected ? "text-primary" : "text-muted-foreground")} />
              </div>
              <span className={cn("font-semibold text-sm", isSelected ? "text-primary" : "text-foreground")}>
                {style.label}
              </span>
              <span className="text-xs text-muted-foreground">{style.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TravelStyleSelector;
