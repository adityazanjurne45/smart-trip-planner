 import { useState } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Checkbox } from "@/components/ui/checkbox";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import {
   GitCompare,
   MapPin,
   Calendar,
   DollarSign,
   Building2,
   Car,
   Star,
   Check,
   X,
 } from "lucide-react";
 import { PastTrip } from "@/types/profile";
 import { cn } from "@/lib/utils";
 
 interface TripComparisonProps {
   trips: PastTrip[];
   onClose: () => void;
 }
 
 const TripComparison = ({ trips, onClose }: TripComparisonProps) => {
   const [selectedTrips, setSelectedTrips] = useState<Set<string>>(new Set());
 
   const toggleTrip = (tripId: string) => {
     setSelectedTrips((prev) => {
       const next = new Set(prev);
       if (next.has(tripId)) {
         next.delete(tripId);
       } else if (next.size < 3) {
         next.add(tripId);
       }
       return next;
     });
   };
 
   const compareTrips = trips.filter((t) => selectedTrips.has(t.id));
 
   // Calculate best option
   const getBestOption = () => {
     if (compareTrips.length < 2) return null;
 
     const scores = compareTrips.map((trip) => {
       let score = 0;
       // Lower budget per day is better
       const budgetPerDay = trip.budget / trip.duration;
       const minBudgetPerDay = Math.min(
         ...compareTrips.map((t) => t.budget / t.duration)
       );
       if (budgetPerDay === minBudgetPerDay) score += 2;
 
       // Higher rating is better
       if (trip.rating) {
         const maxRating = Math.max(
           ...compareTrips.map((t) => t.rating || 0)
         );
         if (trip.rating === maxRating) score += 2;
       }
 
       // Longer duration with good budget is better
       const maxDuration = Math.max(...compareTrips.map((t) => t.duration));
       if (trip.duration === maxDuration) score += 1;
 
       return { tripId: trip.id, score };
     });
 
     const best = scores.reduce((a, b) => (a.score > b.score ? a : b));
     return best.tripId;
   };
 
   const bestTripId = getBestOption();
 
   return (
     <Card className="travel-card">
       <CardHeader className="pb-4">
         <div className="flex items-center justify-between">
           <CardTitle className="text-xl flex items-center gap-2">
             <GitCompare className="w-5 h-5 text-primary" />
             Compare Trips
           </CardTitle>
           <Button variant="ghost" size="sm" onClick={onClose}>
             Close
           </Button>
         </div>
         <p className="text-sm text-muted-foreground">
           Select up to 3 trips to compare side by side
         </p>
       </CardHeader>
 
       <CardContent className="space-y-6">
         {/* Trip Selection */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
           {trips.map((trip) => (
             <div
               key={trip.id}
               className={cn(
                 "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                 selectedTrips.has(trip.id)
                   ? "border-primary bg-primary/5"
                   : "border-border hover:border-primary/50"
               )}
               onClick={() => toggleTrip(trip.id)}
             >
               <Checkbox
                 checked={selectedTrips.has(trip.id)}
                 onCheckedChange={() => toggleTrip(trip.id)}
                 disabled={!selectedTrips.has(trip.id) && selectedTrips.size >= 3}
               />
               <div className="flex-1 min-w-0">
                 <p className="font-medium text-sm truncate">
                   {trip.boarding_point} → {trip.destination}
                 </p>
                 <p className="text-xs text-muted-foreground">
                   {trip.duration} days • ${trip.budget}
                 </p>
               </div>
             </div>
           ))}
         </div>
 
         {/* Comparison Table */}
         {compareTrips.length >= 2 && (
           <div className="animate-fade-in">
             <div className="rounded-xl border overflow-hidden">
               <Table>
                 <TableHeader>
                   <TableRow className="bg-muted/50">
                     <TableHead className="w-[140px]">Criteria</TableHead>
                     {compareTrips.map((trip) => (
                       <TableHead key={trip.id} className="text-center">
                         <div className="flex flex-col items-center gap-1">
                           <span className="font-medium truncate max-w-[120px]">
                             {trip.destination}
                           </span>
                           {trip.id === bestTripId && (
                             <Badge className="bg-green-500 text-white text-xs">
                               Best Value
                             </Badge>
                           )}
                         </div>
                       </TableHead>
                     ))}
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   <TableRow>
                     <TableCell className="font-medium">
                       <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-primary" />
                         Route
                       </div>
                     </TableCell>
                     {compareTrips.map((trip) => (
                       <TableCell key={trip.id} className="text-center text-sm">
                         {trip.boarding_point} → {trip.destination}
                       </TableCell>
                     ))}
                   </TableRow>
                   <TableRow>
                     <TableCell className="font-medium">
                       <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-blue-500" />
                         Duration
                       </div>
                     </TableCell>
                     {compareTrips.map((trip) => {
                       const maxDuration = Math.max(
                         ...compareTrips.map((t) => t.duration)
                       );
                       return (
                         <TableCell
                           key={trip.id}
                           className={cn(
                             "text-center font-medium",
                             trip.duration === maxDuration && "text-green-600"
                           )}
                         >
                           {trip.duration} days
                         </TableCell>
                       );
                     })}
                   </TableRow>
                   <TableRow>
                     <TableCell className="font-medium">
                       <div className="flex items-center gap-2">
                         <DollarSign className="w-4 h-4 text-green-500" />
                         Total Budget
                       </div>
                     </TableCell>
                     {compareTrips.map((trip) => {
                       const minBudget = Math.min(
                         ...compareTrips.map((t) => t.budget)
                       );
                       return (
                         <TableCell
                           key={trip.id}
                           className={cn(
                             "text-center font-medium",
                             trip.budget === minBudget && "text-green-600"
                           )}
                         >
                           ${trip.budget.toLocaleString()}
                         </TableCell>
                       );
                     })}
                   </TableRow>
                   <TableRow>
                     <TableCell className="font-medium">
                       <div className="flex items-center gap-2">
                         <DollarSign className="w-4 h-4 text-amber-500" />
                         Per Day
                       </div>
                     </TableCell>
                     {compareTrips.map((trip) => {
                       const perDay = Math.round(trip.budget / trip.duration);
                       const minPerDay = Math.min(
                         ...compareTrips.map((t) =>
                           Math.round(t.budget / t.duration)
                         )
                       );
                       return (
                         <TableCell
                           key={trip.id}
                           className={cn(
                             "text-center font-medium",
                             perDay === minPerDay && "text-green-600"
                           )}
                         >
                           ${perDay}/day
                         </TableCell>
                       );
                     })}
                   </TableRow>
                   <TableRow>
                     <TableCell className="font-medium">
                       <div className="flex items-center gap-2">
                         <Star className="w-4 h-4 text-yellow-500" />
                         Rating
                       </div>
                     </TableCell>
                     {compareTrips.map((trip) => {
                       const maxRating = Math.max(
                         ...compareTrips.map((t) => t.rating || 0)
                       );
                       return (
                         <TableCell key={trip.id} className="text-center">
                           {trip.rating ? (
                             <div
                               className={cn(
                                 "flex items-center justify-center gap-1",
                                 trip.rating === maxRating && "text-green-600"
                               )}
                             >
                               {[...Array(5)].map((_, i) => (
                                 <Star
                                   key={i}
                                   className={cn(
                                     "w-4 h-4",
                                     i < trip.rating!
                                       ? "fill-yellow-400 text-yellow-400"
                                       : "text-muted"
                                   )}
                                 />
                               ))}
                             </div>
                           ) : (
                             <span className="text-muted-foreground text-sm">
                               Not rated
                             </span>
                           )}
                         </TableCell>
                       );
                     })}
                   </TableRow>
                 </TableBody>
               </Table>
             </div>
 
             {bestTripId && (
               <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
                 <div className="flex items-center gap-2">
                   <Check className="w-5 h-5 text-green-600" />
                   <span className="font-medium text-green-800">
                     Recommended:{" "}
                     {compareTrips.find((t) => t.id === bestTripId)?.destination}
                   </span>
                 </div>
                 <p className="text-sm text-green-700 mt-1">
                   This trip offers the best value based on budget, duration, and
                   your ratings.
                 </p>
               </div>
             )}
           </div>
         )}
 
         {compareTrips.length < 2 && selectedTrips.size > 0 && (
           <p className="text-center text-muted-foreground py-4">
             Select at least 2 trips to compare
           </p>
         )}
       </CardContent>
     </Card>
   );
 };
 
 export default TripComparison;