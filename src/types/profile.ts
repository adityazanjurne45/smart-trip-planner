export type TravelStyle = 'solo' | 'couple' | 'family' | 'group';
export type AccommodationType = 'budget' | 'mid_range' | 'luxury' | 'hostel' | 'homestay' | 'resort';
export type TransportationChoice = 'public_transport' | 'rental_car' | 'bike' | 'walking' | 'taxi' | 'private_driver';
export type TrafficSensitivity = 'low' | 'medium' | 'high';
export type FoodPreference = 'vegetarian' | 'vegan' | 'non_vegetarian' | 'halal' | 'kosher' | 'no_preference';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  home_city: string | null;
  travel_style: TravelStyle;
  preferred_destinations: string[];
  budget_range_min: number;
  budget_range_max: number;
  trip_duration_preference: number;
  accommodation_type: AccommodationType;
  transportation_choice: TransportationChoice;
  traffic_sensitivity: TrafficSensitivity;
  food_preference: FoodPreference;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface PastTrip {
  id: string;
  user_id: string;
  destination: string;
  boarding_point: string;
  duration: number;
  budget: number;
  trip_date: string;
  rating: number | null;
  notes: string | null;
  created_at: string;
}
