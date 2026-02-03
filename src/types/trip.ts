export interface TripDetails {
  boardingPoint: string;
  destinationPoint: string;
  duration: number;
  budget: number;
}

export interface Recommendations {
  touristPlaces: {
    name: string;
    description: string;
    estimatedTime: string;
    entryFee: string;
  }[];
  hotels: {
    name: string;
    pricePerNight: string;
    rating: string;
    location: string;
  }[];
  vehicles: {
    type: string;
    reason: string;
    estimatedCost: string;
    suitableFor: string;
  }[];
  summary: string;
}
