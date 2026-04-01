import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Bike,
  Bus,
  Check,
  Leaf,
  MapPin,
  DollarSign,
  Info,
  ExternalLink,
} from "lucide-react";
import { Vehicle } from "@/types/trip";
import { cn } from "@/lib/utils";
import PlaceImageGallery from "@/components/ui/PlaceImageGallery";
import { getBusBookingPlatforms, getTaxiBookingPlatforms } from "@/lib/bookingLinks";
 
interface TransportSelectionProps {
  vehicles: Vehicle[];
  destination: string;
  onSelectVehicle: (vehicle: Vehicle) => void;
  selectedVehicle?: Vehicle;
  country?: string;
}
 
const TransportSelection = ({
  vehicles,
  destination,
  onSelectVehicle,
  selectedVehicle,
  country,
}: TransportSelectionProps) => {
   const [showDetails, setShowDetails] = useState<string | null>(null);
 
   const getVehicleIcon = (type: string) => {
     const lower = type.toLowerCase();
     if (lower.includes("bike") || lower.includes("scooter") || lower.includes("motorcycle"))
       return Bike;
     if (lower.includes("bus") || lower.includes("public"))
       return Bus;
     return Car;
   };
 
   return (
     <div className="space-y-4">
       <div className="flex items-center gap-2">
         <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
           <Car className="w-5 h-5 text-blue-600" />
         </div>
         <div>
           <h3 className="text-lg font-semibold">Transport Options</h3>
           <p className="text-sm text-muted-foreground">
             Select your preferred mode of transport
           </p>
         </div>
       </div>
 
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
         {vehicles.map((vehicle, index) => {
           const isSelected = selectedVehicle?.type === vehicle.type;
           const Icon = getVehicleIcon(vehicle.type);
           const isExpanded = showDetails === vehicle.type;
 
           return (
             <Card
               key={index}
               className={cn(
                 "travel-card overflow-hidden cursor-pointer transition-all",
                 isSelected && "ring-2 ring-blue-500 shadow-medium",
                 !isSelected && "hover:shadow-medium"
               )}
               onClick={() =>
                 setShowDetails(isExpanded ? null : vehicle.type)
               }
             >
                <div className="relative">
                  <PlaceImageGallery
                    query={`${vehicle.type} ${destination || country || ""} transportation`}
                    type="transport"
                    aspectRatio={16 / 9}
                  />
 
                 {vehicle.isEcoFriendly && (
                   <Badge className="absolute top-2 left-2 bg-green-500 text-white gap-1">
                     <Leaf className="w-3 h-3" />
                     Eco-Friendly
                   </Badge>
                 )}
 
                 {isSelected && (
                   <div className="absolute top-2 right-2">
                     <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                       <Check className="w-5 h-5" />
                     </div>
                   </div>
                 )}
               </div>
 
               <CardContent className="p-4">
                 <div className="flex items-start justify-between mb-2">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                       <Icon className="w-4 h-4 text-blue-600" />
                     </div>
                     <h4 className="font-semibold text-foreground">
                       {vehicle.type}
                     </h4>
                   </div>
                   <span className="text-lg font-bold text-blue-600">
                     {vehicle.estimatedCost}
                   </span>
                 </div>
 
                 <p className="text-sm text-muted-foreground mb-3">
                   {vehicle.reason}
                 </p>
 
                 <div className="flex items-center justify-between">
                   <Badge variant="secondary" className="text-xs">
                     {vehicle.suitableFor}
                   </Badge>
                   <Button
                     size="sm"
                     variant={isSelected ? "default" : "outline"}
                     className={isSelected ? "bg-blue-500 hover:bg-blue-600" : ""}
                     onClick={(e) => {
                       e.stopPropagation();
                       onSelectVehicle(vehicle);
                     }}
                   >
                     {isSelected ? "Selected" : "Select"}
                   </Button>
                 </div>
 
                 {/* Expanded Details */}
                 {isExpanded && (
                   <div className="mt-4 pt-4 border-t animate-fade-in space-y-3">
                     {vehicle.whereToFind && (
                       <div className="flex items-start gap-2">
                         <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                         <div>
                           <p className="text-xs text-muted-foreground">
                             Where to find
                           </p>
                           <p className="text-sm">{vehicle.whereToFind}</p>
                         </div>
                       </div>
                     )}
 
                     {vehicle.tips && (
                       <div className="flex items-start gap-2">
                         <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                         <div>
                           <p className="text-xs text-muted-foreground">Tip</p>
                           <p className="text-sm">{vehicle.tips}</p>
                         </div>
                       </div>
                     )}
                   </div>
                 )}
               </CardContent>
             </Card>
           );
         })}
       </div>
     </div>
   );
 };
 
 export default TransportSelection;