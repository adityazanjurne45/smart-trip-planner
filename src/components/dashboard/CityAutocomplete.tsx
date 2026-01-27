import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Popular cities for autocomplete
const POPULAR_CITIES = [
  "New York, USA",
  "Los Angeles, USA",
  "Chicago, USA",
  "San Francisco, USA",
  "Miami, USA",
  "London, UK",
  "Paris, France",
  "Rome, Italy",
  "Barcelona, Spain",
  "Amsterdam, Netherlands",
  "Berlin, Germany",
  "Vienna, Austria",
  "Prague, Czech Republic",
  "Tokyo, Japan",
  "Seoul, South Korea",
  "Singapore",
  "Bangkok, Thailand",
  "Bali, Indonesia",
  "Sydney, Australia",
  "Melbourne, Australia",
  "Dubai, UAE",
  "Mumbai, India",
  "Delhi, India",
  "Jaipur, India",
  "Goa, India",
  "Cairo, Egypt",
  "Cape Town, South Africa",
  "Rio de Janeiro, Brazil",
  "Buenos Aires, Argentina",
  "Mexico City, Mexico",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Istanbul, Turkey",
  "Athens, Greece",
  "Santorini, Greece",
  "Lisbon, Portugal",
  "Dublin, Ireland",
  "Edinburgh, Scotland",
  "Zurich, Switzerland",
  "Hong Kong",
  "Taipei, Taiwan",
  "Hanoi, Vietnam",
  "Kuala Lumpur, Malaysia",
  "Maldives",
  "Mauritius",
  "Seychelles",
  "Hawaii, USA",
  "Las Vegas, USA",
  "Orlando, USA",
  "Washington DC, USA",
];

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

const CityAutocomplete = ({
  value,
  onChange,
  placeholder = "Enter city name",
  label,
  error,
}: CityAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      setIsLoading(true);
      // Simulate API delay for realism
      const timer = setTimeout(() => {
        const filtered = POPULAR_CITIES.filter((city) =>
          city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 8);
        setSuggestions(filtered);
        setIsOpen(filtered.length > 0);
        setIsLoading(false);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  const handleSelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      {label && (
        <Label htmlFor="city-input" className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-primary" />
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          id="city-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-14 text-lg rounded-xl pr-10",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in"
        >
          {suggestions.map((city, index) => (
            <li
              key={city}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                highlightedIndex === index
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              )}
              onMouseDown={() => handleSelect(city)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{city}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Popular destinations hint */}
      {!value && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">Popular destinations:</p>
          <div className="flex flex-wrap gap-2">
            {["Paris", "Tokyo", "Bali", "New York"].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onChange(city)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
