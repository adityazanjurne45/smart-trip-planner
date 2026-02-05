 import { useState } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import {
   Shield,
   Phone,
   Hospital,
   AlertTriangle,
   ChevronDown,
   ChevronUp,
   CloudRain,
   Info,
   ExternalLink,
 } from "lucide-react";
 import { SafetyInfo as SafetyInfoType } from "@/types/trip";
 import { cn } from "@/lib/utils";
 
 interface SafetyInfoProps {
   safetyInfo: SafetyInfoType;
   destination: string;
 }
 
 const SafetyInfoComponent = ({ safetyInfo, destination }: SafetyInfoProps) => {
   const [expanded, setExpanded] = useState(false);
   const [activeSection, setActiveSection] = useState<string | null>("emergency");
 
   const sections = [
     { id: "emergency", label: "Emergency", icon: Phone },
     { id: "hospitals", label: "Hospitals", icon: Hospital },
     { id: "tips", label: "Safety Tips", icon: Shield },
     { id: "weather", label: "Alerts", icon: CloudRain },
   ];
 
   return (
     <Card className="travel-card border-red-200 bg-red-50/50">
       <CardHeader
         className="cursor-pointer p-4"
         onClick={() => setExpanded(!expanded)}
       >
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
               <Shield className="w-5 h-5 text-red-600" />
             </div>
             <div>
               <CardTitle className="text-lg flex items-center gap-2">
                 Emergency & Safety
                 <Badge variant="secondary" className="bg-red-100 text-red-700">
                   {destination}
                 </Badge>
               </CardTitle>
               <p className="text-sm text-muted-foreground">
                 Essential contacts and safety information
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
         <CardContent className="pt-0 px-4 pb-4 animate-fade-in">
           {/* Section Tabs */}
           <div className="flex gap-2 mb-4 flex-wrap">
             {sections.map((section) => {
               const Icon = section.icon;
               return (
                 <Button
                   key={section.id}
                   variant={activeSection === section.id ? "default" : "outline"}
                   size="sm"
                   className="gap-2"
                   onClick={() => setActiveSection(section.id)}
                 >
                   <Icon className="w-4 h-4" />
                   {section.label}
                 </Button>
               );
             })}
           </div>
 
           {/* Emergency Numbers */}
           {activeSection === "emergency" && (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
               {safetyInfo.emergencyNumbers.police && (
                 <a
                   href={`tel:${safetyInfo.emergencyNumbers.police}`}
                   className="flex flex-col items-center p-4 rounded-xl bg-background border border-border hover:border-red-300 transition-all"
                 >
                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                     <Phone className="w-5 h-5 text-blue-600" />
                   </div>
                   <span className="text-sm font-medium">Police</span>
                   <span className="text-lg font-bold text-blue-600">
                     {safetyInfo.emergencyNumbers.police}
                   </span>
                 </a>
               )}
               {safetyInfo.emergencyNumbers.ambulance && (
                 <a
                   href={`tel:${safetyInfo.emergencyNumbers.ambulance}`}
                   className="flex flex-col items-center p-4 rounded-xl bg-background border border-border hover:border-red-300 transition-all"
                 >
                   <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                     <Hospital className="w-5 h-5 text-red-600" />
                   </div>
                   <span className="text-sm font-medium">Ambulance</span>
                   <span className="text-lg font-bold text-red-600">
                     {safetyInfo.emergencyNumbers.ambulance}
                   </span>
                 </a>
               )}
               {safetyInfo.emergencyNumbers.fire && (
                 <a
                   href={`tel:${safetyInfo.emergencyNumbers.fire}`}
                   className="flex flex-col items-center p-4 rounded-xl bg-background border border-border hover:border-red-300 transition-all"
                 >
                   <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                     <AlertTriangle className="w-5 h-5 text-orange-600" />
                   </div>
                   <span className="text-sm font-medium">Fire</span>
                   <span className="text-lg font-bold text-orange-600">
                     {safetyInfo.emergencyNumbers.fire}
                   </span>
                 </a>
               )}
               {safetyInfo.emergencyNumbers.tourist_helpline && (
                 <a
                   href={`tel:${safetyInfo.emergencyNumbers.tourist_helpline}`}
                   className="flex flex-col items-center p-4 rounded-xl bg-background border border-border hover:border-red-300 transition-all"
                 >
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                     <Info className="w-5 h-5 text-primary" />
                   </div>
                   <span className="text-sm font-medium">Tourist Help</span>
                   <span className="text-lg font-bold text-primary">
                     {safetyInfo.emergencyNumbers.tourist_helpline}
                   </span>
                 </a>
               )}
             </div>
           )}
 
           {/* Nearby Hospitals */}
           {activeSection === "hospitals" && (
             <div className="space-y-2 animate-fade-in">
               {safetyInfo.nearbyHospitals.map((hospital, index) => (
                 <div
                   key={index}
                   className="flex items-center justify-between p-3 rounded-xl bg-background border border-border"
                 >
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                       <Hospital className="w-4 h-4 text-red-600" />
                     </div>
                     <span className="font-medium">{hospital}</span>
                   </div>
                   <Button size="sm" variant="ghost" className="gap-1">
                     <ExternalLink className="w-4 h-4" />
                     Directions
                   </Button>
                 </div>
               ))}
             </div>
           )}
 
           {/* Safety Tips */}
           {activeSection === "tips" && (
             <div className="space-y-2 animate-fade-in">
               {safetyInfo.safetyTips.map((tip, index) => (
                 <div
                   key={index}
                   className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border"
                 >
                   <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                     <span className="text-xs font-bold text-amber-700">
                       {index + 1}
                     </span>
                   </div>
                   <p className="text-sm">{tip}</p>
                 </div>
               ))}
             </div>
           )}
 
           {/* Weather Alerts */}
           {activeSection === "weather" && (
             <div className="animate-fade-in">
               {safetyInfo.weatherAlerts && safetyInfo.weatherAlerts.length > 0 ? (
                 <div className="space-y-2">
                   {safetyInfo.weatherAlerts.map((alert, index) => (
                     <div
                       key={index}
                       className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200"
                     >
                       <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                       <p className="text-sm text-amber-800">{alert}</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-8 text-muted-foreground">
                   <CloudRain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                   <p>No weather alerts for this destination</p>
                 </div>
               )}
             </div>
           )}
         </CardContent>
       )}
     </Card>
   );
 };
 
 export default SafetyInfoComponent;