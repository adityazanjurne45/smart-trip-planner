import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Backpack, Plus, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackingItem {
  id: string;
  text: string;
  checked: boolean;
  isAuto: boolean;
}

interface PackingChecklistProps {
  destination: string;
  duration: number;
  weather?: { temp: number; condition: string };
}

function generatePackingItems(
  destination: string,
  duration: number,
  weather?: { temp: number; condition: string }
): PackingItem[] {
  const items: string[] = [];

  // Essentials
  items.push("Passport / ID", "Phone charger & power bank", "Wallet & travel cards", "Travel insurance documents");

  // Weather-based
  if (weather) {
    if (weather.temp < 10) {
      items.push("Heavy jacket / winter coat", "Thermal innerwear", "Gloves & beanie", "Warm socks");
    } else if (weather.temp < 20) {
      items.push("Light jacket / sweater", "Layering clothes", "Comfortable shoes");
    } else {
      items.push("Light cotton clothes", "Sunscreen SPF 50+", "Sunglasses", "Hat / cap");
    }

    const cond = weather.condition.toLowerCase();
    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("thunder")) {
      items.push("Umbrella / raincoat", "Waterproof bag cover", "Quick-dry clothes");
    }
    if (cond.includes("snow")) {
      items.push("Snow boots", "Hand warmers", "Waterproof jacket");
    }
  }

  // Duration-based
  if (duration > 5) {
    items.push("Laundry bag", "Travel-size detergent");
  }
  if (duration > 10) {
    items.push("Extra luggage space / foldable bag");
  }

  // General travel
  items.push(
    "Toiletries bag",
    "Medications / first-aid kit",
    "Reusable water bottle",
    "Snacks for travel",
    "Earphones / headphones"
  );

  return items.map((text, i) => ({
    id: `auto-${i}`,
    text,
    checked: false,
    isAuto: true,
  }));
}

const PackingChecklist = ({ destination, duration, weather }: PackingChecklistProps) => {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    setItems(generatePackingItems(destination, duration, weather));
  }, [destination, duration, weather?.temp, weather?.condition]);

  const checkedCount = items.filter((i) => i.checked).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, text: newItem.trim(), checked: false, isAuto: false },
    ]);
    setNewItem("");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <Card className="travel-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Backpack className="w-5 h-5 text-primary" />
            Packing Checklist
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-1 rounded-xl" onClick={() => setShowInput(!showInput)}>
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Packed</span>
            <span className="font-medium text-foreground">
              {checkedCount} / {items.length} items
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* AI badge */}
        <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
          <Sparkles className="w-3 h-3" />
          Auto-generated based on weather & destination
        </div>

        {/* Add custom item */}
        {showInput && (
          <div className="flex gap-2 animate-fade-in">
            <Input
              placeholder="Add custom item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              className="rounded-xl"
            />
            <Button size="sm" onClick={addItem} className="rounded-xl">
              Add
            </Button>
          </div>
        )}

        {/* Items */}
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                item.checked ? "bg-travel-forest/5" : "hover:bg-muted/50"
              )}
            >
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => toggleItem(item.id)}
                className="data-[state=checked]:bg-travel-forest data-[state=checked]:border-travel-forest"
              />
              <span
                className={cn(
                  "text-sm flex-1",
                  item.checked && "line-through text-muted-foreground"
                )}
              >
                {item.text}
              </span>
              {!item.isAuto && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-6 h-6 opacity-0 group-hover:opacity-100"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingChecklist;
