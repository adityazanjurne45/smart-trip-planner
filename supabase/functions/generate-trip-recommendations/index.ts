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
  eco_mode?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { boardingPoint, destinationPoint, duration, budget, userPreferences, ecoMode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prefs = userPreferences as UserPreferences | undefined;
    
    console.log(`Generating recommendations for trip: ${boardingPoint} → ${destinationPoint}, ${duration} days, $${budget} budget, eco: ${ecoMode}`);
    if (prefs) {
      console.log("User preferences:", JSON.stringify(prefs));
    }

    const systemPrompt = `You are an advanced travel planning AI assistant. Generate personalized, detailed trip recommendations based on user inputs and their travel preferences. Include crowd predictions, cost-saving suggestions, safety information, local culture tips, and route optimization. Always provide realistic, helpful suggestions that match the user's style and requirements.`;

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

    const ecoContext = ecoMode ? `\n\nECO-FRIENDLY MODE ACTIVE: Prioritize fuel-efficient routes, public transport, shared rides, eco-friendly hotels, and sustainable tourism practices. Mark eco-friendly options clearly.` : "";

    const userPrompt = `Generate trip recommendations for:
- Boarding Point: ${boardingPoint}
- Destination: ${destinationPoint}
- Duration: ${duration} days
- Budget: $${budget} USD${preferenceContext}${ecoContext}

Generate comprehensive recommendations including crowd levels, best times to visit, cost-saving tips, safety info, and local culture.

Provide recommendations in this EXACT JSON format (no markdown, just raw JSON):
{
  "touristPlaces": [
    {
      "name": "Place Name",
      "description": "Brief description",
      "estimatedTime": "2-3 hours",
      "entryFee": "$10",
      "crowdLevel": "low|medium|high",
      "bestTimeToVisit": "Morning 8-10 AM to avoid crowds",
      "coordinates": {"lat": 0.0, "lng": 0.0}
    }
  ],
  "hotels": [
    {
      "name": "Hotel Name",
      "pricePerNight": "$80",
      "rating": "4.5",
      "location": "Near city center",
      "distanceToCenter": "2 km",
      "nearbyAttractions": ["Attraction 1", "Attraction 2"],
      "amenities": ["WiFi", "Pool", "Gym"],
      "isEcoFriendly": false,
      "isBestLocation": false,
      "coordinates": {"lat": 0.0, "lng": 0.0}
    }
  ],
  "vehicles": [
    {
      "type": "Rental Car",
      "reason": "Best for flexibility",
      "estimatedCost": "$50/day",
      "suitableFor": "Families, groups",
      "whereToFind": "Airport rental counters, city center agencies",
      "isEcoFriendly": false,
      "tips": "Book in advance for better rates"
    }
  ],
  "summary": "A brief personalized summary of the trip plan",
  "costSavingTips": [
    {"tip": "Book hotels 2 weeks in advance for 20% savings", "savingsEstimate": "$50-100"},
    {"tip": "Use public transport instead of taxis", "savingsEstimate": "$30/day"}
  ],
  "safetyInfo": {
    "emergencyNumbers": {"police": "100", "ambulance": "102", "fire": "101", "tourist_helpline": "1363"},
    "nearbyHospitals": ["Hospital Name - 2km from center"],
    "safetyTips": ["Keep valuables secure", "Stay in well-lit areas at night"],
    "weatherAlerts": []
  },
  "cultureTips": {
    "language": "Local language name",
    "usefulPhrases": [{"phrase": "Hello", "translation": "Local translation", "pronunciation": "Phonetic"}],
    "customs": ["Tip: Remove shoes before entering temples"],
    "localFood": ["Dish 1 - description", "Dish 2 - description"],
    "dressCode": "Modest clothing recommended for religious sites"
  },
  "dayWiseItinerary": [
    {
      "day": 1,
      "theme": "Arrival & City Exploration",
      "activities": [
        {"time": "09:00", "activity": "Activity name", "duration": "2 hours", "cost": "$10", "type": "attraction"},
        {"time": "12:00", "activity": "Lunch at local restaurant", "duration": "1 hour", "cost": "$15", "type": "food"}
      ],
      "totalCost": "$50",
      "travelTip": "Start early to beat the crowds"
    }
  ],
  "budgetBreakdown": {
    "accommodation": 40,
    "food": 25,
    "transport": 15,
    "activities": 15,
    "miscellaneous": 5
  },
  "isEcoFriendly": false
}

Provide 4-5 tourist places with accurate crowd levels, 3-4 hotels (mark best location), 3 vehicle options, complete day-wise itinerary for ${duration} days, real emergency numbers for ${destinationPoint}, and authentic local phrases. Make all recommendations realistic and specific to ${destinationPoint}.`;

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
        // Ensure eco-friendly flag is set based on mode
        if (ecoMode) {
          recommendations.isEcoFriendly = true;
        }
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      // Fallback recommendations with all new fields
      recommendations = {
        touristPlaces: [
          { 
            name: "City Center", 
            description: "Explore the heart of " + destinationPoint, 
            estimatedTime: "3-4 hours", 
            entryFee: "Free",
            crowdLevel: "medium",
            bestTimeToVisit: "Morning 9-11 AM"
          }
        ],
        hotels: [
          { 
            name: "Central Hotel", 
            pricePerNight: "$" + Math.round(budget / duration / 3), 
            rating: "4.2", 
            location: "Downtown",
            distanceToCenter: "1 km",
            nearbyAttractions: ["City Center"],
            isBestLocation: true
          }
        ],
        vehicles: [
          { 
            type: "Public Transport", 
            reason: "Cost effective option", 
            estimatedCost: "$10/day", 
            suitableFor: "Solo travelers",
            whereToFind: "Bus stands and metro stations",
            isEcoFriendly: true
          }
        ],
        summary: `Enjoy your ${duration}-day trip to ${destinationPoint} within your $${budget} budget.`,
        costSavingTips: [
          { tip: "Book accommodations in advance", savingsEstimate: "$50-100" },
          { tip: "Use public transport", savingsEstimate: "$20/day" }
        ],
        safetyInfo: {
          emergencyNumbers: { police: "100", ambulance: "102", fire: "101" },
          nearbyHospitals: ["City Hospital"],
          safetyTips: ["Keep valuables secure", "Stay aware of surroundings"]
        },
        cultureTips: {
          language: "Local language",
          usefulPhrases: [{ phrase: "Hello", translation: "Namaste", pronunciation: "nuh-muh-stay" }],
          customs: ["Respect local traditions"],
          localFood: ["Local cuisine"],
          dressCode: "Casual, modest for religious sites"
        },
        dayWiseItinerary: [],
        budgetBreakdown: {
          accommodation: 40,
          food: 25,
          transport: 15,
          activities: 15,
          miscellaneous: 5
        },
        isEcoFriendly: ecoMode || false
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
