import {
  type Booking,
  BOOKING_STATUS,
  type BookingStatus,
} from "../types/booking.types";

const STARTING_SOON_WINDOW_MIN = 30;

export function formatSessionDate(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) return "Today";
  if (isTomorrow) return "Tomorrow";

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeRange(startTime: Date, endTime: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${fmt(startTime)} - ${fmt(endTime)}`;
}

export function getDurationLabel(booking: Booking): string {
  if (booking.duration) return booking.duration;
  const minutes = Math.round(
    (booking.endTime.getTime() - booking.startTime.getTime()) / 60000,
  );
  return `${minutes} min duration`;
}

/** True when a CONFIRMED session is starting within the next 30 minutes and hasn't started yet. */
export function isStartingSoon(booking: Booking): boolean {
  if (booking.status !== BOOKING_STATUS.CONFIRMED) return false;
  const now = Date.now();
  const diffMin = (booking.startTime.getTime() - now) / 60000;
  return diffMin > 0 && diffMin <= STARTING_SOON_WINDOW_MIN;
}

export function getStartingSoonLabel(booking: Booking): string | null {
  if (!isStartingSoon(booking)) return null;
  const diffMin = Math.round(
    (booking.startTime.getTime() - Date.now()) / 60000,
  );
  return `STARTING IN ${diffMin}M`;
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  CONFIRMED: "Upcoming",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};
