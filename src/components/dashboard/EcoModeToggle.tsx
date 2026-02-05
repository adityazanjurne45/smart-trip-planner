 import { Switch } from "@/components/ui/switch";
 import { Badge } from "@/components/ui/badge";
 import { Leaf, Sparkles } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface EcoModeToggleProps {
   enabled: boolean;
   onToggle: (enabled: boolean) => void;
   className?: string;
 }
 
 const EcoModeToggle = ({ enabled, onToggle, className }: EcoModeToggleProps) => {
   return (
     <div
       className={cn(
         "flex items-center justify-between p-4 rounded-xl border transition-all",
         enabled
           ? "bg-green-50 border-green-200"
           : "bg-muted/50 border-border",
         className
       )}
     >
       <div className="flex items-center gap-3">
         <div
           className={cn(
             "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
             enabled ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
           )}
         >
           <Leaf className="w-5 h-5" />
         </div>
         <div>
           <div className="flex items-center gap-2">
             <span className="font-medium text-foreground">Eco-Friendly Mode</span>
             {enabled && (
               <Badge className="bg-green-500 text-white gap-1">
                 <Sparkles className="w-3 h-3" />
                 Active
               </Badge>
             )}
           </div>
           <p className="text-sm text-muted-foreground">
             {enabled
               ? "Showing sustainable travel options"
               : "Enable for eco-friendly recommendations"}
           </p>
         </div>
       </div>
       <Switch
         checked={enabled}
         onCheckedChange={onToggle}
         className="data-[state=checked]:bg-green-500"
       />
     </div>
   );
 };
 
 export default EcoModeToggle;