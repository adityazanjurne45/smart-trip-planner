import { detectCountry } from './currency';

export interface BookingPlatform {
  name: string;
  icon: string;
  getUrl: (hotelName: string, city: string) => string;
}

export interface TransportBookingPlatform {
  name: string;
  type: 'bus' | 'taxi';
  getUrl: (city?: string) => string;
}

// Hotel booking platforms
const INDIA_HOTEL_PLATFORMS: BookingPlatform[] = [
  {
    name: 'MakeMyTrip',
    icon: '🏨',
    getUrl: (hotel, city) =>
      `https://www.makemytrip.com/hotels/hotel-listing/?checkin=&checkout=&city=${encodeURIComponent(city)}&searchText=${encodeURIComponent(hotel + ' ' + city)}`,
  },
  {
    name: 'Goibibo',
    icon: '🏨',
    getUrl: (hotel, city) =>
      `https://www.goibibo.com/hotels/search/?city=${encodeURIComponent(city)}&keyword=${encodeURIComponent(hotel)}`,
  },
];

const GLOBAL_HOTEL_PLATFORMS: BookingPlatform[] = [
  {
    name: 'Booking.com',
    icon: '🏨',
    getUrl: (hotel, city) =>
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel + ' ' + city)}`,
  },
  {
    name: 'Agoda',
    icon: '🏨',
    getUrl: (hotel, city) =>
      `https://www.agoda.com/search?city=${encodeURIComponent(city)}&q=${encodeURIComponent(hotel)}`,
  },
];

// Transport booking platforms
const INDIA_BUS_PLATFORMS: TransportBookingPlatform[] = [
  { name: 'RedBus', type: 'bus', getUrl: () => 'https://www.redbus.in/' },
  { name: 'AbhiBus', type: 'bus', getUrl: () => 'https://www.abhibus.com/' },
];

const GLOBAL_BUS_PLATFORMS: TransportBookingPlatform[] = [
  { name: 'Rome2Rio', type: 'bus', getUrl: (city) => `https://www.rome2rio.com/s/${encodeURIComponent(city || '')}` },
  { name: 'Busbud', type: 'bus', getUrl: () => 'https://www.busbud.com/' },
];

const INDIA_TAXI_PLATFORMS: TransportBookingPlatform[] = [
  { name: 'Uber', type: 'taxi', getUrl: () => 'https://www.uber.com/' },
  { name: 'Ola', type: 'taxi', getUrl: () => 'https://www.olacabs.com/' },
  { name: 'Rapido', type: 'taxi', getUrl: () => 'https://www.rapido.bike/' },
];

const GLOBAL_TAXI_PLATFORMS: TransportBookingPlatform[] = [
  { name: 'Uber', type: 'taxi', getUrl: () => 'https://www.uber.com/' },
  { name: 'Lyft', type: 'taxi', getUrl: () => 'https://www.lyft.com/' },
  { name: 'Bolt', type: 'taxi', getUrl: () => 'https://bolt.eu/' },
];

export function getHotelBookingPlatforms(destination: string): BookingPlatform[] {
  const country = detectCountry(destination);
  return country === 'india' ? INDIA_HOTEL_PLATFORMS : GLOBAL_HOTEL_PLATFORMS;
}

export function getBusBookingPlatforms(destination: string): TransportBookingPlatform[] {
  const country = detectCountry(destination);
  return country === 'india' ? INDIA_BUS_PLATFORMS : GLOBAL_BUS_PLATFORMS;
}

export function getTaxiBookingPlatforms(destination: string): TransportBookingPlatform[] {
  const country = detectCountry(destination);
  return country === 'india' ? INDIA_TAXI_PLATFORMS : GLOBAL_TAXI_PLATFORMS;
}

export function isIndianDestination(destination: string): boolean {
  return detectCountry(destination) === 'india';
}
