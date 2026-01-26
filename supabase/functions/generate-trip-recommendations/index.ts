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
    const { boardingPoint, destinationPoint, duration, budget } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating recommendations for trip: ${boardingPoint} → ${destinationPoint}, ${duration} days, $${budget} budget`);

    const systemPrompt = `You are a travel planning AI assistant. Generate personalized trip recommendations based on user inputs. Always provide realistic, helpful suggestions.`;

    const userPrompt = `Generate trip recommendations for:
- Boarding Point: ${boardingPoint}
- Destination: ${destinationPoint}
- Duration: ${duration} days
- Budget: $${budget} USD

Provide recommendations in this exact JSON format (no markdown, just raw JSON):
{
  "touristPlaces": [
    {"name": "Place Name", "description": "Brief description", "estimatedTime": "2-3 hours", "entryFee": "$10"}
  ],
  "hotels": [
    {"name": "Hotel Name", "pricePerNight": "$80", "rating": "4.5", "location": "Near city center"}
  ],
  "vehicles": [
    {"type": "Rental Car", "reason": "Best for flexibility", "estimatedCost": "$50/day", "suitableFor": "Families, groups"}
  ],
  "summary": "A brief 1-2 sentence summary of the trip plan"
}

Provide 3-4 tourist places, 3 hotels within budget, and 2 vehicle options. Make recommendations realistic for the destination.`;

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
