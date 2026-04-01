import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination } = await req.json();
    const API_KEY = Deno.env.get("OPENWEATHERMAP_API_KEY");

    if (!API_KEY) {
      throw new Error("OPENWEATHERMAP_API_KEY is not configured");
    }

    if (!destination) {
      throw new Error("Destination is required");
    }

    console.log(`Fetching weather for: ${destination}`);

    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(destination)}&appid=${API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      console.error("Weather API error:", errorData);
      // Return graceful response instead of throwing
      return new Response(
        JSON.stringify({ current: null, forecast: null, error: errorData.message || "city not found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const weatherData = await weatherResponse.json();

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(destination)}&appid=${API_KEY}&units=metric&cnt=40`
    );

    let forecastData = null;
    if (forecastResponse.ok) {
      const rawForecast = await forecastResponse.json();
      // Get one forecast per day (every 8th item since it's 3-hour intervals)
      forecastData = rawForecast.list
        .filter((_: unknown, index: number) => index % 8 === 0)
        .slice(0, 5)
        .map((item: { dt: number; main: { temp: number; humidity: number }; weather: { main: string; description: string; icon: string }[]; wind: { speed: number } }) => ({
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temp: Math.round(item.main.temp),
          humidity: item.main.humidity,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          windSpeed: item.wind.speed,
        }));
    } else {
      await forecastResponse.text();
    }

    const result = {
      current: {
        temp: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        windSpeed: weatherData.wind.speed,
        city: weatherData.name,
        country: weatherData.sys.country,
      },
      forecast: forecastData,
    };

    console.log("Weather data fetched successfully");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
