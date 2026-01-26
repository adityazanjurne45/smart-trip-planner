import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserPreferences {
  travel_style?: string;
  accommodation_type?: string;
  transportation_choice?: string;
  traffic_sensitivity?: string;
  food_preference?: string;
  language_preference?: string;
  budget_range_min?: number;
  budget_range_max?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { boardingPoint, destinationPoint, duration, budget, userPreferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prefs = userPreferences as UserPreferences | undefined;
    
    console.log(`Generating recommendations for trip: ${boardingPoint} → ${destinationPoint}, ${duration} days, $${budget} budget`);
    if (prefs) {
      console.log("User preferences:", JSON.stringify(prefs));
    }

    const systemPrompt = `You are a travel planning AI assistant. Generate personalized trip recommendations based on user inputs and their travel preferences. Always provide realistic, helpful suggestions that match the user's style and requirements.`;

    // Build preference context
    let preferenceContext = "";
    if (prefs) {
      const prefParts: string[] = [];
      if (prefs.travel_style) prefParts.push(`Travel style: ${prefs.travel_style.replace('_', ' ')}`);
      if (prefs.accommodation_type) prefParts.push(`Preferred accommodation: ${prefs.accommodation_type.replace('_', ' ')}`);
      if (prefs.transportation_choice) prefParts.push(`Preferred transport: ${prefs.transportation_choice.replace('_', ' ')}`);
      if (prefs.traffic_sensitivity) prefParts.push(`Traffic sensitivity: ${prefs.traffic_sensitivity}`);
      if (prefs.food_preference && prefs.food_preference !== 'no_preference') prefParts.push(`Dietary preference: ${prefs.food_preference.replace('_', ' ')}`);
      if (prefs.language_preference) prefParts.push(`Language preference: ${prefs.language_preference}`);
      
      if (prefParts.length > 0) {
        preferenceContext = `\n\nUser Travel Preferences:\n- ${prefParts.join('\n- ')}`;
      }
    }

    const userPrompt = `Generate trip recommendations for:
- Boarding Point: ${boardingPoint}
- Destination: ${destinationPoint}
- Duration: ${duration} days
- Budget: $${budget} USD${preferenceContext}

IMPORTANT: Tailor all recommendations to match the user's preferences:
- If they prefer budget accommodation, suggest hostels and budget hotels
- If they prefer luxury, suggest high-end resorts and hotels
- Consider their transportation preference for vehicle recommendations
- If they have dietary restrictions, mention restaurants that cater to them
- If traffic sensitivity is high, suggest less congested routes and times

Provide recommendations in this exact JSON format (no markdown, just raw JSON):
{
  "touristPlaces": [
    {"name": "Place Name", "description": "Brief description tailored to user preferences", "estimatedTime": "2-3 hours", "entryFee": "$10"}
  ],
  "hotels": [
    {"name": "Hotel Name", "pricePerNight": "$80", "rating": "4.5", "location": "Near city center"}
  ],
  "vehicles": [
    {"type": "Rental Car", "reason": "Best for flexibility", "estimatedCost": "$50/day", "suitableFor": "Families, groups"}
  ],
  "summary": "A brief 1-2 sentence personalized summary of the trip plan"
}

Provide 3-4 tourist places, 3 hotels matching their accommodation preference and budget, and 2 vehicle options based on their transport preference. Make recommendations realistic for the destination and personalized to their style.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    let recommendations;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      recommendations = {
        touristPlaces: [
          { name: "City Center", description: "Explore the heart of " + destinationPoint, estimatedTime: "3-4 hours", entryFee: "Free" }
        ],
        hotels: [
          { name: "Central Hotel", pricePerNight: "$" + Math.round(budget / duration / 3), rating: "4.2", location: "Downtown" }
        ],
        vehicles: [
          { type: "Public Transport", reason: "Cost effective option", estimatedCost: "$10/day", suitableFor: "Solo travelers" }
        ],
        summary: `Enjoy your ${duration}-day trip to ${destinationPoint} within your $${budget} budget.`
      };
    }

    console.log("Recommendations generated successfully");

    return new Response(JSON.stringify({ recommendations }), {
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
