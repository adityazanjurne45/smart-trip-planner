export interface TripDetails {
  boardingPoint: string;
  destinationPoint: string;
  duration: number;
  budget: number;
}

export interface PlaceImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export interface TouristPlace {
  name: string;
  description: string;
  estimatedTime: string;
  entryFee: string;
  images?: PlaceImage[];
}

export interface Hotel {
  name: string;
  pricePerNight: string;
  rating: string;
  location: string;
  images?: PlaceImage[];
}

export interface Vehicle {
  type: string;
  reason: string;
  estimatedCost: string;
  suitableFor: string;
  images?: PlaceImage[];
}

export interface Recommendations {
  touristPlaces: TouristPlace[];
  hotels: Hotel[];
  vehicles: Vehicle[];
  summary: string;
  destinationImages?: PlaceImage[];
}
