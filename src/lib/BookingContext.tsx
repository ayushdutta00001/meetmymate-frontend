import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { supabase } from '../supabase';
import { useAuth } from "./auth-context";

import {
  getMyBlindDateBookings,
} from './user-api';

import {
  playNotificationSound,
  showBlindDateNotification,
} from './notification-helper';

interface BookingContextType {
  bookings: any[];
  loading: boolean;
  reload: () => void;
}

const BookingContext =
  createContext<BookingContextType>({
    bookings: [],
    loading: true,
    reload: () => {},
  });

export const BookingProvider = ({
  children,
}: any) => {

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const { user } = useAuth();

  // ============================================================
  // LOAD BLIND DATE BOOKINGS
  // ============================================================

  const loadBookings = async () => {

    try {

      setLoading(true);

      const blind =
        await getMyBlindDateBookings();

      console.log(
        "🔥 BLIND DATE API RESPONSE:",
        blind
      );

      if (!blind.success) {

        console.error(
          "Blind Date bookings failed:",
          blind
        );

        setBookings([]);

        return;
      }

      const blindBookings =
        blind.data ?? [];

      console.log(
        "🔥 BLIND DATE BOOKINGS:",
        blindBookings
      );

      setBookings(
        blindBookings
      );

    } catch (error) {

      console.error(
        "BookingContext loadBookings error:",
        error
      );

      setBookings([]);

    } finally {

      setLoading(false);

    }
  };

  // ============================================================
  // INITIALIZE
  // ============================================================

  useEffect(() => {

    let channel: any;

    const initialize = async () => {

      if (!user) {

        setBookings([]);
        setLoading(false);

        return;
      }

      try {

        console.log(
          "BookingContext initialized"
        );

        // Load existing Blind Date bookings
        await loadBookings();

        // ======================================================
        // REALTIME BLIND DATE UPDATES
        // ======================================================

        channel =
          supabase
            .channel(
              "global-blind-date-booking-updates"
            )
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "blind_date_bookings",
              },
              async (payload) => {

                console.log(
                  "🔥 Blind Date realtime update:",
                  payload.eventType,
                  payload.new
                );

                // Reload bookings whenever a booking
                // is inserted, updated, or deleted.
                await loadBookings();

                const booking =
                  payload.new as any;

                // Only show the notification when
                // an existing booking becomes confirmed.
                if (
                  payload.eventType ===
                    "UPDATE" &&
                  booking?.payment_status ===
                    "paid" &&
                  booking?.status ===
                    "confirmed"
                ) {

                  showBlindDateNotification();

                  playNotificationSound();

                }

              }
            )
            .subscribe((status) => {

              console.log(
                "🔥 Blind Date realtime status:",
                status
              );

            });

      } catch (error) {

        console.error(
          "BookingContext initialization error:",
          error
        );

        setLoading(false);

      }
    };

    // Small delay to avoid startup auth race.
    const timer =
      setTimeout(
        initialize,
        500
      );

    return () => {

      clearTimeout(timer);

      if (channel) {

        supabase.removeChannel(
          channel
        );

      }

    };

  }, [user]);

  // ============================================================
  // CONTEXT
  // ============================================================

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

export const useBookings =
  () => useContext(
    BookingContext
  );