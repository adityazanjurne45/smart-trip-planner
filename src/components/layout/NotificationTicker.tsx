import { useState, useEffect, useCallback } from "react";
import { X, Bell, Sparkles, Tag, Plane, MapPin, Hotel } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TickerNotification {
  id: string;
  message: string;
  type: "offer" | "alert" | "tip" | "deal";
  icon?: React.ElementType;
}

const DEFAULT_NOTIFICATIONS: TickerNotification[] = [
  { id: "t1", message: "🔥 Flash Sale: Get up to 40% off on hotel bookings this weekend!", type: "deal", icon: Hotel },
  { id: "t2", message: "✈️ New route alert: Direct flights to Bali now available from major cities", type: "alert", icon: Plane },
  { id: "t3", message: "💡 Travel Tip: Book hotels mid-week for the best rates", type: "tip", icon: Sparkles },
  { id: "t4", message: "🏷️ Use code TRAVELLO20 for 20% off your first trip plan", type: "offer", icon: Tag },
  { id: "t5", message: "📍 Trending destination: Explore the hidden gems of Vietnam this season", type: "alert", icon: MapPin },
  { id: "t6", message: "🌟 New Feature: Compare trips side-by-side with our Trip Comparison tool", type: "tip", icon: Sparkles },
  { id: "t7", message: "🏨 Top-rated hotels in Goa starting at ₹1,499/night", type: "deal", icon: Hotel },
  { id: "t8", message: "⚡ Limited time: Free itinerary PDF download for all trips this month", type: "offer", icon: Tag },
];

const NotificationTicker = () => {
  const [notifications] = useState<TickerNotification[]>(DEFAULT_NOTIFICATIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const rotateNotification = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
      setIsAnimating(false);
    }, 300);
  }, [notifications.length]);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(rotateNotification, 5000);
    return () => clearInterval(interval);
  }, [rotateNotification, dismissed]);

  // Auto-show after dismiss (after 60 seconds)
  useEffect(() => {
    if (!dismissed) return;
    const timeout = setTimeout(() => {
      setDismissed(false);
      setIsVisible(true);
    }, 60000);
    return () => clearTimeout(timeout);
  }, [dismissed]);

  if (dismissed || !isVisible || notifications.length === 0) return null;

  const current = notifications[currentIndex];
  const Icon = current.icon || Bell;

  const bgColor = {
    offer: "from-primary/90 to-primary",
    alert: "from-blue-600 to-blue-500",
    tip: "from-violet-600 to-violet-500",
    deal: "from-emerald-600 to-emerald-500",
  }[current.type];

  return (
    <div
      className={cn(
        "fixed top-16 left-0 right-0 z-40 bg-gradient-to-r text-white py-2 px-4 transition-all duration-300",
        bgColor,
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <p
            className={cn(
              "text-sm font-medium truncate transition-all duration-300",
              isAnimating ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
            )}
          >
            {current.message}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Dot indicators */}
          <div className="hidden sm:flex items-center gap-1">
            {notifications.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentIndex(i);
                    setIsAnimating(false);
                  }, 300);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === currentIndex % 5 ? "bg-white w-3" : "bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => setDismissed(true), 300);
            }}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTicker;
