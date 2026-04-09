import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Booking {
  id: string;
  type: "hotel" | "transport";
  itemName: string;
  location: string;
  price: number;
  tax: number;
  discount: number;
  total: number;
  travelerName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDates: string;
  paymentMethod: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "status">) => Booking;
  cancelBooking: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);
const STORAGE_KEY = "travello_bookings";

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = useCallback((b: Omit<Booking, "id" | "createdAt" | "status">) => {
    const newBooking: Booking = {
      ...b,
      id: `TRV-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" as const } : b));
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used within BookingProvider");
  return ctx;
};
