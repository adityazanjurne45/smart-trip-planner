 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { PieChart, DollarSign } from "lucide-react";
 import { BudgetBreakdown as BudgetBreakdownType } from "@/types/trip";
 import { cn } from "@/lib/utils";
 
 interface BudgetBreakdownProps {
   breakdown: BudgetBreakdownType;
   totalBudget: number;
   className?: string;
 }
 
 const BudgetBreakdownComponent = ({
   breakdown,
   totalBudget,
   className,
 }: BudgetBreakdownProps) => {
   const categories = [
     { key: "accommodation", label: "Accommodation", color: "bg-primary" },
     { key: "food", label: "Food & Dining", color: "bg-orange-500" },
     { key: "transport", label: "Transport", color: "bg-blue-500" },
     { key: "activities", label: "Activities", color: "bg-purple-500" },
     { key: "miscellaneous", label: "Miscellaneous", color: "bg-gray-400" },
   ];
 
   return (
     <Card className={cn("travel-card", className)}>
       <CardHeader className="pb-2">
         <CardTitle className="text-lg flex items-center gap-2">
           <PieChart className="w-5 h-5 text-primary" />
           Budget Breakdown
         </CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
         {/* Visual bar breakdown */}
         <div className="h-4 rounded-full overflow-hidden flex">
           {categories.map((cat) => {
             const percentage = breakdown[cat.key as keyof BudgetBreakdownType];
             return (
               <div
                 key={cat.key}
                 className={cn("h-full transition-all", cat.color)}
                 style={{ width: `${percentage}%` }}
                 title={`${cat.label}: ${percentage}%`}
               />
             );
           })}
         </div>
 
         {/* Legend with amounts */}
         <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
           {categories.map((cat) => {
             const percentage = breakdown[cat.key as keyof BudgetBreakdownType];
             const amount = Math.round((totalBudget * percentage) / 100);
             return (
               <div key={cat.key} className="flex items-center gap-2">
                 <div className={cn("w-3 h-3 rounded-full shrink-0", cat.color)} />
                 <div className="min-w-0">
                   <p className="text-xs text-muted-foreground truncate">{cat.label}</p>
                   <p className="font-medium text-sm flex items-center gap-1">
                     <DollarSign className="w-3 h-3" />
                     {amount}
                   </p>
                 </div>
               </div>
             );
           })}
         </div>
 
         {/* Total */}
         <div className="pt-3 border-t border-border flex items-center justify-between">
           <span className="text-sm text-muted-foreground">Total Budget</span>
           <span className="text-xl font-bold text-primary">${totalBudget}</span>
         </div>
       </CardContent>
     </Card>
   );
 };
 
 export default BudgetBreakdownComponent;