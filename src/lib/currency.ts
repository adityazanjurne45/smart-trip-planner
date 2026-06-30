// Country-to-currency mapping
export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to USD (1 USD = X units)
  locale: string;
}



const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  // Asia
  india: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.5 },
  indonesia: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", rate: 15700 },
  japan: { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149 },
  china: { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.25 },
  thailand: { code: "THB", symbol: "฿", name: "Thai Baht", rate: 35.5 },
  malaysia: { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", rate: 4.7 },
  singapore: { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 1.35 },
  south_korea: { code: "KRW", symbol: "₩", name: "South Korean Won", rate: 1320 },
  vietnam: { code: "VND", symbol: "₫", name: "Vietnamese Dong", rate: 24500 },
  philippines: { code: "PHP", symbol: "₱", name: "Philippine Peso", rate: 56 },
  nepal: { code: "NPR", symbol: "रू", name: "Nepalese Rupee", rate: 133 },
  sri_lanka: { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", rate: 310 },
  // Americas
  usa: { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  canada: { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  mexico: { code: "MXN", symbol: "MX$", name: "Mexican Peso", rate: 17.2 },
  brazil: { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 4.95 },
  // Europe
  france: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  germany: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  italy: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  spain: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  netherlands: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  portugal: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  greece: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  austria: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  belgium: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  uk: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  england: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  switzerland: { code: "CHF", symbol: "CHF", name: "Swiss Franc", rate: 0.88 },
  turkey: { code: "TRY", symbol: "₺", name: "Turkish Lira", rate: 27.5 },
  russia: { code: "RUB", symbol: "₽", name: "Russian Ruble", rate: 92 },
  sweden: { code: "SEK", symbol: "kr", name: "Swedish Krona", rate: 10.5 },
  norway: { code: "NOK", symbol: "kr", name: "Norwegian Krone", rate: 10.8 },
  denmark: { code: "DKK", symbol: "kr", name: "Danish Krone", rate: 6.9 },
  // Oceania
  australia: { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  new_zealand: { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", rate: 1.65 },
  // Africa
  south_africa: { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.5 },
  egypt: { code: "EGP", symbol: "E£", name: "Egyptian Pound", rate: 30.9 },
  kenya: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rate: 155 },
  // Middle East
  uae: { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
  dubai: { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
  saudi_arabia: { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 3.75 },
};

// Popular destinations mapped to countries
const DESTINATION_COUNTRY_MAP: Record<string, string> = {
  // India
  mumbai: "india", delhi: "india", bangalore: "india", chennai: "india",
  kolkata: "india", hyderabad: "india", pune: "india", jaipur: "india",
  goa: "india", manali: "india", shimla: "india", agra: "india",
  varanasi: "india", udaipur: "india", jodhpur: "india", rishikesh: "india",
  satara: "india", mahabaleshwar: "india", lonavala: "india", ooty: "india",
  munnar: "india", darjeeling: "india", mysore: "india", kochi: "india",
  amritsar: "india", leh: "india", ladakh: "india", srinagar: "india",
  // Indonesia
  bali: "indonesia", jakarta: "indonesia", yogyakarta: "indonesia",
  // Japan
  tokyo: "japan", osaka: "japan", kyoto: "japan",
  // Thailand
  bangkok: "thailand", phuket: "thailand", "chiang mai": "thailand",
  // USA
  "new york": "usa", "los angeles": "usa", "san francisco": "usa",
  miami: "usa", chicago: "usa", "las vegas": "usa", seattle: "usa",
  boston: "usa", hawaii: "usa", washington: "usa",
  // UK
  london: "uk", edinburgh: "uk", manchester: "uk",
  // France
  paris: "france", nice: "france", lyon: "france",
  // Italy
  rome: "italy", venice: "italy", florence: "italy", milan: "italy",
  // Spain
  barcelona: "spain", madrid: "spain",
  // Germany
  berlin: "germany", munich: "germany",
  // Australia
  sydney: "australia", melbourne: "australia",
  // UAE
  dubai: "uae", "abu dhabi": "uae",
  // Singapore
  singapore: "singapore",
  // Malaysia
  "kuala lumpur": "malaysia",
  // Turkey
  istanbul: "turkey",
  // Egypt
  cairo: "egypt",
  // Mexico
  "cancun": "mexico", "mexico city": "mexico",
  // Brazil
  "rio de janeiro": "brazil", "sao paulo": "brazil",
  // Canada
  toronto: "canada", vancouver: "canada",
  // South Africa
  "cape town": "south_africa", johannesburg: "south_africa",
  // Nepal
  kathmandu: "nepal", pokhara: "nepal",
  // Sri Lanka
  colombo: "sri_lanka",
  // South Korea
  seoul: "south_korea",
  // Vietnam
  "ho chi minh": "vietnam", hanoi: "vietnam",
  // Switzerland
  zurich: "switzerland", geneva: "switzerland",
  // Greece
  athens: "greece", santorini: "greece",
  // Netherlands
  amsterdam: "netherlands",
  // Portugal
  lisbon: "portugal",
  // Russia
  moscow: "russia",
  // Kenya
  nairobi: "kenya",
  // Saudi Arabia
  riyadh: "saudi_arabia", mecca: "saudi_arabia",
};

// Default currency
const DEFAULT_CURRENCY: CurrencyInfo = { code: "USD", symbol: "$", name: "US Dollar", rate: 1 };

export function detectCountry(destination: string): string | null {
  const lower = destination.toLowerCase().trim();
  // Check direct city match
  for (const [city, country] of Object.entries(DESTINATION_COUNTRY_MAP)) {
    if (lower.includes(city)) return country;
  }
  // Check country name match
  for (const country of Object.keys(CURRENCY_MAP)) {
    if (lower.includes(country.replace(/_/g, " "))) return country;
  }
  return null;
}

export function getCurrencyForDestination(destination: string): CurrencyInfo {
  const country = detectCountry(destination);
  if (country && CURRENCY_MAP[country]) return CURRENCY_MAP[country];
  return DEFAULT_CURRENCY;
}

export function getAllCurrencies(): CurrencyInfo[] {
  const seen = new Set<string>();
  const result: CurrencyInfo[] = [];
  for (const info of Object.values(CURRENCY_MAP)) {
    if (!seen.has(info.code)) {
      seen.add(info.code);
      result.push(info);
    }
  }
  result.sort((a, b) => a.code.localeCompare(b.code));
  return result;
}

export function convertFromUSD(amountUSD: number, currency: CurrencyInfo): number {
  return Math.round(amountUSD * currency.rate);
}

export function convertToUSD(amount: number, currency: CurrencyInfo): number {
  return Math.round(amount / currency.rate);
}

export function formatCurrency(amount: number, currency: CurrencyInfo): string {
  return `${currency.symbol}${amount.toLocaleString()}`;
}

export function getCountryTransportTypes(destination: string): string[] {
  const country = detectCountry(destination);
  const TRANSPORT_BY_COUNTRY: Record<string, string[]> = {
    india: ["Auto Rickshaw", "Train", "Bus", "Metro", "Taxi", "Bike"],
    usa: ["Subway", "Yellow Taxi", "Uber", "Bus", "Rental Car"],
    indonesia: ["Scooter", "Private Car", "Local Taxi", "Grab", "Bus"],
    japan: ["Shinkansen", "Subway", "Bus", "Taxi"],
    thailand: ["Tuk Tuk", "Songthaew", "BTS Skytrain", "Taxi", "Scooter"],
    uk: ["Underground", "Black Cab", "Bus", "Train"],
    france: ["Metro", "TGV Train", "Bus", "Taxi"],
    italy: ["Metro", "Train", "Bus", "Water Taxi"],
    uae: ["Metro", "Taxi", "Uber", "Bus"],
    australia: ["Tram", "Train", "Bus", "Uber"],
    singapore: ["MRT", "Bus", "Taxi", "Grab"],
    malaysia: ["LRT", "Grab", "Bus", "Taxi"],
    turkey: ["Tram", "Metro", "Dolmuş", "Taxi"],
    egypt: ["Metro", "Taxi", "Uber", "Microbus"],
    nepal: ["Local Bus", "Taxi", "Rickshaw", "Jeep"],
    brazil: ["Metro", "Bus", "Uber", "Taxi"],
    mexico: ["Metro", "Uber", "Taxi", "Bus"],
    canada: ["Subway", "Bus", "Uber", "Train"],
  };
  if (country && TRANSPORT_BY_COUNTRY[country]) return TRANSPORT_BY_COUNTRY[country];
  return ["Taxi", "Bus", "Car", "Bike"];
}
