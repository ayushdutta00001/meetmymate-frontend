import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from "./auth-context";
import {
  getMyBlindDateBookings,
  getMyRentFriendBookings,
} from './user-api';
import { playNotificationSound, showBlindDateNotification } from './notification-helper';

interface BookingContextType {
  bookings: any[];
  loading: boolean;
  reload: () => void;
}

const BookingContext = createContext<BookingContextType>({
  bookings: [],
  loading: true,
  reload: () => {},
});

export const BookingProvider = ({ children }: any) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const [blind, rent,] = await Promise.all([
        getMyBlindDateBookings(),
        getMyRentFriendBookings(),
        
      ]);

      const combined = [
  ...(blind.success ? blind.data ?? [] : []),
  ...(rent.success ? rent.data ?? [] : []),
];

      setBookings(combined);
    } finally {
      setLoading(false);
    }
  };

const { user } = useAuth();

 useEffect(() => {
  let channel: any;
 

 const initialize = async () => {
  if (!user) return;

  try {
    console.log("BookingContext initialized");

    await loadBookings();

    channel = supabase
      .channel("global-booking-updates")
     .on(
  "postgres_changes",
  {
    event: "UPDATE",
    schema: "public",
    table: "blind_date_bookings",
  },
  async (payload) => {
         await loadBookings();

const booking = payload.new as any;

if (
  booking.payment_status === "paid" &&
  booking.status === "confirmed"
) {
  showBlindDateNotification();
  playNotificationSound();
}
        }
      )
      .subscribe();
  } catch (err) {
    console.error("BookingContext:", err);
  }
};
  // Delay slightly to avoid startup auth race
  const timer = setTimeout(initialize, 500);

  return () => {
   

    clearTimeout(timer);

    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}, [user]);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        reload: loadBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);
