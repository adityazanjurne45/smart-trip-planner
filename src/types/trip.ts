export interface TripDetails {
  boardingPoint: string;
  destinationPoint: string;
  duration: number;
  budget: number;
  startDate?: string;
  endDate?: string;
  travelStyle?: 'solo' | 'couple' | 'family' | 'friends';
}

export interface PlaceImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TouristPlace {
  name: string;
  description: string;
  estimatedTime: string;
  entryFee: string;
  images?: PlaceImage[];
  crowdLevel?: 'low' | 'medium' | 'high';
  bestTimeToVisit?: string;
  coordinates?: Coordinates;
}

export interface Hotel {
  name: string;
  pricePerNight: string;
  rating: string;
  location: string;
  images?: PlaceImage[];
  distanceToCenter?: string;
  nearbyAttractions?: string[];
  amenities?: string[];
  isEcoFriendly?: boolean;
  isBestLocation?: boolean;
  coordinates?: Coordinates;
  isSelected?: boolean;
}

export interface Vehicle {
  type: string;
  reason: string;
  estimatedCost: string;
  suitableFor: string;
  images?: PlaceImage[];
  whereToFind?: string;
  isEcoFriendly?: boolean;
  tips?: string;
  isSelected?: boolean;
}

export interface CostSavingTip {
  tip: string;
  savingsEstimate: string;
}

export interface SafetyInfo {
  emergencyNumbers: {
    police?: string;
    ambulance?: string;
    fire?: string;
    tourist_helpline?: string;
  };
  nearbyHospitals: string[];
  safetyTips: string[];
  weatherAlerts?: string[];
}

export interface CultureTips {
  language: string;
  usefulPhrases: Array<{
    phrase: string;
    translation: string;
    pronunciation?: string;
  }>;
  customs: string[];
  localFood: string[];
  dressCode?: string;
}

export interface DayActivity {
  time: string;
  activity: string;
  duration: string;
  cost: string;
  type: 'attraction' | 'food' | 'transport' | 'hotel' | 'leisure';
}

export interface DayItinerary {
  day: number;
  theme: string;
  activities: DayActivity[];
  totalCost: string;
  travelTip?: string;
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  miscellaneous: number;
}

export interface Recommendations {
  touristPlaces: TouristPlace[];
  hotels: Hotel[];
  vehicles: Vehicle[];
  summary: string;
  destinationImages?: PlaceImage[];
  costSavingTips?: CostSavingTip[];
  safetyInfo?: SafetyInfo;
  cultureTips?: CultureTips;
  dayWiseItinerary?: DayItinerary[];
  budgetBreakdown?: BudgetBreakdown;
  isEcoFriendly?: boolean;
}

// For trip comparison
export interface SavedTrip {
  id: string;
  tripDetails: TripDetails;
  recommendations: Recommendations;
  savedAt: string;
  rating?: number;
  notes?: string;
}

// For notifications
export interface TripNotification {
  id: string;
  type: 'reminder' | 'weather' | 'budget' | 'tip';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  tripId?: string;
}
