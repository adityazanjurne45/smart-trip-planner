import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Clock, 
  FileText, 
  Calendar,
  TrendingUp,
  MapPin,
  Loader2
} from "lucide-react";
import { TripDetails } from "@/types/trip";
import { cn } from "@/lib/utils";

interface SmartWarningsCardProps {
  tripDetails: TripDetails;
  destination: string;
}

interface SmartWarning {
  id: string;
  icon: React.ElementType;
  message: string;
  type: "traffic" | "document" | "booking" | "timing" | "price";
}

const SmartWarningsCard = ({ tripDetails, destination }: SmartWarningsCardProps) => {
  const [warnings, setWarnings] = useState<SmartWarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate destination-specific smart warnings
    const generateWarnings = () => {
      const generatedWarnings: SmartWarning[] = [];
      const dest = destination.toLowerCase();

      // Traffic-based warnings
      if (dest.includes("goa") || dest.includes("calangute") || dest.includes("panjim")) {
        generatedWarnings.push({
          id: "goa-traffic",
          icon: Clock,
          message: "Avoid peak traffic between Panjim and Calangute from 6 PM to 8 PM.",
          type: "traffic"
        });
      }

      if (dest.includes("mumbai") || dest.includes("delhi") || dest.includes("bangalore")) {
        generatedWarnings.push({
          id: "metro-traffic",
          icon: Clock,
          message: `Peak traffic hours in ${destination.split(",")[0]}: 8-10 AM and 5-8 PM. Plan accordingly.`,
          type: "traffic"
        });
      }

      // Document warnings
      if (dest.includes("india") || dest.includes("goa") || dest.includes("kerala") || dest.includes("rajasthan")) {
        generatedWarnings.push({
          id: "id-document",
          icon: FileText,
          message: "Carry valid ID and driving license for vehicle rentals. Aadhaar or Passport recommended.",
          type: "document"
        });
      }

      // Booking advisories
      if (dest.includes("goa") || dest.includes("dudhsagar")) {
        generatedWarnings.push({
          id: "dudhsagar-booking",
          icon: Calendar,
          message: "Pre-book Dudhsagar jeep safari at least 15 days in advance during peak season.",
          type: "booking"
        });
      }

      if (dest.includes("taj") || dest.includes("agra")) {
        generatedWarnings.push({
          id: "taj-booking",
          icon: Calendar,
          message: "Book Taj Mahal tickets online to skip queues. Friday is closed for visitors.",
          type: "booking"
        });
      }

      if (dest.includes("jaipur") || dest.includes("rajasthan")) {
        generatedWarnings.push({
          id: "palace-booking",
          icon: Calendar,
          message: "Book Amber Fort elephant ride early. Morning slots (8-10 AM) offer cooler weather.",
          type: "booking"
        });
      }

      // International destinations
      if (dest.includes("paris") || dest.includes("france")) {
        generatedWarnings.push({
          id: "eiffel-booking",
          icon: Calendar,
          message: "Book Eiffel Tower summit tickets 2-3 weeks ahead. Skip-the-line tickets recommended.",
          type: "booking"
        });
      }

      if (dest.includes("dubai") || dest.includes("uae")) {
        generatedWarnings.push({
          id: "dubai-dress",
          icon: FileText,
          message: "Modest dress code required in malls and public areas. Carry appropriate clothing.",
          type: "document"
        });
      }

      // Price advisories based on travel dates
      const startDate = tripDetails.startDate ? new Date(tripDetails.startDate) : new Date();
      const daysUntilTrip = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilTrip < 14) {
        generatedWarnings.push({
          id: "last-minute-price",
          icon: TrendingUp,
          message: "Last-minute booking detected. Flight and hotel prices may be higher than average.",
          type: "price"
        });
      } else if (daysUntilTrip > 30 && daysUntilTrip < 90) {
        generatedWarnings.push({
          id: "optimal-booking",
          icon: TrendingUp,
          message: "Good timing! Book flights now for best prices—3-6 weeks ahead is optimal.",
          type: "price"
        });
      }

      // Seasonal warnings based on month
      const travelMonth = startDate.getMonth();
      
      if ((travelMonth >= 5 && travelMonth <= 8) && (dest.includes("india") || dest.includes("goa") || dest.includes("kerala"))) {
        generatedWarnings.push({
          id: "monsoon-warning",
          icon: AlertTriangle,
          message: "Monsoon season expected. Some outdoor activities and beaches may be limited.",
          type: "timing"
        });
      }

      if (travelMonth === 11 || travelMonth === 0) {
        generatedWarnings.push({
          id: "peak-season",
          icon: TrendingUp,
          message: "Peak holiday season—expect crowds and higher prices. Book accommodations early.",
          type: "price"
        });
      }

      // Weekend vs weekday
      const dayOfWeek = startDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        generatedWarnings.push({
          id: "weekend-travel",
          icon: Clock,
          message: "Weekend travel may have higher traffic and busier attractions. Consider mid-week alternatives.",
          type: "traffic"
        });
      }

      // Generic helpful warnings if none generated
      if (generatedWarnings.length === 0) {
        generatedWarnings.push({
          id: "general-tip",
          icon: MapPin,
          message: `Research local customs and peak hours for ${destination.split(",")[0]} before your visit.`,
          type: "booking"
        });
      }

      setWarnings(generatedWarnings.slice(0, 5)); // Limit to 5 warnings
      setLoading(false);
    };

    const timer = setTimeout(generateWarnings, 500);
    return () => clearTimeout(timer);
  }, [destination, tripDetails.startDate]);

  if (loading) {
    return (
      <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/5">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-amber-600 mr-2" />
          <span className="text-amber-700 dark:text-amber-400">Generating smart warnings...</span>
        </CardContent>
      </Card>
    );
  }

  if (warnings.length === 0) return null;

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/5 shadow-soft overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          Smart Warnings
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-3">
          {warnings.map((warning, index) => {
            const Icon = warning.icon;
            return (
              <li 
                key={warning.id}
                className="flex items-start gap-3 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5",
                  warning.type === "traffic" && "bg-blue-100 dark:bg-blue-900/30",
                  warning.type === "document" && "bg-purple-100 dark:bg-purple-900/30",
                  warning.type === "booking" && "bg-green-100 dark:bg-green-900/30",
                  warning.type === "timing" && "bg-orange-100 dark:bg-orange-900/30",
                  warning.type === "price" && "bg-pink-100 dark:bg-pink-900/30"
                )}>
                  <Icon className={cn(
                    "w-3.5 h-3.5",
                    warning.type === "traffic" && "text-blue-600 dark:text-blue-400",
                    warning.type === "document" && "text-purple-600 dark:text-purple-400",
                    warning.type === "booking" && "text-green-600 dark:text-green-400",
                    warning.type === "timing" && "text-orange-600 dark:text-orange-400",
                    warning.type === "price" && "text-pink-600 dark:text-pink-400"
                  )} />
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  {warning.message}
                </p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SmartWarningsCard;
