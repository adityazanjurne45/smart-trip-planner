import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Cloud, Droplets, Wind, Thermometer, Sun, CloudRain, Snowflake, CloudFog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    condition: string;
    description: string;
    icon: string;
    windSpeed: number;
    city: string;
    country: string;
  };
  forecast: {
    date: string;
    temp: number;
    humidity: number;
    condition: string;
    description: string;
    icon: string;
    windSpeed: number;
  }[] | null;
}

interface WeatherCardProps {
  destination: string;
  onWeatherLoad?: (weather: { temp: number; condition: string }) => void;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun className="w-8 h-8 text-travel-gold" />;
    case "rain":
    case "drizzle":
      return <CloudRain className="w-8 h-8 text-primary" />;
    case "snow":
      return <Snowflake className="w-8 h-8 text-blue-300" />;
    case "mist":
    case "fog":
    case "haze":
      return <CloudFog className="w-8 h-8 text-muted-foreground" />;
    default:
      return <Cloud className="w-8 h-8 text-muted-foreground" />;
  }
};

const getSmallWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun className="w-5 h-5 text-travel-gold" />;
    case "rain":
    case "drizzle":
      return <CloudRain className="w-5 h-5 text-primary" />;
    case "snow":
      return <Snowflake className="w-5 h-5 text-blue-300" />;
    case "mist":
    case "fog":
    case "haze":
      return <CloudFog className="w-5 h-5 text-muted-foreground" />;
    default:
      return <Cloud className="w-5 h-5 text-muted-foreground" />;
  }
};

const WeatherCard = ({ destination, onWeatherLoad }: WeatherCardProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fnError } = await supabase.functions.invoke("get-weather", {
          body: { destination },
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setWeather(data);
        
        // Notify parent component of weather data
        if (onWeatherLoad && data?.current) {
          onWeatherLoad({
            temp: data.current.temp,
            condition: data.current.condition,
          });
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  if (loading) {
    return (
      <Card className="travel-card">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="travel-card border-destructive/20 bg-destructive/5">
        <CardContent className="py-6 text-center">
          <Cloud className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Weather unavailable for {destination}</p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="travel-card overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-travel-coral/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            Weather in {weather.current.city}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {weather.current.country}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        {/* Current Weather */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            {getWeatherIcon(weather.current.condition)}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">{weather.current.temp}</span>
              <span className="text-xl text-muted-foreground">°C</span>
            </div>
            <p className="text-sm text-muted-foreground capitalize">{weather.current.description}</p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <Thermometer className="w-4 h-4 text-travel-coral mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Feels Like</p>
            <p className="font-semibold text-foreground">{weather.current.feelsLike}°C</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <Droplets className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="font-semibold text-foreground">{weather.current.humidity}%</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <Wind className="w-4 h-4 text-travel-forest mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="font-semibold text-foreground">{weather.current.windSpeed} m/s</p>
          </div>
        </div>

        {/* 5-Day Forecast */}
        {weather.forecast && weather.forecast.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">5-Day Forecast</h4>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {weather.forecast.map((day, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-muted/30 rounded-xl p-3 text-center min-w-[80px]"
                >
                  <p className="text-xs text-muted-foreground mb-2">{day.date.split(',')[0]}</p>
                  <div className="flex justify-center mb-2">
                    {getSmallWeatherIcon(day.condition)}
                  </div>
                  <p className="font-semibold text-foreground text-sm">{day.temp}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
