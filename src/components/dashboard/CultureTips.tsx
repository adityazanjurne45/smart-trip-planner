 import { useState } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import {
   Globe,
   ChevronDown,
   ChevronUp,
   MessageCircle,
   Utensils,
   Shirt,
   Heart,
   Volume2,
 } from "lucide-react";
 import { CultureTips as CultureTipsType } from "@/types/trip";
 import { cn } from "@/lib/utils";
 
 interface CultureTipsProps {
   cultureTips: CultureTipsType;
   destination: string;
 }
 
 const CultureTipsComponent = ({ cultureTips, destination }: CultureTipsProps) => {
   const [expanded, setExpanded] = useState(false);
   const [activeTab, setActiveTab] = useState<"phrases" | "customs" | "food">("phrases");
 
   const tabs = [
     { id: "phrases" as const, label: "Phrases", icon: MessageCircle },
     { id: "customs" as const, label: "Customs", icon: Heart },
     { id: "food" as const, label: "Local Food", icon: Utensils },
   ];
 
   return (
     <Card className="travel-card border-purple-200 bg-purple-50/50">
       <CardHeader
         className="cursor-pointer p-4"
         onClick={() => setExpanded(!expanded)}
       >
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
               <Globe className="w-5 h-5 text-purple-600" />
             </div>
             <div>
               <CardTitle className="text-lg flex items-center gap-2">
                 Local Culture & Language
                 <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                   {cultureTips.language}
                 </Badge>
               </CardTitle>
               <p className="text-sm text-muted-foreground">
                 Essential phrases, customs, and food tips
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
           {/* Dress Code */}
           {cultureTips.dressCode && (
             <div className="flex items-start gap-3 p-3 mb-4 rounded-xl bg-purple-100/50 border border-purple-200">
               <Shirt className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
               <div>
                 <span className="font-medium text-purple-800">Dress Code: </span>
                 <span className="text-purple-700">{cultureTips.dressCode}</span>
               </div>
             </div>
           )}
 
           {/* Tab Navigation */}
           <div className="flex gap-2 mb-4">
             {tabs.map((tab) => {
               const Icon = tab.icon;
               return (
                 <Button
                   key={tab.id}
                   variant={activeTab === tab.id ? "default" : "outline"}
                   size="sm"
                   className="gap-2"
                   onClick={() => setActiveTab(tab.id)}
                 >
                   <Icon className="w-4 h-4" />
                   {tab.label}
                 </Button>
               );
             })}
           </div>
 
           {/* Useful Phrases */}
           {activeTab === "phrases" && (
             <div className="space-y-2 animate-fade-in">
               {cultureTips.usefulPhrases.map((phrase, index) => (
                 <div
                   key={index}
                   className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-purple-300 transition-all"
                 >
                   <div className="flex-1">
                     <div className="flex items-center gap-2">
                       <span className="font-medium text-foreground">
                         {phrase.phrase}
                       </span>
                       <span className="text-muted-foreground">→</span>
                       <span className="text-purple-700 font-medium">
                         {phrase.translation}
                       </span>
                     </div>
                     {phrase.pronunciation && (
                       <p className="text-xs text-muted-foreground mt-1 italic">
                         /{phrase.pronunciation}/
                       </p>
                     )}
                   </div>
                   <Button
                     size="icon"
                     variant="ghost"
                     className="shrink-0 text-muted-foreground hover:text-purple-600"
                   >
                     <Volume2 className="w-4 h-4" />
                   </Button>
                 </div>
               ))}
             </div>
           )}
 
           {/* Local Customs */}
           {activeTab === "customs" && (
             <div className="space-y-2 animate-fade-in">
               {cultureTips.customs.map((custom, index) => (
                 <div
                   key={index}
                   className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border"
                 >
                   <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                     <Heart className="w-3 h-3 text-purple-600" />
                   </div>
                   <p className="text-sm">{custom}</p>
                 </div>
               ))}
             </div>
           )}
 
           {/* Local Food */}
           {activeTab === "food" && (
             <div className="grid md:grid-cols-2 gap-2 animate-fade-in">
               {cultureTips.localFood.map((food, index) => (
                 <div
                   key={index}
                   className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border hover:border-purple-300 transition-all"
                 >
                   <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                     <Utensils className="w-4 h-4 text-orange-600" />
                   </div>
                   <p className="text-sm font-medium">{food}</p>
                 </div>
               ))}
             </div>
           )}
         </CardContent>
       )}
     </Card>
   );
 };
 
 export default CultureTipsComponent;