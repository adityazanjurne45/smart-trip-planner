import { Hotel } from "@/types/trip";

type Region =
  | "india"
  | "italy"
  | "france"
  | "japan"
  | "thailand"
  | "indonesia"
  | "spain"
  | "mexico"
  | "uae"
  | "uk"
  | "greece"
  | "switzerland"
  | "egypt"
  | "usa"
  | "global";

type PlaceType = "country" | "city" | "village";

const regionMap: Record<string, Region> = {
  india: "india", delhi: "india", mumbai: "india", goa: "india", jaipur: "india",
  agra: "india", udaipur: "india", kerala: "india", manali: "india", shimla: "india",
  kasol: "india", varanasi: "india", rishikesh: "india", ladakh: "india", bangalore: "india",
  italy: "italy", rome: "italy", milan: "italy", venice: "italy", florence: "italy",
  france: "france", paris: "france", nice: "france", lyon: "france", marseille: "france",
  japan: "japan", tokyo: "japan", kyoto: "japan", osaka: "japan",
  thailand: "thailand", bangkok: "thailand", phuket: "thailand", krabi: "thailand", "chiang mai": "thailand",
  indonesia: "indonesia", bali: "indonesia", jakarta: "indonesia", ubud: "indonesia", seminyak: "indonesia",
  spain: "spain", madrid: "spain", barcelona: "spain", seville: "spain",
  mexico: "mexico", cancun: "mexico", tulum: "mexico",
  uae: "uae", dubai: "uae", "abu dhabi": "uae",
  uk: "uk", london: "uk", england: "uk", scotland: "uk", edinburgh: "uk",
  greece: "greece", athens: "greece", santorini: "greece", mykonos: "greece",
  switzerland: "switzerland", zurich: "switzerland", geneva: "switzerland", interlaken: "switzerland",
  egypt: "egypt", cairo: "egypt", luxor: "egypt",
  usa: "usa", "new york": "usa", "los angeles": "usa", miami: "usa", vegas: "usa", "las vegas": "usa",
};

const detectRegion = (destination: string): Region => {
  const d = destination.toLowerCase();
  for (const key of Object.keys(regionMap)) {
    if (d.includes(key)) return regionMap[key];
  }
  return "global";
};

const KNOWN_COUNTRIES = ["india", "italy", "france", "japan", "thailand", "indonesia", "spain", "mexico", "uae", "uk", "greece", "switzerland", "egypt", "usa", "united states", "england"];
const VILLAGE_HINTS = ["village", "valley", "kasol", "tosh", "malana", "chitkul", "gokarna", "spiti", "munsiyari", "khajjiar"];

const detectPlaceType = (destination: string): PlaceType => {
  const d = destination.toLowerCase().trim();
  if (VILLAGE_HINTS.some((v) => d.includes(v))) return "village";
  if (KNOWN_COUNTRIES.some((c) => d === c || d.endsWith(`, ${c}`))) return "country";
  return "city";
};

interface NamePool {
  prefixes: string[];
  cores: string[];
  suffixes: string[];
  neighborhoods: string[];
  attractions: string[];
}

const POOLS: Record<Region, NamePool> = {
  india: {
    prefixes: ["The", "Hotel", "Taj", "Royal", "Heritage"],
    cores: ["Rajwada", "Amber", "Mahal", "Haveli", "Pink City", "Lotus", "Maharaja", "Saffron", "Mughal"],
    suffixes: ["Palace", "Residency", "Heritage", "Retreat", "Inn", "Niwas"],
    neighborhoods: ["Old City", "MG Road", "Civil Lines", "Near Fort", "Lake View", "Bazaar District"],
    attractions: ["City Palace", "Local Bazaar", "Ancient Fort", "Lake Promenade"],
  },
  italy: {
    prefixes: ["Hotel", "Villa", "Palazzo", "Albergo", "Locanda"],
    cores: ["Roma", "Toscana", "Bellavista", "Fiore", "San Marco", "Aurora", "Medici"],
    suffixes: ["Palace", "Boutique", "Suites", "Residenza", "Dimora"],
    neighborhoods: ["Centro Storico", "Trastevere", "San Marco", "Old Town", "Piazza District"],
    attractions: ["Cathedral Square", "Historic Piazza", "Riverside Walk", "Old Town"],
  },
  france: {
    prefixes: ["Hôtel", "Le", "La", "Maison", "Château"],
    cores: ["Lumière", "Étoile", "Marais", "Riviera", "Provence", "Belle Époque", "Saint-Germain"],
    suffixes: ["Palace", "Boutique", "Résidence", "Retreat", "Suites"],
    neighborhoods: ["Le Marais", "Saint-Germain", "Montmartre", "Vieux Quartier", "Rive Gauche"],
    attractions: ["Old Cathedral", "River Promenade", "Boulevard Walk", "Historic Center"],
  },
  japan: {
    prefixes: ["Hotel", "Ryokan", "The", "Sakura"],
    cores: ["Sakura", "Fuji", "Zen", "Koi", "Shibuya", "Gion", "Hakone"],
    suffixes: ["Ryokan", "Inn", "Suites", "Onsen Retreat", "Tower"],
    neighborhoods: ["Shibuya", "Gion District", "Old Town", "Bay Area", "Temple Quarter"],
    attractions: ["Ancient Temple", "Garden Park", "Night Market", "Shrine Walk"],
  },
  thailand: {
    prefixes: ["The", "Amari", "Anantara", "Banyan"],
    cores: ["Sukhumvit", "Phra Nakhon", "Lotus", "Coral", "Bamboo", "Andaman", "Siam"],
    suffixes: ["Resort", "Beach Retreat", "Boutique", "Villa", "Spa Resort"],
    neighborhoods: ["Beachfront", "Old City", "Riverside", "Night Market District", "Hillside"],
    attractions: ["Beach", "Floating Market", "Grand Palace", "Buddha Temple"],
  },
  indonesia: {
    prefixes: ["The", "Villa", "Alila"],
    cores: ["Ubud", "Seminyak", "Tegalalang", "Bamboo", "Padma", "Canggu", "Sanur"],
    suffixes: ["Villa", "Beach Retreat", "Jungle Resort", "Rice Lodge", "Spa Villa"],
    neighborhoods: ["Ubud Center", "Seminyak Beach", "Canggu", "Sanur", "Jimbaran Bay"],
    attractions: ["Rice Terraces", "Beach Club", "Sacred Temple", "Monkey Forest"],
  },
  spain: {
    prefixes: ["Hotel", "Hostal", "Casa", "Gran Hotel"],
    cores: ["Sol", "Catalunya", "Andaluz", "Mediterráneo", "Flamenco", "Real"],
    suffixes: ["Palace", "Boutique", "Suites", "Plaza", "Centro"],
    neighborhoods: ["Gothic Quarter", "Plaza Mayor", "Old Town", "Las Ramblas", "Triana"],
    attractions: ["Old Cathedral", "Plaza Mayor", "Tapas District", "Historic Quarter"],
  },
  mexico: {
    prefixes: ["Hotel", "Casa", "Hacienda"],
    cores: ["Maya", "Riviera", "Sol", "Coral", "Cenote", "Tulum"],
    suffixes: ["Resort", "Beach Retreat", "Boutique", "Villa", "Hacienda"],
    neighborhoods: ["Beachfront", "Downtown", "Hotel Zone", "Old Town", "Jungle Side"],
    attractions: ["Mayan Ruins", "Cenote", "Beach", "Local Market"],
  },
  uae: {
    prefixes: ["The", "Burj", "Royal"],
    cores: ["Marina", "Palm", "Desert", "Oasis", "Pearl", "Skyline"],
    suffixes: ["Tower", "Residence", "Palace", "Luxury Suites", "Boutique"],
    neighborhoods: ["Marina", "Downtown", "Palm Jumeirah", "Old Souk", "Business Bay"],
    attractions: ["Marina Walk", "Gold Souk", "Desert Safari Point", "Skyline View"],
  },
  uk: {
    prefixes: ["The", "Royal", "Grand"],
    cores: ["Westminster", "Kensington", "Thames", "Mayfair", "Covent", "Highland"],
    suffixes: ["House", "Manor", "Inn", "Boutique", "Suites"],
    neighborhoods: ["Westminster", "Kensington", "Soho", "Covent Garden", "Old Town"],
    attractions: ["Historic Palace", "River Walk", "Museum Quarter", "Market Square"],
  },
  greece: {
    prefixes: ["Hotel", "Villa", "Domes"],
    cores: ["Aegean", "Cycladic", "Santo", "Olympia", "Mykonos", "Caldera"],
    suffixes: ["Suites", "Resort", "Boutique", "White Villa", "Sea View"],
    neighborhoods: ["Caldera View", "Old Port", "Cliffside", "Beachfront", "Village Center"],
    attractions: ["Ancient Ruins", "Caldera Cliffs", "Blue Domes", "Sunset Point"],
  },
  switzerland: {
    prefixes: ["Hotel", "Grand", "Alpen"],
    cores: ["Matterhorn", "Jungfrau", "Alpen", "Edelweiss", "Lac", "Chalet"],
    suffixes: ["Chalet", "Lodge", "Alpine Resort", "Suites", "Palace"],
    neighborhoods: ["Lakefront", "Old Town", "Alpine Village", "Mountainside", "City Center"],
    attractions: ["Mountain Cable Car", "Lake Promenade", "Old Town", "Glacier View"],
  },
  egypt: {
    prefixes: ["Hotel", "The", "Steigenberger"],
    cores: ["Nile", "Pyramid", "Pharaoh", "Sahara", "Cleopatra", "Sphinx"],
    suffixes: ["Palace", "Resort", "Suites", "Boutique", "Riverside"],
    neighborhoods: ["Nile Corniche", "Downtown", "Giza Side", "Old Cairo", "Riverside"],
    attractions: ["Pyramids", "Nile Cruise Point", "Bazaar", "Ancient Temple"],
  },
  usa: {
    prefixes: ["The", "Grand", "Hotel"],
    cores: ["Manhattan", "Hudson", "Sunset", "Beverly", "Liberty", "Bay"],
    suffixes: ["Hotel", "Suites", "Residence", "Boutique", "Plaza"],
    neighborhoods: ["Downtown", "Midtown", "Beachfront", "Old District", "Riverside"],
    attractions: ["Skyline View", "Waterfront", "Historic District", "Central Park Area"],
  },
  global: {
    prefixes: ["The", "Hotel", "Grand", "Royal"],
    cores: ["Central", "Plaza", "Garden", "Riverside", "Sunset", "Heritage"],
    suffixes: ["Hotel", "Suites", "Boutique", "Residence", "Retreat", "Inn"],
    neighborhoods: ["City Center", "Downtown", "Old Town", "Riverside", "Waterfront"],
    attractions: ["City Square", "Local Market", "Historic Center", "Scenic Walk"],
  },
};

const VILLAGE_POOL: NamePool = {
  prefixes: ["The", "Riverside", "Hillview", "Mountain", "Green Valley"],
  cores: ["Pinegrove", "Brookside", "Meadow", "Wildflower", "Cedar", "Apple Orchard", "Stone"],
  suffixes: ["Cottage Stay", "Homestay", "Village Lodge", "Inn", "Retreat", "Farmstay"],
  neighborhoods: ["Village Center", "Hillside", "Riverside", "Orchard Lane", "Forest Edge"],
  attractions: ["Trekking Trail", "Local Waterfall", "Village Temple", "Scenic Viewpoint"],
};

const AMENITY_POOL = [
  ["Free WiFi", "Breakfast included", "Air conditioning"],
  ["Swimming Pool", "Spa", "Gym", "Free WiFi"],
  ["Restaurant", "Bar", "Room service", "Parking"],
  ["Pet friendly", "Family rooms", "Garden", "Free WiFi"],
  ["Rooftop terrace", "Concierge", "Laundry", "WiFi"],
  ["Organic kitchen", "Yoga deck", "Bonfire", "WiFi"],
];

// Deterministic string hash
const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const pick = <T,>(arr: T[], seed: number, offset: number): T => arr[(seed + offset) % arr.length];

export const generateDemoHotels = (destination: string, count = 6): Hotel[] => {
  const region = detectRegion(destination);
  const placeType = detectPlaceType(destination);
  const pool = placeType === "village" ? VILLAGE_POOL : POOLS[region];
  const seed = hash(destination.toLowerCase().trim());

  const used = new Set<string>();
  const hotels: Hotel[] = [];

  let attempt = 0;
  while (hotels.length < count && attempt < count * 6) {
    const i = hotels.length;
    const prefix = pick(pool.prefixes, seed, i * 7 + attempt);
    const core = pick(pool.cores, seed, i * 13 + attempt * 3);
    const suffix = pick(pool.suffixes, seed, i * 19 + attempt * 5);
    const name = `${prefix} ${core} ${suffix}`.replace(/\s+/g, " ").trim();
    attempt++;
    if (used.has(name.toLowerCase())) continue;
    used.add(name.toLowerCase());

    const neighborhood = pick(pool.neighborhoods, seed, i * 11);
    const amenities = AMENITY_POOL[(seed + i) % AMENITY_POOL.length];
    const attractions = [
      pick(pool.attractions, seed, i),
      pick(pool.attractions, seed, i + 2),
    ].filter((v, idx, a) => a.indexOf(v) === idx);

    // Price tiers ($60 - $260)
    const basePrice = 60 + ((seed + i * 37) % 200);
    const rating = (4.2 + ((seed + i * 11) % 7) / 10).toFixed(1);
    const distance = (0.5 + ((seed + i * 5) % 50) / 10).toFixed(1);

    hotels.push({
      name,
      pricePerNight: `$${basePrice}`,
      rating,
      location: `${neighborhood}, ${destination}`,
      distanceToCenter: `${distance} km`,
      nearbyAttractions: attractions,
      amenities,
      isBestLocation: i === 0,
      isEcoFriendly: i === 2 || placeType === "village",
    });
  }

  return hotels;
};

export const mergeWithDemoHotels = (
  destination: string,
  aiHotels: Hotel[] = [],
  total = 6
): Hotel[] => {
  const demo = generateDemoHotels(destination, total);
  const seen = new Set<string>();
  const merged: Hotel[] = [];
  for (const h of [...aiHotels, ...demo]) {
    const key = h.name.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(h);
    if (merged.length >= total) break;
  }
  return merged;
};
