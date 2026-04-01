import { useState, useEffect, useCallback } from "react";
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
  Sun,
  Snowflake,
  ThermometerSun,
  Lightbulb,
  Check,
  X,
  Plane,
  AlertTriangle,
  Wind,
  Umbrella,
} from "lucide-react";
import { TripNotification } from "@/types/trip";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, parseISO } from "date-fns";

interface SmartNotificationPanelProps {
  className?: string;
  destination?: string;
  tripStartDate?: string;
}

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    description: string;
  };
  forecast?: Array<{
    date: string;
    temp: number;
    condition: string;
  }>;
}

const SmartNotificationPanel = ({ className, destination, tripStartDate }: SmartNotificationPanelProps) => {
  const [notifications, setNotifications] = useState<TripNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const generateWeatherNotifications = useCallback((weather: WeatherData): TripNotification[] => {
    const weatherNotifs: TripNotification[] = [];
    const { temp, condition, description } = weather.current;
    const conditionLower = condition.toLowerCase();

    // Temperature-based notifications
    if (temp <= 5) {
      weatherNotifs.push({
        id: `weather-cold-${Date.now()}`,
        type: "weather",
        title: "❄️ Freezing Weather Alert",
        message: `Temperature is ${temp}°C. Pack heavy winter clothes, thermals, and warm layers.`,
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    } else if (temp <= 15) {
      weatherNotifs.push({
        id: `weather-cool-${Date.now()}`,
        type: "weather",
        title: "🧥 Cool Weather",
        message: `Temperature is ${temp}°C. Carry warm clothes, sweaters, and a light jacket.`,
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    } else if (temp >= 40) {
      weatherNotifs.push({
        id: `weather-extreme-${Date.now()}`,
        type: "weather",
        title: "🔥 Extreme Heat Warning",
        message: `Temperature is ${temp}°C! Stay hydrated, wear light clothes, and avoid outdoor activities during peak hours.`,
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    } else if (temp >= 35) {
      weatherNotifs.push({
        id: `weather-hot-${Date.now()}`,
        type: "weather",
        title: "☀️ Hot Weather Alert",
        message: `Temperature is ${temp}°C. Light cotton clothes and sunscreen recommended.`,
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    }

    // Condition-based notifications
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      weatherNotifs.push({
        id: `weather-rain-${Date.now()}`,
        type: "weather",
        title: "🌧️ Rain Expected",
        message: `${description}. Carry an umbrella or raincoat and waterproof footwear.`,
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    }

    if (conditionLower.includes("storm") || conditionLower.includes("thunder")) {
      weatherNotifs.push({
        id: `weather-storm-${Date.now()}`,
        type: "weather",
        title: "⛈️ Storm Warning",
        message: "Thunderstorm expected! Avoid open areas and stay indoors during the storm.",
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    }

    if (conditionLower.includes("snow")) {
      weatherNotifs.push({
        id: `weather-snow-${Date.now()}`,
        type: "weather",
        title: "🌨️ Snowfall Expected",
        message: "Snow forecast! Pack insulated waterproof gear and be prepared for icy conditions.",
        timestamp: new Date().toISOString(),
        isRead: false,
      });
    }

    return weatherNotifs;
  }, []);

  const generateTripReminders = useCallback((): TripNotification[] => {
    const reminders: TripNotification[] = [];
    
    if (tripStartDate) {
      const startDate = parseISO(tripStartDate);
      const daysUntilTrip = differenceInDays(startDate, new Date());

      if (daysUntilTrip === 0) {
        reminders.push({
          id: `reminder-today-${Date.now()}`,
          type: "reminder",
          title: "🎉 Trip Starts Today!",
          message: `Your trip${destination ? ` to ${destination}` : ""} starts today! Have an amazing journey!`,
          timestamp: new Date().toISOString(),
          isRead: false,
        });
      } else if (daysUntilTrip === 1) {
        reminders.push({
          id: `reminder-tomorrow-${Date.now()}`,
          type: "reminder",
          title: "📅 Trip Starts Tomorrow!",
          message: `Your trip${destination ? ` to ${destination}` : ""} starts tomorrow. Final packing time!`,
          timestamp: new Date().toISOString(),
          isRead: false,
        });
      } else if (daysUntilTrip <= 3 && daysUntilTrip > 0) {
        reminders.push({
          id: `reminder-soon-${Date.now()}`,
          type: "reminder",
          title: `📆 Trip in ${daysUntilTrip} Days`,
          message: `Your trip${destination ? ` to ${destination}` : ""} is coming up! Start preparing your travel essentials.`,
          timestamp: new Date().toISOString(),
          isRead: false,
        });
      } else if (daysUntilTrip <= 7 && daysUntilTrip > 0) {
        reminders.push({
          id: `reminder-week-${Date.now()}`,
          type: "reminder",
          title: "🗓️ Trip in a Week",
          message: `Your trip${destination ? ` to ${destination}` : ""} is ${daysUntilTrip} days away. Time to plan your packing list!`,
          timestamp: new Date().toISOString(),
          isRead: false,
        });
      }
    }

    return reminders;
  }, [destination, tripStartDate]);

  // Fetch weather for destination
  useEffect(() => {
    const fetchWeather = async () => {
      if (!destination) return;

      try {
        const { data, error } = await supabase.functions.invoke("get-weather", {
          body: { destination },
        });

        if (!error && data && !data.error) {
          setWeatherData(data);
        }
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
    };

    fetchWeather();
  }, [destination]);

  // Generate notifications based on weather and trip dates
  useEffect(() => {
    const allNotifications: TripNotification[] = [];

    // Add trip reminders
    allNotifications.push(...generateTripReminders());

    // Add weather notifications
    if (weatherData) {
      allNotifications.push(...generateWeatherNotifications(weatherData));
    }

    // Dynamic travel alerts & offers
    const dynamicAlerts: TripNotification[] = [
      {
        id: "alert-deals",
        type: "tip",
        title: "🏷️ Exclusive Deals",
        message: destination
          ? `Check out special hotel deals in ${destination} — save up to 30%!`
          : "Explore trending travel deals and save on your next trip!",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isRead: false,
      },
      {
        id: "alert-safety",
        type: "tip",
        title: "🛡️ Travel Safety",
        message: "Always carry digital copies of your ID and travel documents for emergencies.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
      },
      {
        id: "alert-budget",
        type: "budget",
        title: "💰 Budget Tip",
        message: "Book accommodations mid-week to save 15-25% compared to weekend rates.",
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        isRead: true,
      },
    ];

    if (destination) {
      dynamicAlerts.unshift({
        id: "alert-destination",
        type: "tip",
        title: `📍 ${destination} Insider Tip`,
        message: `Explore local street food and hidden gems in ${destination} for an authentic experience!`,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        isRead: false,
      });
    }

    allNotifications.push(...dynamicAlerts);

    setNotifications(allNotifications);
  }, [weatherData, generateTripReminders, generateWeatherNotifications, destination]);

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

  const getIcon = (type: TripNotification["type"], title?: string) => {
    // Check for specific weather icons based on title
    if (title?.includes("❄️") || title?.includes("🌨️")) return Snowflake;
    if (title?.includes("🔥") || title?.includes("☀️")) return ThermometerSun;
    if (title?.includes("🌧️")) return Umbrella;
    if (title?.includes("⛈️")) return AlertTriangle;
    if (title?.includes("🎉") || title?.includes("📅") || title?.includes("📆") || title?.includes("🗓️")) return Plane;
    
    switch (type) {
      case "reminder":
        return Calendar;
      case "weather":
        return CloudRain;
      case "tip":
        return Lightbulb;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: TripNotification["type"], title?: string) => {
    if (title?.includes("❄️") || title?.includes("🌨️")) return "bg-blue-100 text-blue-600";
    if (title?.includes("🔥")) return "bg-red-100 text-red-600";
    if (title?.includes("☀️")) return "bg-amber-100 text-amber-600";
    if (title?.includes("⛈️")) return "bg-red-100 text-red-600";
    if (title?.includes("🌧️")) return "bg-primary/10 text-primary";
    
    switch (type) {
      case "reminder":
        return "bg-blue-100 text-blue-600";
      case "weather":
        return "bg-amber-100 text-amber-600";
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
              Smart Notifications
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
          {destination && (
            <p className="text-sm text-muted-foreground mt-1">
              Notifications for your trip to {destination}
            </p>
          )}
        </SheetHeader>

        <div className="mt-4 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm mt-1">Plan a trip to get personalized alerts!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type, notification.title);
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                    notification.isRead
                      ? "bg-background border-border"
                      : "bg-primary/5 border-primary/20"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      getIconColor(notification.type, notification.title)
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm">
                        {notification.title.replace(/^[^\w\s]+\s*/, "")}
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

export default SmartNotificationPanel;
