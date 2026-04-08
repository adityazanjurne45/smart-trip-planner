import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  UtensilsCrossed, Leaf, Drumstick, Search, MapPin, Navigation,
  Star, TrendingUp, Coffee, IceCreamCone, ShoppingBag, Flame,
  Filter, X
} from "lucide-react";
import { TripDetails } from "@/types/trip";
import { getCurrencyForDestination } from "@/lib/currency";

interface FoodItem {
  name: string;
  description: string;
  category: "veg" | "non-veg";
  priceRange: string;
  type: "street_food" | "restaurant" | "dessert" | "beverage";
  popularity: "must_try" | "famous" | "local_favorite";
  bestPlace: { name: string; location: string };
  coordinates?: { lat: number; lng: number };
}

interface FoodieCornerProps {
  tripDetails: TripDetails;
}

const DESTINATION_FOODS: Record<string, FoodItem[]> = {
  goa: [
    { name: "Fish Curry Rice", description: "Traditional Goan staple with spicy coconut-based fish curry served with steamed rice.", category: "non-veg", priceRange: "150-350", type: "restaurant", popularity: "must_try", bestPlace: { name: "Ritz Classic", location: "Panjim, Goa" }, coordinates: { lat: 15.4989, lng: 73.8278 } },
    { name: "Bebinca", description: "A traditional Goan layered dessert made with coconut milk, sugar, and egg yolks.", category: "veg", priceRange: "100-250", type: "dessert", popularity: "famous", bestPlace: { name: "Cafe Bodega", location: "Sunaparanta, Panjim" }, coordinates: { lat: 15.4956, lng: 73.8277 } },
    { name: "Pork Vindaloo", description: "Fiery Goan curry with tender pork marinated in vinegar and spices.", category: "non-veg", priceRange: "250-500", type: "restaurant", popularity: "must_try", bestPlace: { name: "Vinayak Family Restaurant", location: "Assagao, Goa" } },
    { name: "Feni", description: "Locally distilled spirit made from cashew apples or coconut sap, unique to Goa.", category: "veg", priceRange: "50-200", type: "beverage", popularity: "local_favorite", bestPlace: { name: "Joseph Bar", location: "Anjuna, Goa" } },
    { name: "Prawn Balchão", description: "Tangy and spicy prawn pickle-style dish, a Goan household favorite.", category: "non-veg", priceRange: "200-400", type: "restaurant", popularity: "famous", bestPlace: { name: "Martin's Corner", location: "Betalbatim, Goa" } },
    { name: "Poi Bread", description: "Soft, spongy Goan bread baked in traditional wood-fired ovens.", category: "veg", priceRange: "10-30", type: "street_food", popularity: "local_favorite", bestPlace: { name: "Local Bakeries", location: "Mapusa Market, Goa" } },
  ],
  mumbai: [
    { name: "Vada Pav", description: "Mumbai's iconic street food — spicy potato fritter in a bun with chutneys.", category: "veg", priceRange: "20-50", type: "street_food", popularity: "must_try", bestPlace: { name: "Ashok Vada Pav", location: "Kirti College, Dadar" }, coordinates: { lat: 19.0222, lng: 72.8432 } },
    { name: "Pav Bhaji", description: "Buttery mashed vegetable curry served with toasted bread rolls.", category: "veg", priceRange: "80-200", type: "street_food", popularity: "must_try", bestPlace: { name: "Sardar Pav Bhaji", location: "Tardeo, Mumbai" } },
    { name: "Bombay Sandwich", description: "Layered vegetable sandwich with green chutney and masala, grilled to perfection.", category: "veg", priceRange: "40-100", type: "street_food", popularity: "famous", bestPlace: { name: "Swati Snacks", location: "Nariman Point" } },
    { name: "Misal Pav", description: "Spicy sprouted bean curry topped with farsan, onions, and lemon, served with bread.", category: "veg", priceRange: "60-150", type: "street_food", popularity: "local_favorite", bestPlace: { name: "Aaswad", location: "Dadar, Mumbai" } },
    { name: "Chicken Tikka", description: "Juicy tandoori chicken pieces marinated in yogurt and spices.", category: "non-veg", priceRange: "200-450", type: "restaurant", popularity: "famous", bestPlace: { name: "Bademiya", location: "Colaba, Mumbai" } },
    { name: "Cutting Chai", description: "Half-cup of strong, sweet tea brewed with ginger, a Mumbai ritual.", category: "veg", priceRange: "10-30", type: "beverage", popularity: "local_favorite", bestPlace: { name: "Any roadside stall", location: "Marine Drive, Mumbai" } },
  ],
  delhi: [
    { name: "Chole Bhature", description: "Fluffy deep-fried bread served with spicy chickpea curry — a Delhi breakfast staple.", category: "veg", priceRange: "60-150", type: "street_food", popularity: "must_try", bestPlace: { name: "Sita Ram Diwan Chand", location: "Paharganj, Delhi" } },
    { name: "Butter Chicken", description: "Creamy, mildly spiced tomato-based chicken curry, born in Old Delhi.", category: "non-veg", priceRange: "250-500", type: "restaurant", popularity: "must_try", bestPlace: { name: "Moti Mahal Delux", location: "Daryaganj, Delhi" } },
    { name: "Parantha", description: "Stuffed flatbreads with various fillings, fried in ghee, served with yogurt.", category: "veg", priceRange: "50-120", type: "street_food", popularity: "famous", bestPlace: { name: "Parathe Wali Gali", location: "Chandni Chowk, Delhi" } },
    { name: "Jalebi", description: "Crispy, syrup-soaked spirals of sweetness, best enjoyed hot and fresh.", category: "veg", priceRange: "30-80", type: "dessert", popularity: "famous", bestPlace: { name: "Old Famous Jalebi Wala", location: "Chandni Chowk, Delhi" } },
    { name: "Kebabs", description: "Succulent minced meat skewers, grilled on charcoal, Old Delhi style.", category: "non-veg", priceRange: "150-400", type: "street_food", popularity: "must_try", bestPlace: { name: "Karim's", location: "Jama Masjid, Delhi" } },
    { name: "Lassi", description: "Thick, creamy yogurt drink, sweet or salted, a refreshing Delhi classic.", category: "veg", priceRange: "30-80", type: "beverage", popularity: "local_favorite", bestPlace: { name: "Amritsari Lassi Wala", location: "Chandni Chowk, Delhi" } },
  ],
  jaipur: [
    { name: "Dal Baati Churma", description: "Baked wheat balls with lentil curry and sweetened crushed wheat — quintessential Rajasthani.", category: "veg", priceRange: "100-250", type: "restaurant", popularity: "must_try", bestPlace: { name: "Laxmi Mishthan Bhandar (LMB)", location: "Johari Bazaar, Jaipur" } },
    { name: "Pyaaz Kachori", description: "Deep-fried pastry stuffed with spiced onion filling, crispy and flavorful.", category: "veg", priceRange: "20-60", type: "street_food", popularity: "must_try", bestPlace: { name: "Rawat Mishthan Bhandar", location: "Station Road, Jaipur" } },
    { name: "Laal Maas", description: "Fiery red mutton curry made with Mathania chillies, a Rajasthani royal dish.", category: "non-veg", priceRange: "300-600", type: "restaurant", popularity: "famous", bestPlace: { name: "Handi Restaurant", location: "MI Road, Jaipur" } },
    { name: "Ghewar", description: "Disc-shaped sweet soaked in sugar syrup, a Rajasthani festive delicacy.", category: "veg", priceRange: "50-200", type: "dessert", popularity: "famous", bestPlace: { name: "LMB", location: "Johari Bazaar, Jaipur" } },
    { name: "Kulfi Falooda", description: "Dense Indian ice cream served with vermicelli, rose syrup, and nuts.", category: "veg", priceRange: "40-100", type: "dessert", popularity: "local_favorite", bestPlace: { name: "Pandit Kulfi", location: "Chaura Rasta, Jaipur" } },
  ],
  manali: [
    { name: "Siddu", description: "Steamed wheat bread stuffed with poppy seeds or walnuts, served with ghee.", category: "veg", priceRange: "50-120", type: "restaurant", popularity: "must_try", bestPlace: { name: "Johnson's Cafe", location: "Old Manali" } },
    { name: "Trout Fish", description: "Freshly caught river trout grilled or fried, a Himalayan specialty.", category: "non-veg", priceRange: "250-500", type: "restaurant", popularity: "famous", bestPlace: { name: "Lazy Dog Lounge", location: "Old Manali" } },
    { name: "Momos", description: "Steamed or fried dumplings with vegetable or meat filling, served with spicy chutney.", category: "veg", priceRange: "50-120", type: "street_food", popularity: "must_try", bestPlace: { name: "Chopsticks Restaurant", location: "Mall Road, Manali" } },
    { name: "Thukpa", description: "Hot noodle soup with vegetables or meat, perfect for cold mountain evenings.", category: "veg", priceRange: "80-180", type: "restaurant", popularity: "local_favorite", bestPlace: { name: "Drifters Cafe", location: "Old Manali" } },
  ],
  paris: [
    { name: "Croissant", description: "Flaky, buttery pastry layered to perfection — the quintessential French breakfast.", category: "veg", priceRange: "2-5", type: "dessert", popularity: "must_try", bestPlace: { name: "Du Pain et des Idées", location: "10th Arrondissement, Paris" } },
    { name: "Crêpes", description: "Thin French pancakes filled with Nutella, strawberries, or savory ingredients.", category: "veg", priceRange: "4-10", type: "street_food", popularity: "must_try", bestPlace: { name: "Breizh Café", location: "Le Marais, Paris" } },
    { name: "Coq au Vin", description: "Classic French braised chicken in red wine with mushrooms and onions.", category: "non-veg", priceRange: "15-30", type: "restaurant", popularity: "famous", bestPlace: { name: "Le Bouillon Chartier", location: "9th Arrondissement, Paris" } },
    { name: "Macaron", description: "Delicate meringue sandwich cookies in vibrant colors and flavors.", category: "veg", priceRange: "2-4", type: "dessert", popularity: "famous", bestPlace: { name: "Ladurée", location: "Champs-Élysées, Paris" } },
    { name: "French Onion Soup", description: "Rich beef broth with caramelized onions, topped with melted Gruyère cheese.", category: "veg", priceRange: "8-15", type: "restaurant", popularity: "local_favorite", bestPlace: { name: "Au Pied de Cochon", location: "Les Halles, Paris" } },
  ],
  tokyo: [
    { name: "Sushi", description: "Fresh raw fish over vinegared rice — Tokyo is the sushi capital of the world.", category: "non-veg", priceRange: "1000-5000", type: "restaurant", popularity: "must_try", bestPlace: { name: "Sushi Dai", location: "Toyosu Market, Tokyo" } },
    { name: "Ramen", description: "Rich broth noodle soup with pork, egg, and green onions.", category: "non-veg", priceRange: "800-1500", type: "restaurant", popularity: "must_try", bestPlace: { name: "Ichiran Ramen", location: "Shibuya, Tokyo" } },
    { name: "Takoyaki", description: "Crispy octopus balls drizzled with sauce and bonito flakes, a popular snack.", category: "non-veg", priceRange: "400-800", type: "street_food", popularity: "famous", bestPlace: { name: "Gindaco", location: "Shinjuku, Tokyo" } },
    { name: "Matcha Latte", description: "Stone-ground green tea whisked to perfection, a serene Japanese experience.", category: "veg", priceRange: "300-600", type: "beverage", popularity: "local_favorite", bestPlace: { name: "Suzukien", location: "Asakusa, Tokyo" } },
    { name: "Mochi", description: "Soft rice cakes filled with sweet red bean paste or ice cream.", category: "veg", priceRange: "200-500", type: "dessert", popularity: "famous", bestPlace: { name: "Nakatanidou", location: "Nara (day trip from Tokyo)" } },
  ],
  bali: [
    { name: "Nasi Goreng", description: "Indonesian fried rice with sweet soy sauce, shrimp paste, and a fried egg on top.", category: "non-veg", priceRange: "25000-60000", type: "street_food", popularity: "must_try", bestPlace: { name: "Warung Babi Guling Ibu Oka", location: "Ubud, Bali" } },
    { name: "Satay", description: "Grilled meat skewers served with rich peanut dipping sauce.", category: "non-veg", priceRange: "20000-50000", type: "street_food", popularity: "must_try", bestPlace: { name: "Sate Bali", location: "Seminyak, Bali" } },
    { name: "Babi Guling", description: "Balinese-style roasted suckling pig seasoned with turmeric and spices.", category: "non-veg", priceRange: "50000-100000", type: "restaurant", popularity: "famous", bestPlace: { name: "Ibu Oka", location: "Ubud, Bali" } },
    { name: "Es Campur", description: "Colorful shaved ice dessert with fruits, jellies, and coconut milk.", category: "veg", priceRange: "10000-25000", type: "dessert", popularity: "local_favorite", bestPlace: { name: "Tukies Coconut Shop", location: "Canggu, Bali" } },
  ],
  bangkok: [
    { name: "Pad Thai", description: "Stir-fried rice noodles with shrimp, peanuts, lime, and bean sprouts.", category: "non-veg", priceRange: "40-120", type: "street_food", popularity: "must_try", bestPlace: { name: "Thipsamai", location: "Phra Nakhon, Bangkok" } },
    { name: "Tom Yum Goong", description: "Hot and sour shrimp soup with lemongrass, lime leaves, and chili.", category: "non-veg", priceRange: "80-200", type: "restaurant", popularity: "must_try", bestPlace: { name: "P'Aor", location: "Phetchaburi, Bangkok" } },
    { name: "Mango Sticky Rice", description: "Sweet glutinous rice with fresh mango and coconut cream.", category: "veg", priceRange: "40-100", type: "dessert", popularity: "famous", bestPlace: { name: "Mae Varee", location: "Thonglor, Bangkok" } },
    { name: "Thai Iced Tea", description: "Sweet, creamy, and vibrant orange tea served over ice.", category: "veg", priceRange: "30-60", type: "beverage", popularity: "local_favorite", bestPlace: { name: "ChaTraMue", location: "Throughout Bangkok" } },
  ],
  newyork: [
    { name: "New York Pizza", description: "Thin-crust, foldable pizza slices with tangy tomato sauce and gooey mozzarella.", category: "veg", priceRange: "3-6", type: "street_food", popularity: "must_try", bestPlace: { name: "Joe's Pizza", location: "Greenwich Village, NYC" } },
    { name: "Bagel & Lox", description: "Toasted bagel with cream cheese, smoked salmon, capers, and red onion.", category: "non-veg", priceRange: "8-15", type: "restaurant", popularity: "must_try", bestPlace: { name: "Russ & Daughters", location: "Lower East Side, NYC" } },
    { name: "Cheesecake", description: "Rich, creamy New York-style cheesecake with a graham cracker crust.", category: "veg", priceRange: "6-12", type: "dessert", popularity: "famous", bestPlace: { name: "Junior's", location: "Brooklyn, NYC" } },
    { name: "Hot Dog", description: "Classic all-beef hot dog with mustard, sauerkraut, and relish.", category: "non-veg", priceRange: "3-7", type: "street_food", popularity: "local_favorite", bestPlace: { name: "Gray's Papaya", location: "Upper West Side, NYC" } },
  ],
};

// Normalize destination to match keys
const normalizeDestination = (dest: string): string => {
  const lower = dest.toLowerCase().replace(/[^a-z]/g, "");
  for (const key of Object.keys(DESTINATION_FOODS)) {
    if (lower.includes(key) || key.includes(lower)) return key;
  }
  // Check partial matches
  const aliases: Record<string, string> = {
    "newyork": "newyork", "nyc": "newyork", "newdelhi": "delhi",
    "bengaluru": "mumbai", "bombay": "mumbai", "calcutta": "mumbai",
    "indonesia": "bali", "thailand": "bangkok", "france": "paris", "japan": "tokyo",
  };
  for (const [alias, key] of Object.entries(aliases)) {
    if (lower.includes(alias)) return key;
  }
  return "";
};

const getDefaultFoods = (dest: string): FoodItem[] => [
  { name: "Local Street Snack", description: `A popular roadside snack unique to ${dest}, enjoyed by locals and visitors alike.`, category: "veg", priceRange: "2-8", type: "street_food", popularity: "must_try", bestPlace: { name: "Central Market", location: `Downtown ${dest}` } },
  { name: "Traditional Main Course", description: `A hearty traditional dish that reflects the culinary culture of ${dest}.`, category: "non-veg", priceRange: "10-25", type: "restaurant", popularity: "famous", bestPlace: { name: "Heritage Restaurant", location: `Old Town, ${dest}` } },
  { name: "Local Dessert", description: `A sweet delicacy native to ${dest}, perfect for ending a meal on a high note.`, category: "veg", priceRange: "3-10", type: "dessert", popularity: "local_favorite", bestPlace: { name: "Sweet Corner", location: `${dest} City Center` } },
  { name: "Regional Beverage", description: `A refreshing local drink that captures the flavors of ${dest}.`, category: "veg", priceRange: "2-6", type: "beverage", popularity: "local_favorite", bestPlace: { name: "Local Café", location: `Main Street, ${dest}` } },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  street_food: <ShoppingBag className="w-3.5 h-3.5" />,
  restaurant: <UtensilsCrossed className="w-3.5 h-3.5" />,
  dessert: <IceCreamCone className="w-3.5 h-3.5" />,
  beverage: <Coffee className="w-3.5 h-3.5" />,
};

const TYPE_LABELS: Record<string, string> = {
  street_food: "Street Food", restaurant: "Restaurant", dessert: "Dessert", beverage: "Beverage",
};

const POPULARITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  must_try: { bg: "bg-destructive/10", text: "text-destructive", label: "🔥 Must Try" },
  famous: { bg: "bg-primary/10", text: "text-primary", label: "⭐ Famous" },
  local_favorite: { bg: "bg-accent/10", text: "text-accent-foreground", label: "💛 Local Favorite" },
};

const FoodieCorner = ({ tripDetails }: FoodieCornerProps) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const currency = getCurrencyForDestination(tripDetails.destinationPoint);
  const key = normalizeDestination(tripDetails.destinationPoint);
  const allFoods = key ? DESTINATION_FOODS[key] : getDefaultFoods(tripDetails.destinationPoint);

  const filteredFoods = useMemo(() => {
    return allFoods.filter((f) => {
      if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
      if (typeFilter !== "all" && f.type !== typeFilter) return false;
      if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [allFoods, categoryFilter, typeFilter, search]);

  const mustTryFoods = allFoods.filter((f) => f.popularity === "must_try").slice(0, 3);

  const openMapLocation = (food: FoodItem) => {
    const query = encodeURIComponent(`${food.bestPlace.name} ${food.bestPlace.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <UtensilsCrossed className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Foodie Corner</h2>
          <p className="text-sm text-muted-foreground">
            Explore famous food of {tripDetails.destinationPoint}
          </p>
        </div>
      </div>

      {/* Must Try Highlight */}
      {mustTryFoods.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-red-500/5 to-yellow-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-foreground">Top Must-Try Foods</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mustTryFoods.map((f) => (
              <Badge key={f.name} variant="secondary" className="bg-orange-500/15 text-orange-700 dark:text-orange-300 gap-1">
                {f.category === "veg" ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
                {f.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {/* Category */}
            {(["all", "veg", "non-veg"] as const).map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={categoryFilter === cat ? "default" : "outline"}
                onClick={() => setCategoryFilter(cat)}
                className="gap-1 capitalize"
              >
                {cat === "veg" && <Leaf className="w-3 h-3" />}
                {cat === "non-veg" && <Drumstick className="w-3 h-3" />}
                {cat === "all" ? "All" : cat}
              </Button>
            ))}
            <div className="w-px bg-border mx-1" />
            {/* Type */}
            {["all", "street_food", "restaurant", "dessert", "beverage"].map((t) => (
              <Button
                key={t}
                size="sm"
                variant={typeFilter === t ? "default" : "outline"}
                onClick={() => setTypeFilter(t)}
                className="gap-1"
              >
                {t !== "all" && TYPE_ICONS[t]}
                {t === "all" ? "All Types" : TYPE_LABELS[t]}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => { setCategoryFilter("all"); setTypeFilter("all"); setSearch(""); }}>
              <X className="w-3 h-3 mr-1" /> Clear
            </Button>
          </div>
        )}
      </div>

      {/* Food Cards Grid */}
      {filteredFoods.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <UtensilsCrossed className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No food items match your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map((food, i) => {
            const pop = POPULARITY_STYLES[food.popularity];
            return (
              <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow group">
                <CardContent className="p-4 space-y-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{food.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{food.description}</p>
                    </div>
                    <Badge className={`${pop.bg} ${pop.text} border-0 text-[10px] shrink-0`}>
                      {pop.label}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      {food.category === "veg" ? (
                        <Leaf className="w-3 h-3 text-green-600" />
                      ) : (
                        <Drumstick className="w-3 h-3 text-red-500" />
                      )}
                      {food.category === "veg" ? "Veg" : "Non-Veg"}
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      {TYPE_ICONS[food.type]}
                      {TYPE_LABELS[food.type]}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {currency.symbol}{food.priceRange}
                    </Badge>
                  </div>

                  {/* Best Place */}
                  <div className="bg-muted/50 rounded-lg p-2.5 space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                      <Star className="w-3 h-3 text-yellow-500" />
                      Best Place to Try
                    </div>
                    <p className="text-xs font-medium text-foreground">{food.bestPlace.name}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {food.bestPlace.location}
                    </p>
                  </div>

                  {/* Action */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-1.5 text-xs"
                    onClick={() => openMapLocation(food)}
                  >
                    <Navigation className="w-3 h-3" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FoodieCorner;
