import type { MentorStatus } from "./profile.types";

export type UpdateVisibilityDTO = {
  status: MentorStatus;
};

export type BookingRuleField =
  | "leadTimeHours"
  | "futureLimitDays"
  | "maxSessionsDaily"
  | "bufferTimeMinutes"
  | "cancellationCutoffHours";

export type BookingRulePayload = Partial<Record<BookingRuleField, number>>;
