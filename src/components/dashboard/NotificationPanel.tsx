 import { useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
 } from "@/components/ui/sheet";
 import {
   Bell,
   Calendar,
   CloudRain,
   DollarSign,
   Lightbulb,
   Check,
   X,
 } from "lucide-react";
 import { TripNotification } from "@/types/trip";
 import { cn } from "@/lib/utils";
 
 interface NotificationPanelProps {
   className?: string;
 }
 
 const NotificationPanel = ({ className }: NotificationPanelProps) => {
   const [notifications, setNotifications] = useState<TripNotification[]>([]);
   const [isOpen, setIsOpen] = useState(false);
 
   // Simulate notifications (in real app, these would come from backend/push)
   useEffect(() => {
     const mockNotifications: TripNotification[] = [
       {
         id: "1",
         type: "reminder",
         title: "Trip Starting Soon!",
         message: "Your trip is scheduled to start in 3 days. Make sure to pack!",
         timestamp: new Date().toISOString(),
         isRead: false,
       },
       {
         id: "2",
         type: "weather",
         title: "Weather Alert",
         message: "Expect rain at your destination this week. Pack an umbrella!",
         timestamp: new Date(Date.now() - 3600000).toISOString(),
         isRead: false,
       },
       {
         id: "3",
         type: "tip",
         title: "Travel Tip",
         message: "Book your hotels 2 weeks in advance for better rates.",
         timestamp: new Date(Date.now() - 7200000).toISOString(),
         isRead: true,
       },
     ];
     setNotifications(mockNotifications);
   }, []);
 
   const unreadCount = notifications.filter((n) => !n.isRead).length;
 
   const markAsRead = (id: string) => {
     setNotifications((prev) =>
       prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
     );
   };
 
   const markAllAsRead = () => {
     setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
   };
 
   const dismissNotification = (id: string) => {
     setNotifications((prev) => prev.filter((n) => n.id !== id));
   };
 
   const getIcon = (type: TripNotification["type"]) => {
     switch (type) {
       case "reminder":
         return Calendar;
       case "weather":
         return CloudRain;
       case "budget":
         return DollarSign;
       case "tip":
         return Lightbulb;
       default:
         return Bell;
     }
   };
 
   const getIconColor = (type: TripNotification["type"]) => {
     switch (type) {
       case "reminder":
         return "bg-blue-100 text-blue-600";
       case "weather":
         return "bg-amber-100 text-amber-600";
       case "budget":
         return "bg-green-100 text-green-600";
       case "tip":
         return "bg-purple-100 text-purple-600";
       default:
         return "bg-muted text-muted-foreground";
     }
   };
 
   const formatTime = (timestamp: string) => {
     const diff = Date.now() - new Date(timestamp).getTime();
     const minutes = Math.floor(diff / 60000);
     if (minutes < 60) return `${minutes}m ago`;
     const hours = Math.floor(minutes / 60);
     if (hours < 24) return `${hours}h ago`;
     return `${Math.floor(hours / 24)}d ago`;
   };
 
   return (
     <Sheet open={isOpen} onOpenChange={setIsOpen}>
       <SheetTrigger asChild>
         <Button variant="ghost" size="icon" className={cn("relative", className)}>
           <Bell className="w-5 h-5" />
           {unreadCount > 0 && (
             <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
               {unreadCount}
             </Badge>
           )}
         </Button>
       </SheetTrigger>
       <SheetContent className="w-[400px] sm:w-[540px]">
         <SheetHeader className="pb-4 border-b">
           <div className="flex items-center justify-between">
             <SheetTitle className="flex items-center gap-2">
               <Bell className="w-5 h-5 text-primary" />
               Notifications
               {unreadCount > 0 && (
                 <Badge variant="secondary">{unreadCount} new</Badge>
               )}
             </SheetTitle>
             {unreadCount > 0 && (
               <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                 <Check className="w-4 h-4 mr-1" />
                 Mark all read
               </Button>
             )}
           </div>
         </SheetHeader>
 
         <div className="mt-4 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
           {notifications.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
               <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
               <p>No notifications yet</p>
             </div>
           ) : (
             notifications.map((notification) => {
               const Icon = getIcon(notification.type);
               return (
                 <div
                   key={notification.id}
                   className={cn(
                     "flex items-start gap-3 p-3 rounded-xl border transition-all",
                     notification.isRead
                       ? "bg-background border-border"
                       : "bg-primary/5 border-primary/20"
                   )}
                   onClick={() => markAsRead(notification.id)}
                 >
                   <div
                     className={cn(
                       "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                       getIconColor(notification.type)
                     )}
                   >
                     <Icon className="w-5 h-5" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex items-start justify-between gap-2">
                       <h4 className="font-medium text-sm">
                         {notification.title}
                       </h4>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-6 w-6 shrink-0"
                         onClick={(e) => {
                           e.stopPropagation();
                           dismissNotification(notification.id);
                         }}
                       >
                         <X className="w-3 h-3" />
                       </Button>
                     </div>
                     <p className="text-sm text-muted-foreground mt-1">
                       {notification.message}
                     </p>
                     <p className="text-xs text-muted-foreground mt-2">
                       {formatTime(notification.timestamp)}
                     </p>
                   </div>
                 </div>
               );
             })
           )}
         </div>
       </SheetContent>
     </Sheet>
   );
 };
 
 export default NotificationPanel;