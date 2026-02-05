 import { useState } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import {
   Calendar,
   Clock,
   DollarSign,
   MapPin,
   Camera,
   Utensils,
   Car,
   Hotel,
   ChevronDown,
   ChevronUp,
   GripVertical,
   Plus,
   X,
   Edit2,
   Check,
   Lightbulb,
 } from "lucide-react";
 import { DayItinerary, DayActivity, TripDetails, Recommendations } from "@/types/trip";
 import { cn } from "@/lib/utils";
 import { toast } from "@/hooks/use-toast";
 
 interface InteractiveItineraryProps {
   tripDetails: TripDetails;
   recommendations: Recommendations;
   onItineraryChange?: (itinerary: DayItinerary[]) => void;
 }
 
 const InteractiveItinerary = ({
   tripDetails,
   recommendations,
   onItineraryChange,
 }: InteractiveItineraryProps) => {
   // Generate initial itinerary from recommendations if not provided
   const generateInitialItinerary = (): DayItinerary[] => {
     if (recommendations.dayWiseItinerary && recommendations.dayWiseItinerary.length > 0) {
       return recommendations.dayWiseItinerary;
     }
 
     const days: DayItinerary[] = [];
     const placesPerDay = Math.ceil(
       recommendations.touristPlaces.length / tripDetails.duration
     );
 
     for (let day = 1; day <= tripDetails.duration; day++) {
       const startIndex = (day - 1) * placesPerDay;
       const dayPlaces = recommendations.touristPlaces.slice(
         startIndex,
         startIndex + placesPerDay
       );
 
       const activities: DayActivity[] = [
         {
           time: "08:00",
           activity: "Breakfast at hotel",
           duration: "1 hour",
           cost: "Included",
           type: "food",
         },
       ];
 
       dayPlaces.forEach((place, idx) => {
         const hour = 9 + idx * 3;
         activities.push({
           time: `${hour.toString().padStart(2, "0")}:00`,
           activity: place.name,
           duration: place.estimatedTime,
           cost: place.entryFee,
           type: "attraction",
         });
 
         if (idx < dayPlaces.length - 1) {
           activities.push({
             time: `${(hour + 2).toString().padStart(2, "0")}:30`,
             activity: "Local lunch",
             duration: "1 hour",
             cost: "$15-25",
             type: "food",
           });
         }
       });
 
       activities.push({
         time: "19:00",
         activity: "Dinner & Leisure",
         duration: "2 hours",
         cost: "$20-35",
         type: "food",
       });
 
       days.push({
         day,
         theme: day === 1 ? "Arrival & Exploration" : `Day ${day} Adventure`,
         activities,
         totalCost: `$${50 + day * 20}`,
         travelTip:
           day === 1
             ? "Start early to maximize your first day!"
             : undefined,
       });
     }
 
     return days;
   };
 
   const [itinerary, setItinerary] = useState<DayItinerary[]>(
     generateInitialItinerary()
   );
   const [expandedDay, setExpandedDay] = useState<number | null>(1);
   const [editingActivity, setEditingActivity] = useState<{
     day: number;
     index: number;
   } | null>(null);
   const [draggedActivity, setDraggedActivity] = useState<{
     day: number;
     index: number;
   } | null>(null);
 
   const updateItinerary = (newItinerary: DayItinerary[]) => {
     setItinerary(newItinerary);
     onItineraryChange?.(newItinerary);
   };
 
   const removeActivity = (dayIndex: number, activityIndex: number) => {
     const newItinerary = [...itinerary];
     newItinerary[dayIndex].activities.splice(activityIndex, 1);
     updateItinerary(newItinerary);
     toast({
       title: "Activity removed",
       description: "The activity has been removed from your itinerary.",
     });
   };
 
   const addActivity = (dayIndex: number) => {
     const newItinerary = [...itinerary];
     const lastActivity =
       newItinerary[dayIndex].activities[
         newItinerary[dayIndex].activities.length - 1
       ];
     const lastHour = parseInt(lastActivity?.time.split(":")[0] || "18");
 
     newItinerary[dayIndex].activities.push({
       time: `${Math.min(lastHour + 1, 23).toString().padStart(2, "0")}:00`,
       activity: "New Activity",
       duration: "1 hour",
       cost: "$0",
       type: "leisure",
     });
 
     updateItinerary(newItinerary);
     setEditingActivity({
       day: dayIndex,
       index: newItinerary[dayIndex].activities.length - 1,
     });
   };
 
   const moveActivity = (
     fromDay: number,
     fromIndex: number,
     toDay: number,
     toIndex: number
   ) => {
     if (fromDay === toDay && fromIndex === toIndex) return;
 
     const newItinerary = [...itinerary];
     const [movedActivity] = newItinerary[fromDay].activities.splice(fromIndex, 1);
     newItinerary[toDay].activities.splice(toIndex, 0, movedActivity);
 
     updateItinerary(newItinerary);
     toast({
       title: "Activity moved",
       description: "Your itinerary has been updated.",
     });
   };
 
   const getActivityIcon = (type: DayActivity["type"]) => {
     switch (type) {
       case "attraction":
         return Camera;
       case "food":
         return Utensils;
       case "transport":
         return Car;
       case "hotel":
         return Hotel;
       default:
         return MapPin;
     }
   };
 
   const getActivityColor = (type: DayActivity["type"]) => {
     switch (type) {
       case "attraction":
         return "bg-primary/10 text-primary";
       case "food":
         return "bg-orange-100 text-orange-600";
       case "transport":
         return "bg-blue-100 text-blue-600";
       case "hotel":
         return "bg-purple-100 text-purple-600";
       default:
         return "bg-muted text-muted-foreground";
     }
   };
 
   return (
     <div className="space-y-4">
       <div className="flex items-center justify-between">
         <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
           <Calendar className="w-5 h-5 text-primary" />
           Interactive Itinerary
         </h3>
         <Badge variant="secondary" className="gap-1">
           <Edit2 className="w-3 h-3" />
           Drag to reorder
         </Badge>
       </div>
 
       {itinerary.map((day, dayIndex) => {
         const isExpanded = expandedDay === day.day;
 
         return (
           <Card
             key={day.day}
             className={cn(
               "travel-card transition-all",
               isExpanded && "ring-2 ring-primary/20"
             )}
           >
             <CardHeader
               className="p-4 cursor-pointer"
               onClick={() => setExpandedDay(isExpanded ? null : day.day)}
             >
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                     <span className="text-lg font-bold text-primary">
                       {day.day}
                     </span>
                   </div>
                   <div>
                     <CardTitle className="text-lg">{day.theme}</CardTitle>
                     <p className="text-sm text-muted-foreground">
                       {day.activities.length} activities • {day.totalCost}
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   {day.travelTip && (
                     <Badge
                       variant="outline"
                       className="bg-amber-50 text-amber-700 border-amber-200 gap-1"
                     >
                       <Lightbulb className="w-3 h-3" />
                       Tip
                     </Badge>
                   )}
                   {isExpanded ? (
                     <ChevronUp className="w-5 h-5 text-muted-foreground" />
                   ) : (
                     <ChevronDown className="w-5 h-5 text-muted-foreground" />
                   )}
                 </div>
               </div>
             </CardHeader>
 
             {isExpanded && (
               <CardContent className="pt-0 px-4 pb-4 animate-fade-in">
                 {day.travelTip && (
                   <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                     <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                     <p className="text-sm text-amber-800">{day.travelTip}</p>
                   </div>
                 )}
 
                 <div className="relative pl-6 border-l-2 border-primary/20 space-y-3">
                   {day.activities.map((activity, actIndex) => {
                     const Icon = getActivityIcon(activity.type);
                     const isDragging =
                       draggedActivity?.day === dayIndex &&
                       draggedActivity?.index === actIndex;
 
                     return (
                       <div
                         key={actIndex}
                         className={cn(
                           "relative group transition-all",
                           isDragging && "opacity-50"
                         )}
                         draggable
                         onDragStart={() =>
                           setDraggedActivity({ day: dayIndex, index: actIndex })
                         }
                         onDragEnd={() => setDraggedActivity(null)}
                         onDragOver={(e) => e.preventDefault()}
                         onDrop={() => {
                           if (draggedActivity) {
                             moveActivity(
                               draggedActivity.day,
                               draggedActivity.index,
                               dayIndex,
                               actIndex
                             );
                           }
                         }}
                       >
                         <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                         <div className="bg-muted/50 rounded-xl p-4 ml-4 hover:bg-muted/70 transition-all">
                           <div className="flex items-start justify-between">
                             <div className="flex items-start gap-3">
                               <div className="flex items-center gap-1">
                                 <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                                 <div
                                   className={cn(
                                     "w-10 h-10 rounded-lg flex items-center justify-center",
                                     getActivityColor(activity.type)
                                   )}
                                 >
                                   <Icon className="w-5 h-5" />
                                 </div>
                               </div>
                               <div>
                                 <p className="font-medium text-foreground">
                                   {activity.activity}
                                 </p>
                                 <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                   <span className="flex items-center gap-1">
                                     <Clock className="w-3 h-3" />
                                     {activity.time}
                                   </span>
                                   <span>•</span>
                                   <span>{activity.duration}</span>
                                 </div>
                               </div>
                             </div>
                             <div className="flex items-center gap-2">
                               <Badge variant="secondary" className="text-xs">
                                 {activity.cost}
                               </Badge>
                               <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                 onClick={() => removeActivity(dayIndex, actIndex)}
                               >
                                 <X className="w-4 h-4" />
                               </Button>
                             </div>
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
 
                 <Button
                   variant="outline"
                   size="sm"
                   className="mt-4 ml-10 gap-2"
                   onClick={() => addActivity(dayIndex)}
                 >
                   <Plus className="w-4 h-4" />
                   Add Activity
                 </Button>
               </CardContent>
             )}
           </Card>
         );
       })}
     </div>
   );
 };
 
 export default InteractiveItinerary;