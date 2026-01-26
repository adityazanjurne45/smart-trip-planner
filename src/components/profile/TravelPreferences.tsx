import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Users, 
  Wallet, 
  Calendar, 
  Building2, 
  Car, 
  AlertTriangle, 
  Utensils, 
  Languages, 
  Save, 
  Loader2,
  X,
  Plus,
  MapPin
} from 'lucide-react';
import { 
  UserProfile, 
  TravelStyle, 
  AccommodationType, 
  TransportationChoice, 
  TrafficSensitivity, 
  FoodPreference 
} from '@/types/profile';

interface TravelPreferencesProps {
  profile: UserProfile | null;
  onSave: (data: Partial<UserProfile>) => Promise<{ error: any }>;
}

const travelStyleOptions: { value: TravelStyle; label: string }[] = [
  { value: 'solo', label: 'Solo Traveler' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'group', label: 'Group' },
];

const accommodationOptions: { value: AccommodationType; label: string }[] = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid_range', label: 'Mid-Range' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'homestay', label: 'Homestay' },
  { value: 'resort', label: 'Resort' },
];

const transportOptions: { value: TransportationChoice; label: string }[] = [
  { value: 'public_transport', label: 'Public Transport' },
  { value: 'rental_car', label: 'Rental Car' },
  { value: 'bike', label: 'Bike' },
  { value: 'walking', label: 'Walking' },
  { value: 'taxi', label: 'Taxi/Rideshare' },
  { value: 'private_driver', label: 'Private Driver' },
];

const trafficOptions: { value: TrafficSensitivity; label: string }[] = [
  { value: 'low', label: 'Low - Flexible timing' },
  { value: 'medium', label: 'Medium - Moderate concern' },
  { value: 'high', label: 'High - Avoid traffic' },
];

const foodOptions: { value: FoodPreference; label: string }[] = [
  { value: 'no_preference', label: 'No Preference' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'non_vegetarian', label: 'Non-Vegetarian' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
];

const TravelPreferences = ({ profile, onSave }: TravelPreferencesProps) => {
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(profile?.travel_style || 'solo');
  const [budgetRange, setBudgetRange] = useState<[number, number]>([
    profile?.budget_range_min || 0,
    profile?.budget_range_max || 5000,
  ]);
  const [tripDuration, setTripDuration] = useState(profile?.trip_duration_preference || 5);
  const [accommodation, setAccommodation] = useState<AccommodationType>(profile?.accommodation_type || 'mid_range');
  const [transport, setTransport] = useState<TransportationChoice>(profile?.transportation_choice || 'public_transport');
  const [trafficSensitivity, setTrafficSensitivity] = useState<TrafficSensitivity>(profile?.traffic_sensitivity || 'medium');
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(profile?.food_preference || 'no_preference');
  const [language, setLanguage] = useState(profile?.language_preference || 'English');
  const [destinations, setDestinations] = useState<string[]>(profile?.preferred_destinations || []);
  const [newDestination, setNewDestination] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setTravelStyle(profile.travel_style || 'solo');
      setBudgetRange([profile.budget_range_min || 0, profile.budget_range_max || 5000]);
      setTripDuration(profile.trip_duration_preference || 5);
      setAccommodation(profile.accommodation_type || 'mid_range');
      setTransport(profile.transportation_choice || 'public_transport');
      setTrafficSensitivity(profile.traffic_sensitivity || 'medium');
      setFoodPreference(profile.food_preference || 'no_preference');
      setLanguage(profile.language_preference || 'English');
      setDestinations(profile.preferred_destinations || []);
    }
  }, [profile]);

  const handleAddDestination = () => {
    if (newDestination.trim() && !destinations.includes(newDestination.trim())) {
      setDestinations([...destinations, newDestination.trim()]);
      setNewDestination('');
    }
  };

  const handleRemoveDestination = (dest: string) => {
    setDestinations(destinations.filter((d) => d !== dest));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      travel_style: travelStyle,
      budget_range_min: budgetRange[0],
      budget_range_max: budgetRange[1],
      trip_duration_preference: tripDuration,
      accommodation_type: accommodation,
      transportation_choice: transport,
      traffic_sensitivity: trafficSensitivity,
      food_preference: foodPreference,
      language_preference: language,
      preferred_destinations: destinations,
    });
    setSaving(false);
  };

  return (
    <div className="travel-card p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-accent" />
        Travel Preferences
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Travel Style */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            Travel Style
          </Label>
          <Select value={travelStyle} onValueChange={(v) => setTravelStyle(v as TravelStyle)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {travelStyleOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            Budget Range (USD)
          </Label>
          <div className="pt-2">
            <Slider
              value={budgetRange}
              min={0}
              max={20000}
              step={100}
              onValueChange={(v) => setBudgetRange(v as [number, number])}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>${budgetRange[0]}</span>
              <span>${budgetRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Trip Duration */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Preferred Trip Duration (days)
          </Label>
          <div className="pt-2">
            <Slider
              value={[tripDuration]}
              min={1}
              max={30}
              step={1}
              onValueChange={(v) => setTripDuration(v[0])}
            />
            <div className="text-sm text-muted-foreground mt-1 text-center">
              {tripDuration} days
            </div>
          </div>
        </div>

        {/* Accommodation */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Accommodation Type
          </Label>
          <Select value={accommodation} onValueChange={(v) => setAccommodation(v as AccommodationType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {accommodationOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transportation */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Car className="w-4 h-4 text-muted-foreground" />
            Preferred Transportation
          </Label>
          <Select value={transport} onValueChange={(v) => setTransport(v as TransportationChoice)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {transportOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Traffic Sensitivity */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            Traffic Sensitivity
          </Label>
          <Select value={trafficSensitivity} onValueChange={(v) => setTrafficSensitivity(v as TrafficSensitivity)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {trafficOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Food Preference */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-muted-foreground" />
            Food Preference
          </Label>
          <Select value={foodPreference} onValueChange={(v) => setFoodPreference(v as FoodPreference)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {foodOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground" />
            Language Preference
          </Label>
          <Input
            placeholder="e.g., English, Spanish"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
      </div>

      {/* Preferred Destinations */}
      <div className="mt-6 space-y-3">
        <Label className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          Preferred Destinations
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a destination"
            value={newDestination}
            onChange={(e) => setNewDestination(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddDestination()}
          />
          <Button variant="outline" onClick={handleAddDestination}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {destinations.map((dest) => (
            <Badge key={dest} variant="secondary" className="px-3 py-1.5 flex items-center gap-1">
              {dest}
              <button onClick={() => handleRemoveDestination(dest)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="travel" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default TravelPreferences;
