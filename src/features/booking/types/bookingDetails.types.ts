// session-detail.types.ts
import type { BookingStatus } from "./booking.types";

/**
 * Exact shape returned by GET /bookings/:id (mentee view).
 * Mirrors your backend's MenteeBookingDetailsOutput 1:1 — don't add fields here,
 * add them to MentorFeedback / SessionReview below instead (see note underneath).
 */
export interface MenteeBookingDetailsOutput {
  sessionTitle: string;
  duration: string;
  startDateTime: Date;
  endDateTime: Date;
  user: {
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
}

/**
 * NOT part of MenteeBookingDetailsOutput today. The design has a "Mentor
 * Feedback" card and a "Your Review" card, but this endpoint has no fields
 * for either yet. Two options once you're ready:
 *   1. Add these to MenteeBookingDetailsOutput on the backend, or
 *   2. Fetch them from separate endpoints (e.g. GET /bookings/:id/feedback,
 *      GET /bookings/:id/review) and merge client-side in useSessionDetail.
 * Until then, SessionDetailPage passes `undefined` for both and the cards
 * render their empty states.
 */
export interface MentorFeedback {
  communicationRating: string; // e.g. "Strong", "Good", "Needs Improvement"
  topicsCovered: string[];
  strengths: string[];
  improvementAreas: string[];
  nextSteps: { id: string; text: string; completed: boolean }[];
}

export interface SessionReview {
  rating: number; // 1-5
  comment: string;
}
