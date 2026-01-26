-- Create enums for preferences
CREATE TYPE public.travel_style AS ENUM ('solo', 'couple', 'family', 'group');
CREATE TYPE public.accommodation_type AS ENUM ('budget', 'mid_range', 'luxury', 'hostel', 'homestay', 'resort');
CREATE TYPE public.transportation_choice AS ENUM ('public_transport', 'rental_car', 'bike', 'walking', 'taxi', 'private_driver');
CREATE TYPE public.traffic_sensitivity AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.food_preference AS ENUM ('vegetarian', 'vegan', 'non_vegetarian', 'halal', 'kosher', 'no_preference');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  home_city TEXT,
  travel_style public.travel_style DEFAULT 'solo',
  preferred_destinations TEXT[] DEFAULT '{}',
  budget_range_min INTEGER DEFAULT 0,
  budget_range_max INTEGER DEFAULT 5000,
  trip_duration_preference INTEGER DEFAULT 5,
  accommodation_type public.accommodation_type DEFAULT 'mid_range',
  transportation_choice public.transportation_choice DEFAULT 'public_transport',
  traffic_sensitivity public.traffic_sensitivity DEFAULT 'medium',
  food_preference public.food_preference DEFAULT 'no_preference',
  language_preference TEXT DEFAULT 'English',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create past trips table
CREATE TABLE public.past_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  boarding_point TEXT NOT NULL,
  duration INTEGER NOT NULL,
  budget INTEGER NOT NULL,
  trip_date DATE NOT NULL DEFAULT CURRENT_DATE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_trips ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Past trips policies
CREATE POLICY "Users can view their own past trips"
  ON public.past_trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own past trips"
  ON public.past_trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own past trips"
  ON public.past_trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own past trips"
  ON public.past_trips FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();