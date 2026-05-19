// Destination-aware demo food menu generator.
// Returns realistic dishes per cuisine region for the hotel restaurant section.

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  veg: boolean;
  popular?: boolean;
  imageQuery: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Desserts" | "Drinks";
}

type Region =
  | "india" | "italy" | "france" | "japan" | "thailand"
  | "indonesia" | "spain" | "mexico" | "uae" | "global";

const regionMap: Record<string, Region> = {
  india: "india", goa: "india", delhi: "india", mumbai: "india", jaipur: "india",
  kerala: "india", bangalore: "india", agra: "india", udaipur: "india",
  italy: "italy", rome: "italy", florence: "italy", venice: "italy", milan: "italy",
  france: "france", paris: "france", nice: "france", lyon: "france",
  japan: "japan", tokyo: "japan", kyoto: "japan", osaka: "japan",
  thailand: "thailand", bangkok: "thailand", phuket: "thailand", "chiang mai": "thailand",
  bali: "indonesia", indonesia: "indonesia", jakarta: "indonesia", ubud: "indonesia",
  spain: "spain", barcelona: "spain", madrid: "spain", seville: "spain",
  mexico: "mexico", cancun: "mexico", "mexico city": "mexico",
  dubai: "uae", "abu dhabi": "uae", uae: "uae",
};

const detectRegion = (destination: string): Region => {
  const d = destination.toLowerCase();
  for (const key of Object.keys(regionMap)) {
    if (d.includes(key)) return regionMap[key];
  }
  return "global";
};

const MENUS: Record<Region, MenuItem[]> = {
  india: [
    { name: "Masala Dosa", description: "Crispy crepe with spiced potato filling & chutneys", price: "$6", veg: true, popular: true, imageQuery: "masala dosa", category: "Breakfast" },
    { name: "Aloo Paratha", description: "Stuffed potato flatbread with butter & yogurt", price: "$5", veg: true, imageQuery: "aloo paratha", category: "Breakfast" },
    { name: "Butter Chicken", description: "Tender chicken in creamy tomato gravy", price: "$14", veg: false, popular: true, imageQuery: "butter chicken curry", category: "Lunch" },
    { name: "Paneer Tikka Masala", description: "Smoky paneer cubes in rich masala", price: "$12", veg: true, imageQuery: "paneer tikka masala", category: "Lunch" },
    { name: "Hyderabadi Biryani", description: "Aromatic basmati rice with saffron & spices", price: "$13", veg: false, popular: true, imageQuery: "hyderabadi biryani", category: "Dinner" },
    { name: "Dal Makhani", description: "Slow-cooked black lentils with cream", price: "$10", veg: true, imageQuery: "dal makhani", category: "Dinner" },
    { name: "Gulab Jamun", description: "Soft milk dumplings in rose syrup", price: "$5", veg: true, popular: true, imageQuery: "gulab jamun", category: "Desserts" },
    { name: "Masala Chai", description: "Spiced Indian tea with milk", price: "$3", veg: true, imageQuery: "masala chai", category: "Drinks" },
    { name: "Mango Lassi", description: "Chilled yogurt smoothie with alphonso", price: "$4", veg: true, popular: true, imageQuery: "mango lassi", category: "Drinks" },
  ],
  italy: [
    { name: "Cappuccino & Cornetto", description: "Classic Italian espresso with flaky pastry", price: "€7", veg: true, popular: true, imageQuery: "cappuccino cornetto", category: "Breakfast" },
    { name: "Frittata", description: "Italian omelette with herbs & cheese", price: "€9", veg: true, imageQuery: "italian frittata", category: "Breakfast" },
    { name: "Margherita Pizza", description: "Wood-fired pizza with San Marzano tomato & mozzarella", price: "€14", veg: true, popular: true, imageQuery: "margherita pizza", category: "Lunch" },
    { name: "Pasta Carbonara", description: "Roman classic with guanciale & pecorino", price: "€16", veg: false, popular: true, imageQuery: "pasta carbonara", category: "Lunch" },
    { name: "Osso Buco", description: "Braised veal shanks with gremolata", price: "€28", veg: false, imageQuery: "osso buco", category: "Dinner" },
    { name: "Risotto ai Funghi", description: "Creamy Arborio rice with porcini mushrooms", price: "€18", veg: true, imageQuery: "mushroom risotto", category: "Dinner" },
    { name: "Tiramisu", description: "Mascarpone, espresso & cocoa layered classic", price: "€8", veg: true, popular: true, imageQuery: "tiramisu", category: "Desserts" },
    { name: "Aperol Spritz", description: "Aperol, prosecco & soda over ice", price: "€9", veg: true, imageQuery: "aperol spritz", category: "Drinks" },
    { name: "Espresso", description: "Pure Italian espresso shot", price: "€3", veg: true, imageQuery: "espresso", category: "Drinks" },
  ],
  france: [
    { name: "Croissant & Café", description: "Butter croissant with French press coffee", price: "€8", veg: true, popular: true, imageQuery: "croissant coffee", category: "Breakfast" },
    { name: "Pain au Chocolat", description: "Flaky pastry with dark chocolate", price: "€5", veg: true, imageQuery: "pain au chocolat", category: "Breakfast" },
    { name: "Quiche Lorraine", description: "Savory tart with bacon & gruyère", price: "€14", veg: false, imageQuery: "quiche lorraine", category: "Lunch" },
    { name: "Ratatouille", description: "Provençal stewed vegetables with herbs", price: "€16", veg: true, popular: true, imageQuery: "ratatouille dish", category: "Lunch" },
    { name: "Coq au Vin", description: "Chicken braised in red wine with mushrooms", price: "€26", veg: false, popular: true, imageQuery: "coq au vin", category: "Dinner" },
    { name: "Bouillabaisse", description: "Marseille seafood stew with rouille", price: "€32", veg: false, imageQuery: "bouillabaisse", category: "Dinner" },
    { name: "Crème Brûlée", description: "Vanilla custard with caramelised sugar crust", price: "€9", veg: true, popular: true, imageQuery: "creme brulee", category: "Desserts" },
    { name: "French Wine", description: "Glass of Bordeaux or Burgundy", price: "€12", veg: true, imageQuery: "french red wine glass", category: "Drinks" },
    { name: "Café au Lait", description: "Coffee with steamed milk", price: "€4", veg: true, imageQuery: "cafe au lait", category: "Drinks" },
  ],
  japan: [
    { name: "Tamago Kake Gohan", description: "Steamed rice with raw egg & soy sauce", price: "¥800", veg: true, imageQuery: "tamago kake gohan", category: "Breakfast" },
    { name: "Miso Soup Set", description: "Miso soup, rice, grilled fish & pickles", price: "¥1500", veg: false, popular: true, imageQuery: "japanese breakfast set", category: "Breakfast" },
    { name: "Sushi Platter", description: "Chef's selection of nigiri & maki", price: "¥3200", veg: false, popular: true, imageQuery: "sushi platter", category: "Lunch" },
    { name: "Tempura Udon", description: "Hot udon noodles with shrimp tempura", price: "¥1800", veg: false, imageQuery: "tempura udon", category: "Lunch" },
    { name: "Wagyu Steak", description: "Premium A5 wagyu with seasonal vegetables", price: "¥8500", veg: false, popular: true, imageQuery: "wagyu steak", category: "Dinner" },
    { name: "Ramen Tonkotsu", description: "Rich pork bone broth with chashu", price: "¥1600", veg: false, imageQuery: "tonkotsu ramen", category: "Dinner" },
    { name: "Mochi Ice Cream", description: "Assorted matcha, strawberry & mango", price: "¥900", veg: true, popular: true, imageQuery: "mochi ice cream", category: "Desserts" },
    { name: "Matcha Latte", description: "Stone-ground ceremonial matcha with milk", price: "¥700", veg: true, imageQuery: "matcha latte", category: "Drinks" },
    { name: "Sake (Junmai)", description: "Premium cold sake, 180ml", price: "¥1200", veg: true, imageQuery: "sake japanese", category: "Drinks" },
  ],
  thailand: [
    { name: "Khao Tom", description: "Thai rice soup with pork & ginger", price: "฿180", veg: false, imageQuery: "khao tom", category: "Breakfast" },
    { name: "Mango Sticky Rice (AM)", description: "Sweet sticky rice with fresh mango", price: "฿200", veg: true, popular: true, imageQuery: "mango sticky rice", category: "Breakfast" },
    { name: "Pad Thai", description: "Stir-fried rice noodles with shrimp & peanuts", price: "฿250", veg: false, popular: true, imageQuery: "pad thai", category: "Lunch" },
    { name: "Som Tum", description: "Spicy green papaya salad", price: "฿180", veg: true, imageQuery: "som tum salad", category: "Lunch" },
    { name: "Tom Yum Goong", description: "Hot & sour shrimp soup with lemongrass", price: "฿320", veg: false, popular: true, imageQuery: "tom yum goong", category: "Dinner" },
    { name: "Green Curry", description: "Coconut green curry with chicken & basil", price: "฿280", veg: false, imageQuery: "thai green curry", category: "Dinner" },
    { name: "Coconut Ice Cream", description: "Fresh coconut ice cream with peanuts", price: "฿120", veg: true, imageQuery: "thai coconut ice cream", category: "Desserts" },
    { name: "Thai Iced Tea", description: "Sweet orange tea with condensed milk", price: "฿100", veg: true, popular: true, imageQuery: "thai iced tea", category: "Drinks" },
    { name: "Fresh Coconut", description: "Chilled young coconut water", price: "฿90", veg: true, imageQuery: "fresh coconut drink", category: "Drinks" },
  ],
  indonesia: [
    { name: "Nasi Goreng", description: "Indonesian fried rice with egg & krupuk", price: "Rp 75k", veg: false, popular: true, imageQuery: "nasi goreng", category: "Breakfast" },
    { name: "Bubur Ayam", description: "Rice porridge with shredded chicken", price: "Rp 55k", veg: false, imageQuery: "bubur ayam", category: "Breakfast" },
    { name: "Gado-Gado", description: "Vegetable salad with peanut sauce", price: "Rp 65k", veg: true, popular: true, imageQuery: "gado gado", category: "Lunch" },
    { name: "Mie Goreng", description: "Stir-fried noodles with vegetables", price: "Rp 70k", veg: true, imageQuery: "mie goreng", category: "Lunch" },
    { name: "Babi Guling", description: "Balinese spit-roast suckling pig (signature)", price: "Rp 180k", veg: false, popular: true, imageQuery: "babi guling bali", category: "Dinner" },
    { name: "Nasi Campur", description: "Rice with assorted Balinese sides", price: "Rp 120k", veg: false, imageQuery: "nasi campur bali", category: "Dinner" },
    { name: "Pisang Goreng", description: "Crispy fried banana with palm sugar", price: "Rp 45k", veg: true, imageQuery: "pisang goreng", category: "Desserts" },
    { name: "Es Kelapa Muda", description: "Iced young coconut drink", price: "Rp 40k", veg: true, popular: true, imageQuery: "es kelapa muda", category: "Drinks" },
    { name: "Bali Coffee", description: "Traditional Kopi Bali", price: "Rp 35k", veg: true, imageQuery: "bali coffee kopi", category: "Drinks" },
  ],
  spain: [
    { name: "Tostada con Tomate", description: "Toasted bread with tomato & olive oil", price: "€5", veg: true, imageQuery: "tostada tomate", category: "Breakfast" },
    { name: "Churros con Chocolate", description: "Fried dough with thick hot chocolate", price: "€7", veg: true, popular: true, imageQuery: "churros chocolate", category: "Breakfast" },
    { name: "Paella Valenciana", description: "Saffron rice with seafood & chorizo", price: "€22", veg: false, popular: true, imageQuery: "paella valenciana", category: "Lunch" },
    { name: "Gazpacho", description: "Chilled Andalusian tomato soup", price: "€8", veg: true, imageQuery: "gazpacho soup", category: "Lunch" },
    { name: "Tapas Selection", description: "Jamón, patatas bravas, croquetas & olives", price: "€18", veg: false, popular: true, imageQuery: "spanish tapas", category: "Dinner" },
    { name: "Cochinillo", description: "Roast suckling pig, Segovia style", price: "€30", veg: false, imageQuery: "cochinillo", category: "Dinner" },
    { name: "Crema Catalana", description: "Catalan custard with caramelised top", price: "€7", veg: true, imageQuery: "crema catalana", category: "Desserts" },
    { name: "Sangria", description: "Red wine with fresh fruit & brandy", price: "€10", veg: true, popular: true, imageQuery: "sangria pitcher", category: "Drinks" },
    { name: "Café con Leche", description: "Espresso with steamed milk", price: "€3", veg: true, imageQuery: "cafe con leche", category: "Drinks" },
  ],
  mexico: [
    { name: "Chilaquiles Verdes", description: "Tortilla chips in green salsa with egg", price: "$9", veg: true, popular: true, imageQuery: "chilaquiles verdes", category: "Breakfast" },
    { name: "Huevos Rancheros", description: "Eggs over tortillas with ranchera sauce", price: "$8", veg: true, imageQuery: "huevos rancheros", category: "Breakfast" },
    { name: "Tacos al Pastor", description: "Marinated pork tacos with pineapple", price: "$12", veg: false, popular: true, imageQuery: "tacos al pastor", category: "Lunch" },
    { name: "Quesadilla de Hongos", description: "Mushroom & cheese quesadilla", price: "$10", veg: true, imageQuery: "mushroom quesadilla", category: "Lunch" },
    { name: "Mole Poblano", description: "Chicken in rich chocolate-chili mole", price: "$18", veg: false, popular: true, imageQuery: "mole poblano", category: "Dinner" },
    { name: "Enchiladas Suizas", description: "Chicken enchiladas with green sauce", price: "$15", veg: false, imageQuery: "enchiladas suizas", category: "Dinner" },
    { name: "Churros", description: "Cinnamon-sugar churros with dulce de leche", price: "$6", veg: true, imageQuery: "mexican churros", category: "Desserts" },
    { name: "Margarita", description: "Classic tequila, lime & triple sec", price: "$9", veg: true, popular: true, imageQuery: "margarita cocktail", category: "Drinks" },
    { name: "Horchata", description: "Sweet rice & cinnamon drink", price: "$4", veg: true, imageQuery: "horchata drink", category: "Drinks" },
  ],
  uae: [
    { name: "Shakshuka", description: "Eggs poached in spiced tomato sauce", price: "AED 35", veg: true, popular: true, imageQuery: "shakshuka", category: "Breakfast" },
    { name: "Balaleet", description: "Sweet vermicelli with saffron & egg", price: "AED 30", veg: true, imageQuery: "balaleet emirati", category: "Breakfast" },
    { name: "Shawarma Platter", description: "Chicken shawarma with hummus & pita", price: "AED 55", veg: false, popular: true, imageQuery: "shawarma platter", category: "Lunch" },
    { name: "Falafel Wrap", description: "Crispy falafel with tahini & pickles", price: "AED 35", veg: true, imageQuery: "falafel wrap", category: "Lunch" },
    { name: "Mandi Lamb", description: "Slow-cooked lamb on fragrant rice", price: "AED 95", veg: false, popular: true, imageQuery: "lamb mandi", category: "Dinner" },
    { name: "Machboos", description: "Emirati spiced rice with chicken", price: "AED 75", veg: false, imageQuery: "machboos", category: "Dinner" },
    { name: "Luqaimat", description: "Crispy sweet dumplings with date syrup", price: "AED 28", veg: true, popular: true, imageQuery: "luqaimat", category: "Desserts" },
    { name: "Karak Chai", description: "Strong spiced milk tea", price: "AED 12", veg: true, imageQuery: "karak chai", category: "Drinks" },
    { name: "Jallab", description: "Date syrup & rosewater chilled drink", price: "AED 18", veg: true, imageQuery: "jallab drink", category: "Drinks" },
  ],
  global: [
    { name: "Continental Breakfast", description: "Eggs, bacon, toast & seasonal fruit", price: "$12", veg: false, popular: true, imageQuery: "continental breakfast", category: "Breakfast" },
    { name: "Avocado Toast", description: "Sourdough with smashed avocado & feta", price: "$10", veg: true, imageQuery: "avocado toast", category: "Breakfast" },
    { name: "Caesar Salad", description: "Romaine, parmesan, croutons & dressing", price: "$11", veg: true, popular: true, imageQuery: "caesar salad", category: "Lunch" },
    { name: "Club Sandwich", description: "Triple-decker with chicken, bacon & egg", price: "$14", veg: false, imageQuery: "club sandwich", category: "Lunch" },
    { name: "Grilled Salmon", description: "Atlantic salmon with lemon butter", price: "$24", veg: false, popular: true, imageQuery: "grilled salmon plate", category: "Dinner" },
    { name: "Mushroom Risotto", description: "Creamy arborio rice with truffle oil", price: "$18", veg: true, imageQuery: "mushroom risotto", category: "Dinner" },
    { name: "Chocolate Lava Cake", description: "Warm cake with molten center & ice cream", price: "$8", veg: true, popular: true, imageQuery: "chocolate lava cake", category: "Desserts" },
    { name: "Fresh Juice", description: "Orange, watermelon or seasonal", price: "$5", veg: true, imageQuery: "fresh juice glass", category: "Drinks" },
    { name: "House Wine", description: "Red or white, by the glass", price: "$8", veg: true, imageQuery: "wine glass", category: "Drinks" },
  ],
};

export const getHotelMenu = (destination: string): MenuItem[] => {
  const region = detectRegion(destination);
  return MENUS[region];
};

export const MENU_CATEGORIES: MenuItem["category"][] = [
  "Breakfast", "Lunch", "Dinner", "Desserts", "Drinks",
];
