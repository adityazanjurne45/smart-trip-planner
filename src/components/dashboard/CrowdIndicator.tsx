 import { Badge } from "@/components/ui/badge";
 import { Users, Clock } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface CrowdIndicatorProps {
   crowdLevel: 'low' | 'medium' | 'high';
   bestTimeToVisit?: string;
   className?: string;
   compact?: boolean;
 }
 
 const CrowdIndicator = ({
   crowdLevel,
   bestTimeToVisit,
   className,
   compact = false,
 }: CrowdIndicatorProps) => {
   const config = {
     low: {
       label: "Low Crowd",
       color: "bg-green-100 text-green-700 border-green-200",
       dotColor: "bg-green-500",
       description: "Perfect time to visit",
     },
     medium: {
       label: "Moderate",
       color: "bg-amber-100 text-amber-700 border-amber-200",
       dotColor: "bg-amber-500",
       description: "Expect some crowds",
     },
     high: {
       label: "High Crowd",
       color: "bg-red-100 text-red-700 border-red-200",
       dotColor: "bg-red-500",
       description: "Very busy",
     },
   };
 
   const current = config[crowdLevel];
 
   if (compact) {
     return (
       <Badge variant="outline" className={cn(current.color, "gap-1.5", className)}>
         <span className={cn("w-2 h-2 rounded-full animate-pulse", current.dotColor)} />
         {current.label}
       </Badge>
     );
   }
 
   return (
     <div className={cn("space-y-2", className)}>
       <div className="flex items-center gap-2">
         <Badge variant="outline" className={cn(current.color, "gap-1.5")}>
           <span className={cn("w-2 h-2 rounded-full animate-pulse", current.dotColor)} />
           <Users className="w-3 h-3" />
           {current.label}
         </Badge>
         <span className="text-xs text-muted-foreground">{current.description}</span>
       </div>
       {bestTimeToVisit && (
         <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
           <Clock className="w-3 h-3" />
           <span>Best time: {bestTimeToVisit}</span>
         </div>
       )}
     </div>
   );
 };
 
 export default CrowdIndicator;