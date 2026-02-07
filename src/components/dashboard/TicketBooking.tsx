import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plane, 
  Train, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Clock, 
  Shield, 
  Info,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { TripDetails } from "@/types/trip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TicketBookingProps {
  tripDetails: TripDetails;
}

const FLIGHT_PLATFORMS = [
  { 
    name: "Skyscanner", 
    logo: "✈️", 
    description: "Compare prices across airlines",
    baseUrl: "https://www.skyscanner.com/transport/flights"
  },
  { 
    name: "MakeMyTrip", 
    logo: "🛫", 
    description: "Popular in Asia & India",
    baseUrl: "https://www.makemytrip.com/flights"
  },
  { 
    name: "Google Flights", 
    logo: "🔍", 
    description: "Best for price tracking",
    baseUrl: "https://www.google.com/travel/flights"
  },
];

const TRAIN_PLATFORMS = [
  { 
    name: "IRCTC", 
    logo: "🚆", 
    description: "Official Indian Railways",
    baseUrl: "https://www.irctc.co.in",
    region: "India"
  },
  { 
    name: "Trainline", 
    logo: "🚄", 
    description: "European rail booking",
    baseUrl: "https://www.thetrainline.com",
    region: "Europe"
  },
  { 
    name: "Amtrak", 
    logo: "🚂", 
    description: "US rail service",
    baseUrl: "https://www.amtrak.com",
    region: "USA"
  },
];

const TicketBooking = ({ tripDetails }: TicketBookingProps) => {
  const [activeTab, setActiveTab] = useState<"flights" | "trains">("flights");

  const formatTravelDate = () => {
    if (tripDetails.startDate) {
      return format(new Date(tripDetails.startDate), "EEE, MMM d, yyyy");
    }
    return "Select travel date";
  };

  const generateFlightUrl = (platform: typeof FLIGHT_PLATFORMS[0]) => {
    const from = encodeURIComponent(tripDetails.boardingPoint.split(",")[0]);
    const to = encodeURIComponent(tripDetails.destinationPoint.split(",")[0]);
    const date = tripDetails.startDate || "";
    
    // Different URL patterns for different platforms
    if (platform.name === "Skyscanner") {
      return `${platform.baseUrl}/${from}/${to}/${date.replace(/-/g, "")}`;
    } else if (platform.name === "Google Flights") {
      return `${platform.baseUrl}?q=flights+from+${from}+to+${to}`;
    }
    return platform.baseUrl;
  };

  const generateTrainUrl = (platform: typeof TRAIN_PLATFORMS[0]) => {
    const from = encodeURIComponent(tripDetails.boardingPoint.split(",")[0]);
    const to = encodeURIComponent(tripDetails.destinationPoint.split(",")[0]);
    
    if (platform.name === "IRCTC") {
      return `${platform.baseUrl}/nget/train-search`;
    } else if (platform.name === "Trainline") {
      return `${platform.baseUrl}/train-times/${from}-to-${to}`;
    }
    return platform.baseUrl;
  };

  const handleBookingRedirect = (url: string, platformName: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Route Information Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-semibold text-foreground">{tripDetails.boardingPoint}</p>
                </div>
              </div>
              
              <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-semibold text-foreground">{tripDetails.destinationPoint}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{formatTravelDate()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Type Tabs */}
      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
        <Button
          variant={activeTab === "flights" ? "default" : "ghost"}
          onClick={() => setActiveTab("flights")}
          className="gap-2 rounded-lg"
        >
          <Plane className="w-4 h-4" />
          Flights
        </Button>
        <Button
          variant={activeTab === "trains" ? "default" : "ghost"}
          onClick={() => setActiveTab("trains")}
          className="gap-2 rounded-lg"
        >
          <Train className="w-4 h-4" />
          Trains
        </Button>
      </div>

      {/* Flight Booking Section */}
      {activeTab === "flights" && (
        <div className="grid gap-4 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Info className="w-4 h-4" />
            <span>Compare flight prices across trusted booking platforms</span>
          </div>
          
          {FLIGHT_PLATFORMS.map((platform, index) => (
            <Card 
              key={platform.name}
              className="hover:shadow-medium transition-all hover:border-primary/30 group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {platform.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        {platform.name}
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </h3>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="travel"
                    className="gap-2"
                    onClick={() => handleBookingRedirect(generateFlightUrl(platform), platform.name)}
                  >
                    <Plane className="w-4 h-4" />
                    Book Flight
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Train Booking Section */}
      {activeTab === "trains" && (
        <div className="grid gap-4 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Info className="w-4 h-4" />
            <span>Book train tickets through official railway platforms</span>
          </div>
          
          {TRAIN_PLATFORMS.map((platform, index) => (
            <Card 
              key={platform.name}
              className="hover:shadow-medium transition-all hover:border-primary/30 group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-travel-forest/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {platform.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        {platform.name}
                        <Badge variant="secondary" className="text-xs">{platform.region}</Badge>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </h3>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-travel-forest/10 hover:text-travel-forest hover:border-travel-forest"
                    onClick={() => handleBookingRedirect(generateTrainUrl(platform), platform.name)}
                  >
                    <Train className="w-4 h-4" />
                    Book Train
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Security Notice */}
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-travel-forest/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-travel-forest" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                Secure Booking
                <CheckCircle2 className="w-4 h-4 text-travel-forest" />
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-travel-forest" />
                  All bookings are processed on official partner platforms
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-travel-forest" />
                  Travello does not store payment or personal booking details
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-travel-forest" />
                  Your trip details are auto-filled for convenience
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Helpful Tips */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">Booking Tips</p>
          <ul className="text-amber-600 dark:text-amber-300/80 space-y-1">
            <li>• Book flights 3-6 weeks in advance for best prices</li>
            <li>• Train tickets often sell out during holidays—book early</li>
            <li>• Use incognito mode to avoid dynamic pricing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TicketBooking;
