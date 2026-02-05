 import { useState } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import {
   Lightbulb,
   DollarSign,
   ChevronDown,
   ChevronUp,
   Check,
   Sparkles,
 } from "lucide-react";
 import { CostSavingTip, TripDetails, Recommendations, Hotel, Vehicle } from "@/types/trip";
 import { cn } from "@/lib/utils";
 
 interface CostSavingTipsProps {
   tips: CostSavingTip[];
   tripDetails: TripDetails;
   recommendations: Recommendations;
   onSwitchHotel?: (hotel: Hotel) => void;
   onSwitchTransport?: (vehicle: Vehicle) => void;
 }
 
 const CostSavingTips = ({
   tips,
   tripDetails,
   recommendations,
   onSwitchHotel,
   onSwitchTransport,
 }: CostSavingTipsProps) => {
   const [expanded, setExpanded] = useState(true);
   const [appliedTips, setAppliedTips] = useState<Set<number>>(new Set());
 
   const handleApplyTip = (index: number, tip: CostSavingTip) => {
     setAppliedTips((prev) => new Set([...prev, index]));
 
     // Check if this is a hotel or transport related tip
     if (tip.tip.toLowerCase().includes("hotel") && onSwitchHotel) {
       const cheaperHotel = recommendations.hotels
         .filter((h) => !h.isSelected)
         .sort((a, b) => {
           const priceA = parseInt(a.pricePerNight.replace(/[^0-9]/g, "")) || 0;
           const priceB = parseInt(b.pricePerNight.replace(/[^0-9]/g, "")) || 0;
           return priceA - priceB;
         })[0];
       if (cheaperHotel) onSwitchHotel(cheaperHotel);
     }
 
     if (tip.tip.toLowerCase().includes("transport") && onSwitchTransport) {
       const cheaperVehicle = recommendations.vehicles
         .filter((v) => !v.isSelected && v.isEcoFriendly)
         .sort((a, b) => {
           const costA = parseInt(a.estimatedCost.replace(/[^0-9]/g, "")) || 0;
           const costB = parseInt(b.estimatedCost.replace(/[^0-9]/g, "")) || 0;
           return costA - costB;
         })[0];
       if (cheaperVehicle) onSwitchTransport(cheaperVehicle);
     }
   };
 
   const totalSavings = tips.reduce((acc, tip) => {
     const match = tip.savingsEstimate.match(/\$?(\d+)/);
     return acc + (match ? parseInt(match[1]) : 0);
   }, 0);
 
   return (
     <Card className="travel-card border-travel-forest/20 bg-travel-forest/5">
       <CardHeader
         className="cursor-pointer p-4"
         onClick={() => setExpanded(!expanded)}
       >
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-travel-forest/10 flex items-center justify-center">
               <Lightbulb className="w-5 h-5 text-travel-forest" />
             </div>
             <div>
               <CardTitle className="text-lg flex items-center gap-2">
                 Cost-Saving Suggestions
                 <Badge variant="secondary" className="bg-travel-forest/10 text-travel-forest">
                   <DollarSign className="w-3 h-3 mr-1" />
                   Save up to ${totalSavings}
                 </Badge>
               </CardTitle>
               <p className="text-sm text-muted-foreground">
                 AI-powered tips to reduce your trip costs
               </p>
             </div>
           </div>
           {expanded ? (
             <ChevronUp className="w-5 h-5 text-muted-foreground" />
           ) : (
             <ChevronDown className="w-5 h-5 text-muted-foreground" />
           )}
         </div>
       </CardHeader>
 
       {expanded && (
         <CardContent className="pt-0 px-4 pb-4 space-y-3 animate-fade-in">
           {tips.map((tip, index) => (
             <div
               key={index}
               className={cn(
                 "flex items-start justify-between p-4 rounded-xl transition-all",
                 appliedTips.has(index)
                   ? "bg-travel-forest/10 border border-travel-forest/30"
                   : "bg-background border border-border hover:border-travel-forest/30"
               )}
             >
               <div className="flex items-start gap-3 flex-1">
                 <div
                   className={cn(
                     "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                     appliedTips.has(index)
                       ? "bg-travel-forest text-white"
                       : "bg-travel-forest/10 text-travel-forest"
                   )}
                 >
                   {appliedTips.has(index) ? (
                     <Check className="w-4 h-4" />
                   ) : (
                     <Sparkles className="w-4 h-4" />
                   )}
                 </div>
                 <div>
                   <p className="font-medium text-foreground">{tip.tip}</p>
                   <p className="text-sm text-travel-forest font-medium mt-1">
                     Potential savings: {tip.savingsEstimate}
                   </p>
                 </div>
               </div>
               {!appliedTips.has(index) && (
                 <Button
                   size="sm"
                   variant="outline"
                   className="shrink-0 border-travel-forest/30 text-travel-forest hover:bg-travel-forest/10"
                   onClick={() => handleApplyTip(index, tip)}
                 >
                   Apply
                 </Button>
               )}
             </div>
           ))}
         </CardContent>
       )}
     </Card>
   );
 };
 
 export default CostSavingTips;