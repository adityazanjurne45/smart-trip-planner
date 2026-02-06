import { useState, useEffect } from "react";
import { Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface DestinationTimeProps {
  destination: string;
  className?: string;
  showFullDetails?: boolean;
}

// Major cities with their timezone offsets
const TIMEZONE_MAP: Record<string, { offset: number; timezone: string; country: string }> = {
  // India (IST +5:30)
  "delhi": { offset: 5.5, timezone: "IST", country: "India" },
  "mumbai": { offset: 5.5, timezone: "IST", country: "India" },
  "bangalore": { offset: 5.5, timezone: "IST", country: "India" },
  "bengaluru": { offset: 5.5, timezone: "IST", country: "India" },
  "chennai": { offset: 5.5, timezone: "IST", country: "India" },
  "kolkata": { offset: 5.5, timezone: "IST", country: "India" },
  "hyderabad": { offset: 5.5, timezone: "IST", country: "India" },
  "pune": { offset: 5.5, timezone: "IST", country: "India" },
  "jaipur": { offset: 5.5, timezone: "IST", country: "India" },
  "goa": { offset: 5.5, timezone: "IST", country: "India" },
  "kerala": { offset: 5.5, timezone: "IST", country: "India" },
  "agra": { offset: 5.5, timezone: "IST", country: "India" },
  "varanasi": { offset: 5.5, timezone: "IST", country: "India" },
  "shimla": { offset: 5.5, timezone: "IST", country: "India" },
  "manali": { offset: 5.5, timezone: "IST", country: "India" },
  "udaipur": { offset: 5.5, timezone: "IST", country: "India" },
  "jodhpur": { offset: 5.5, timezone: "IST", country: "India" },
  "rishikesh": { offset: 5.5, timezone: "IST", country: "India" },
  "darjeeling": { offset: 5.5, timezone: "IST", country: "India" },
  "ladakh": { offset: 5.5, timezone: "IST", country: "India" },
  "leh": { offset: 5.5, timezone: "IST", country: "India" },
  "amritsar": { offset: 5.5, timezone: "IST", country: "India" },
  "mysore": { offset: 5.5, timezone: "IST", country: "India" },
  "mysuru": { offset: 5.5, timezone: "IST", country: "India" },
  "ooty": { offset: 5.5, timezone: "IST", country: "India" },
  "munnar": { offset: 5.5, timezone: "IST", country: "India" },
  "kochi": { offset: 5.5, timezone: "IST", country: "India" },
  "india": { offset: 5.5, timezone: "IST", country: "India" },
  
  // International destinations
  "london": { offset: 0, timezone: "GMT", country: "UK" },
  "paris": { offset: 1, timezone: "CET", country: "France" },
  "new york": { offset: -5, timezone: "EST", country: "USA" },
  "los angeles": { offset: -8, timezone: "PST", country: "USA" },
  "tokyo": { offset: 9, timezone: "JST", country: "Japan" },
  "dubai": { offset: 4, timezone: "GST", country: "UAE" },
  "singapore": { offset: 8, timezone: "SGT", country: "Singapore" },
  "sydney": { offset: 11, timezone: "AEDT", country: "Australia" },
  "bangkok": { offset: 7, timezone: "ICT", country: "Thailand" },
  "hong kong": { offset: 8, timezone: "HKT", country: "Hong Kong" },
  "bali": { offset: 8, timezone: "WITA", country: "Indonesia" },
  "maldives": { offset: 5, timezone: "MVT", country: "Maldives" },
  "amsterdam": { offset: 1, timezone: "CET", country: "Netherlands" },
  "rome": { offset: 1, timezone: "CET", country: "Italy" },
  "berlin": { offset: 1, timezone: "CET", country: "Germany" },
  "barcelona": { offset: 1, timezone: "CET", country: "Spain" },
  "cairo": { offset: 2, timezone: "EET", country: "Egypt" },
  "moscow": { offset: 3, timezone: "MSK", country: "Russia" },
  "beijing": { offset: 8, timezone: "CST", country: "China" },
  "seoul": { offset: 9, timezone: "KST", country: "South Korea" },
  "kuala lumpur": { offset: 8, timezone: "MYT", country: "Malaysia" },
  "nepal": { offset: 5.75, timezone: "NPT", country: "Nepal" },
  "kathmandu": { offset: 5.75, timezone: "NPT", country: "Nepal" },
  "sri lanka": { offset: 5.5, timezone: "IST", country: "Sri Lanka" },
  "colombo": { offset: 5.5, timezone: "SLST", country: "Sri Lanka" },
  "bhutan": { offset: 6, timezone: "BTT", country: "Bhutan" },
  "thimphu": { offset: 6, timezone: "BTT", country: "Bhutan" },
  "vietnam": { offset: 7, timezone: "ICT", country: "Vietnam" },
  "hanoi": { offset: 7, timezone: "ICT", country: "Vietnam" },
};

// Default to IST for Indian-sounding names
const INDIAN_STATES = [
  "rajasthan", "gujarat", "maharashtra", "karnataka", "tamil nadu", "andhra pradesh",
  "telangana", "west bengal", "uttar pradesh", "madhya pradesh", "bihar", "odisha",
  "assam", "punjab", "haryana", "himachal pradesh", "uttarakhand", "jharkhand",
  "chhattisgarh", "goa", "sikkim", "meghalaya", "manipur", "mizoram", "nagaland",
  "tripura", "arunachal pradesh", "jammu", "kashmir"
];

const getTimezoneInfo = (destination: string) => {
  const lowerDest = destination.toLowerCase();
  
  // Check direct match
  for (const [key, value] of Object.entries(TIMEZONE_MAP)) {
    if (lowerDest.includes(key)) {
      return value;
    }
  }
  
  // Check Indian states
  for (const state of INDIAN_STATES) {
    if (lowerDest.includes(state)) {
      return { offset: 5.5, timezone: "IST", country: "India" };
    }
  }
  
  // Default to IST for unrecognized destinations (assuming India)
  return { offset: 5.5, timezone: "IST", country: "India" };
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const DestinationTime = ({ destination, className, showFullDetails = false }: DestinationTimeProps) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const timezoneInfo = getTimezoneInfo(destination);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const destinationTime = new Date(utcTime + timezoneInfo.offset * 3600000);
      setCurrentTime(destinationTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezoneInfo.offset]);

  if (!currentTime) return null;

  const userTime = new Date();
  const timeDiff = timezoneInfo.offset - (-(userTime.getTimezoneOffset() / 60));
  const timeDiffStr = timeDiff >= 0 ? `+${timeDiff}` : `${timeDiff}`;

  if (!showFullDetails) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Clock className="w-4 h-4 text-primary" />
        <span className="font-medium text-foreground">{formatTime(currentTime)}</span>
        <span className="text-muted-foreground">({timezoneInfo.timezone})</span>
      </div>
    );
  }

  return (
    <div className={cn("p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border", className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Globe className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-foreground text-sm">Destination Time</h4>
          <p className="text-xs text-muted-foreground">{destination}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{formatTime(currentTime)}</p>
            <p className="text-sm text-muted-foreground">{formatDate(currentTime)}</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {timezoneInfo.timezone}
            </span>
            <p className="text-xs text-muted-foreground mt-1">{timezoneInfo.country}</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Time difference from you</span>
            <span className="font-medium text-foreground">{timeDiffStr} hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationTime;
