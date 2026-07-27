import type { BookingStatus } from "./booking.types";

export interface AdminBookingDetailsOutput {
  sessionTitle: string;
  duration: string;
  startDateTime: Date;
  endDateTime: Date;
  user: {
    name: string;
    profileImageKey: string | null;
  };
  mentor: {
    name: string;
    profileImageKey: string | null;
  };
  note: string | null;
  userId: string;
  mentorId: string;
  amount: number;
  currency: string;
  status: BookingStatus;
  id: string;
  review?: {
    rating: number;
    comment: string | null;
    id: string;
  };
  bookingEvent?: {
    id: string;
    actorName: string;
    actorId: string;
    type: BookingEventType;
    metaData?: Record<string, string>;
  }[];
}

export const BOOKING_EVENT_TYPES = {
  CREATED: "CREATED",
  CANCELLED: "CANCELLED",
  RESCHEDULED: "RESCHEDULED",
  NOTE_ADDED: "NOTE_ADDED",
  REFUND_ISSUED: "REFUND_ISSUED",
  COMPLETED: "COMPLETED",
} as const;

export type BookingEventType =
  (typeof BOOKING_EVENT_TYPES)[keyof typeof BOOKING_EVENT_TYPES];
