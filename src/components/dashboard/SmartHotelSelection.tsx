import { useState } from "react";
import BookingModal from "./BookingModal";
import WishlistButton from "./WishlistButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Star,
  Check,
  Wifi,
  Waves,
  Dumbbell,
  Leaf,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { Hotel } from "@/types/trip";
import { cn } from "@/lib/utils";
import PlaceImageGallery from "@/components/ui/PlaceImageGallery";
import { getHotelBookingPlatforms } from "@/lib/bookingLinks";
 
 interface SmartHotelSelectionProps {
   hotels: Hotel[];
   destination: string;
   onSelectHotel: (hotel: Hotel) => void;
   selectedHotel?: Hotel;
 }
 
 const SmartHotelSelection = ({
   hotels,
   destination,
   onSelectHotel,
   selectedHotel,
 }: SmartHotelSelectionProps) => {
   const [expanded, setExpanded] = useState<string | null>(null);
   const [bookingItem, setBookingItem] = useState<{ name: string; type: "hotel"; location: string; price: string } | null>(null);
   const getAmenityIcon = (amenity: string) => {
     const lower = amenity.toLowerCase();
     if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
     if (lower.includes("pool") || lower.includes("swim")) return Waves;
     if (lower.includes("gym") || lower.includes("fitness")) return Dumbbell;
     return null;
   };
 
   return (
     <div className="space-y-4">
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
             <Building2 className="w-5 h-5 text-primary" />
           </div>
           <div>
             <h3 className="text-lg font-semibold">Smart Hotel Selection</h3>
             <p className="text-sm text-muted-foreground">
               Click to select your preferred hotel
             </p>
           </div>
         </div>
       </div>
 
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
         {hotels.map((hotel, index) => {
           const isSelected = selectedHotel?.name === hotel.name;
           const isExpanded = expanded === hotel.name;
 
           return (
             <Card
               key={index}
               className={cn(
                 "travel-card overflow-hidden cursor-pointer transition-all",
                 isSelected && "ring-2 ring-primary shadow-medium",
                 !isSelected && "hover:shadow-medium"
               )}
               onClick={() => setExpanded(isExpanded ? null : hotel.name)}
             >
               <div className="relative">
                 <PlaceImageGallery
                   query={`${hotel.name} hotel ${destination}`}
                   type="hotel"
                   aspectRatio={16 / 10}
                 />
 
                 {/* Badges */}
                 <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                   {hotel.isBestLocation && (
                     <Badge className="bg-green-500 text-white gap-1">
                       <Navigation className="w-3 h-3" />
                       Best Location
                     </Badge>
                   )}
                   {hotel.isEcoFriendly && (
                     <Badge className="bg-green-600 text-white gap-1">
                       <Leaf className="w-3 h-3" />
                       Eco-Friendly
                     </Badge>
                   )}
                 </div>
 
                  {isSelected && (
                    <div className="absolute top-2 right-10">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <WishlistButton item={{ name: hotel.name, type: "hotel", location: hotel.location, price: hotel.pricePerNight, rating: hotel.rating }} />
                  </div>
               </div>
 
               <CardContent className="p-4">
                 <div className="flex items-start justify-between mb-2">
                   <h4 className="font-semibold text-foreground line-clamp-1">
                     {hotel.name}
                   </h4>
                   <div className="flex items-center gap-1 shrink-0">
                     <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                     <span className="font-medium">{hotel.rating}</span>
                   </div>
                 </div>
 
                 <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                   <MapPin className="w-3 h-3" />
                   {hotel.location}
                   {hotel.distanceToCenter && (
                     <span className="ml-1">• {hotel.distanceToCenter}</span>
                   )}
                 </div>
 
                <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-primary">
                      {hotel.pricePerNight}
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </span>
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHotel(hotel);
                      }}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>

                   {/* Book Now Buttons */}
                   <div className="mt-3 pt-3 border-t flex items-center gap-2">
                     <Button
                       size="sm"
                       variant="travel"
                       className="flex-1 text-xs"
                       onClick={(e) => {
                         e.stopPropagation();
                         setBookingItem({ name: hotel.name, type: "hotel", location: hotel.location, price: hotel.pricePerNight });
                       }}
                     >
                       Book Now
                     </Button>
                     <div className="flex flex-wrap gap-1">
                       {getHotelBookingPlatforms(destination).slice(0, 2).map((platform) => (
                         <Button
                           key={platform.name}
                           size="sm"
                           variant="outline"
                           className="text-xs gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                           onClick={(e) => {
                             e.stopPropagation();
                             window.open(platform.getUrl(hotel.name, destination), '_blank', 'noopener,noreferrer');
                           }}
                         >
                           <ExternalLink className="w-3 h-3" />
                           {platform.name}
                         </Button>
                       ))}
                     </div>
                   </div>
 
                 {/* Expanded Details */}
                 {isExpanded && (
                   <div className="mt-4 pt-4 border-t animate-fade-in">
                     {/* Amenities */}
                     {hotel.amenities && hotel.amenities.length > 0 && (
                       <div className="mb-3">
                         <p className="text-xs text-muted-foreground mb-2">
                           Amenities
                         </p>
                         <div className="flex flex-wrap gap-1">
                           {hotel.amenities.map((amenity, i) => {
                             const Icon = getAmenityIcon(amenity);
                             return (
                               <Badge key={i} variant="secondary" className="text-xs gap-1">
                                 {Icon && <Icon className="w-3 h-3" />}
                                 {amenity}
                               </Badge>
                             );
                           })}
                         </div>
                       </div>
                     )}
 
                     {/* Nearby Attractions */}
                     {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
                       <div>
                         <p className="text-xs text-muted-foreground mb-2">
                           Nearby Attractions
                         </p>
                         <div className="flex flex-wrap gap-1">
                           {hotel.nearbyAttractions.slice(0, 3).map((attr, i) => (
                             <Badge key={i} variant="outline" className="text-xs">
                               <MapPin className="w-3 h-3 mr-1" />
                               {attr}
                             </Badge>
                           ))}
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

      {bookingItem && (
        <BookingModal
          open={!!bookingItem}
          onClose={() => setBookingItem(null)}
          item={bookingItem}
          destination={destination}
        />
      )}
    </div>
  );
};

export default SmartHotelSelection;