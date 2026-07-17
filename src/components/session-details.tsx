// components/shared/session-detail.tsx
// Reusable pieces for the "Session Details" screen.
// Ignore navbar/sidebar — already provided elsewhere.

import {
  BOOKING_STATUS,
  type BookingStatus,
} from "@/features/booking/types/booking.types";
import type {
  MentorFeedback,
  SessionReview,
} from "@/features/booking/types/bookingDetails.types";
import {
  formatSessionDate,
  formatTimeRange,
} from "@/features/booking/utils/booking.utils";
import {
  Banknote,
  Bookmark,
  CalendarClock,
  Check,
  Flag,
  Info,
  MessageCircle,
  MessageSquare,
  Star,
  ThumbsUp,
  Trash2,
  Users,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

/* ------------------------------------------------------------------ */
/* MentorInfoCard                                                       */
/* Only `name` and `profileImageKey` exist on MenteeBookingDetailsOutput. */
/* If/when the backend adds a title or badges (e.g. "Ex-Amazon"), add    */
/* optional `title?: string` / `badges?: string[]` props here.           */
/* ------------------------------------------------------------------ */

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

interface MentorInfoCardProps {
  user: {
    name: string;
    profileImageKey: string | null;
  };
  resolveImageUrl?: (key: string | null) => string | null;
  onViewProfile: () => void;
}

export function MentorInfoCard({
  user,
  resolveImageUrl,
  onViewProfile,
}: MentorInfoCardProps) {
  const imageUrl = resolveImageUrl
    ? resolveImageUrl(user.profileImageKey)
    : user.profileImageKey;

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20 border-2 border-slate-100 shrink-0">
          <AvatarImage
            src={`${import.meta.env.VITE_S3_BASE_URL + imageUrl}`} // Just drop your AWS S3 URL here
            alt={`${user.name}'s profile picture`}
            className="object-cover" // Ensures the image scales nicely inside the circle
          />
          <AvatarFallback className="text-xl bg-violet-100 text-violet-700">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold text-slate-900">{user.name}</p>
      </div>
      <button
        type="button"
        onClick={onViewProfile}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        View Profile
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SessionInfoGrid                                                      */
/* ------------------------------------------------------------------ */

interface SessionInfoGridProps {
  sessionTitle: string;
  duration?: string;
  startDateTime: Date;
  endDateTime: Date;
  status: BookingStatus;
}

const STATUS_COMBINED_LABEL: Record<BookingStatus, string> = {
  CONFIRMED: "Confirmed",
  COMPLETED: "Confirmed & Completed",
  CANCELLED: "Cancelled",
};

export function SessionInfoGrid({
  sessionTitle,
  duration,
  startDateTime,
  endDateTime,
  status,
}: SessionInfoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 rounded-xl border border-slate-100 bg-white p-5 sm:grid-cols-4">
      <div>
        <p className="text-xs font-medium uppercase text-slate-400">
          Session Type
        </p>
        <p className="mt-1 text-sm font-medium text-slate-800">
          {sessionTitle}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase text-slate-400">Duration</p>
        <p className="mt-1 text-sm font-medium text-slate-800">
          {duration ?? "—"}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase text-slate-400">
          Date &amp; Time
        </p>
        <p className="mt-1 text-sm font-medium text-slate-800">
          {formatSessionDate(startDateTime)},{" "}
          {formatTimeRange(startDateTime, endDateTime)}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase text-slate-400">Status</p>
        <p className="mt-1 text-sm font-medium text-green-600">
          {STATUS_COMBINED_LABEL[status]}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ManageSessionPanel                                                   */
/* ------------------------------------------------------------------ */

export interface ManageSessionActions {
  onReport: () => void;
  onMessageMentor: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  status: BookingStatus;
}

interface SessionAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
  allowedStatuses: BookingStatus[]; // Widen the type here!
}

export function ManageSessionPanel({
  onReport,
  onMessageMentor,
  onReschedule,
  onCancel,
  status,
}: ManageSessionActions) {
  const items: SessionAction[] = [
    {
      label: "Report Session",
      icon: Flag,
      onClick: onReport,
      allowedStatuses: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED],
    },
    {
      label: "Message Mentor",
      icon: MessageCircle,
      onClick: onMessageMentor,
      allowedStatuses: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED],
    },
    {
      label: "Reschedule Session",
      icon: CalendarClock,
      onClick: onReschedule,
      allowedStatuses: [BOOKING_STATUS.CONFIRMED],
    },
    {
      label: "Cancel Session",
      icon: XCircle,
      onClick: onCancel,
      danger: true,
      allowedStatuses: [BOOKING_STATUS.CONFIRMED],
    },
  ];

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Manage Session
      </p>
      <div className="mt-3 space-y-2">
        {items.map(
          ({ label, icon: Icon, onClick, danger, allowedStatuses }) => {
            if (!allowedStatuses.includes(status)) return null;
            return (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                  danger
                    ? "border-red-100 text-red-500 hover:bg-red-50"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PaymentCard                                                          */
/* ------------------------------------------------------------------ */

const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function PaymentCard({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) {
  const symbol = CURRENCY_SYMBOL[currency] ?? `${currency} `;
  return (
    <div className="mt-3 rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <Banknote className="h-4 w-4 text-slate-400" />
        {symbol}
        {amount}
      </div>
      {/* No payment method (card/UPI) field exists on this DTO yet — add
			   one (e.g. `paidVia`) if you want a "Paid via Visa •••• 1234" line. */}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* InfoCard — used for "What This Session Covers" and "Your Note"       */
/* ------------------------------------------------------------------ */

export function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Info;
  title: string;
  text: string | null;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <Icon className="h-4 w-4 text-blue-500" />
        {title}
      </div>
      <p className="mt-3 text-sm italic text-slate-500">
        {text ? `"${text}"` : "No note added."}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MentorFeedbackCard                                                   */
/* ------------------------------------------------------------------ */

export function MentorFeedbackCard({
  feedback,
}: {
  feedback?: MentorFeedback;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
      <div className="flex items-center gap-2 bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
        <MessageSquare className="h-4 w-4" />
        Mentor Feedback
      </div>

      {!feedback ? (
        <div className="p-6 text-center text-sm text-slate-400">
          Feedback hasn't been submitted for this session yet.
        </div>
      ) : (
        <div className="space-y-5 p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MessageCircle className="h-4 w-4 text-slate-400" />
              Communication &amp; Interaction
            </span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
              {feedback.communicationRating}
            </span>
          </div>

          <div>
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Users className="h-4 w-4 text-slate-400" />
              Topics Covered
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {feedback.topicsCovered.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              Strengths
            </span>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-600">
              {feedback.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Zap className="h-4 w-4 text-orange-500" />
              Improvement Areas
            </span>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-600">
              {feedback.improvementAreas.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Bookmark className="h-4 w-4 text-slate-400" />
              Homework &amp; Next Steps
            </span>
            <ul className="mt-2 space-y-2">
              {feedback.nextSteps.map((step) => (
                <li
                  key={step.id}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      step.completed
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-300"
                    }`}
                  >
                    {step.completed && <Check className="h-3 w-3 text-white" />}
                  </span>
                  {step.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ReviewCard                                                           */
/* ------------------------------------------------------------------ */

export function ReviewCard({
  review,
  onLeaveReview,
  onDeleteReview,
}: {
  review?: SessionReview;
  onLeaveReview: () => void;
  onDeleteReview: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
      {/* Header with Title and Delete Button */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Star className="h-4 w-4 text-amber-400" />
          Your Review
        </div>

        {/* Only show the delete button if a review exists */}
        {review && (
          <button
            type="button"
            onClick={() => onDeleteReview(review.id)}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete review"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {review ? (
        <div className="p-5">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                }`}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <MessageCircle className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            How was your session?
          </p>
          <p className="text-xs text-slate-400">
            Your feedback helps your mentor and the community grow.
          </p>
          <button
            type="button"
            onClick={onLeaveReview}
            className="mt-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Leave a Review
          </button>
        </div>
      )}
    </div>
  );
}
