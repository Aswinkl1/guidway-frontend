// components/shared/sessions.tsx
// Reusable pieces for the "My Sessions" screen — Hosting & Attending tabs.
// Ignore navbar/sidebar here, those are already provided elsewhere.

import { forwardRef } from "react";
import { Calendar, ChevronDown, Loader2, Search, Video } from "lucide-react";
import {
  SessionRole,
  type BookingStatus,
  BOOKING_STATUS,
  type Booking,
} from "@/features/booking/types/booking.types";
import {
  STATUS_LABEL,
  getStartingSoonLabel,
  formatSessionDate,
  formatTimeRange,
  getDurationLabel,
} from "@/features/booking/utils/booking.utils";
import { Role } from "@/types/role";

/* ------------------------------------------------------------------ */
/* RoleTabs — "Hosting" / "Attending"                                  */
/* ------------------------------------------------------------------ */

interface RoleTabsProps {
  value: SessionRole;
  onChange: (role: SessionRole) => void;
  role: Role;
}

export function RoleTabs({ value, onChange, role }: RoleTabsProps) {
  const tabs: { key: SessionRole; label: string }[] =
    role === Role.MENTOR
      ? [
          { key: SessionRole.HOSTING, label: "Hosting" },
          { key: SessionRole.ATTENDING, label: "Attending" },
        ]
      : role === Role.MENTEE
        ? [{ key: SessionRole.ATTENDING, label: "Attending" }]
        : [];

  return (
    <div className="flex gap-6 border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`relative pb-3 text-sm font-medium transition-colors ${
            value === tab.key
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {tab.label}
          {value === tab.key && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SessionSearchBar                                                     */
/* ------------------------------------------------------------------ */

interface SessionSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SessionSearchBar = forwardRef<
  HTMLInputElement,
  SessionSearchBarProps
>(({ value, onChange, placeholder = "Search sessions..." }, ref) => (
  <div className="relative w-full max-w-xs">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    />
  </div>
));
SessionSearchBar.displayName = "SessionSearchBar";

/* ------------------------------------------------------------------ */
/* StatusFilter — dropdown over BOOKING_STATUS                         */
/* ------------------------------------------------------------------ */

interface StatusFilterProps {
  value: BookingStatus;
  onChange: (status: BookingStatus) => void;
}

const STATUS_OPTIONS: BookingStatus[] = [
  BOOKING_STATUS.CONFIRMED,
  BOOKING_STATUS.COMPLETED,
  BOOKING_STATUS.CANCELLED,
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as BookingStatus)}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABEL[status]}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StatusBadge                                                          */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<BookingStatus, string> = {
  CONFIRMED: "bg-blue-50 text-blue-600",
  COMPLETED: "bg-slate-100 text-slate-500",
  CANCELLED: "bg-red-50 text-red-500",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SessionAvatar                                                        */
/* ------------------------------------------------------------------ */

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SessionAvatar({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string | null;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="h-11 w-11 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
      {getInitials(name)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SessionCard                                                          */
/* ------------------------------------------------------------------ */

export interface SessionCardActions {
  onJoin?: (booking: Booking) => void;
  onReschedule?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onViewDetails?: (booking: Booking) => void;
}

interface SessionCardProps extends SessionCardActions {
  booking: Booking;
  /** Resolve a profileImageKey to a full URL however your app does it. */
  resolveImageUrl?: (key: string | null) => string | null;
}

export function SessionCard({
  booking,
  resolveImageUrl,
  onJoin,
  onReschedule,
  onCancel,
  onViewDetails,
}: SessionCardProps) {
  const startingSoonLabel = getStartingSoonLabel(booking);
  const imageUrl = resolveImageUrl
    ? resolveImageUrl(booking.user.profileImageKey)
    : booking.user.profileImageKey;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <SessionAvatar name={booking.user.name} imageUrl={imageUrl} />
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {booking.user.name}
          </p>
          <span className="mt-0.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
            {booking.sessionTitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Calendar className="h-4 w-4 text-slate-400" />
        <div>
          <p className="font-medium text-slate-700">
            {formatSessionDate(booking.startTime)}
          </p>
          <p>{formatTimeRange(booking.startTime, booking.endTime)}</p>
          <p className="text-xs text-slate-400">{getDurationLabel(booking)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {startingSoonLabel ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {startingSoonLabel}
          </span>
        ) : (
          <StatusBadge status={booking.status} />
        )}

        <div className="flex items-center gap-2">
          {/* {booking.status === BOOKING_STATUS.CONFIRMED && onReschedule && (
            <button
              type="button"
              onClick={() => onReschedule(booking)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Reschedule
            </button>
          )}
          {booking.status === BOOKING_STATUS.CONFIRMED && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(booking)}
              className="text-sm font-medium text-slate-500 hover:underline"
            >
              Cancel
            </button>
          )} */}
          {startingSoonLabel && onJoin ? (
            <button
              type="button"
              onClick={() => onJoin(booking)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Video className="h-4 w-4" />
              Join Session
            </button>
          ) : (
            onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(booking)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View Details
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SessionCardSkeleton                                                  */
/* ------------------------------------------------------------------ */

export function SessionCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-200" />
        </div>
      </div>
      <div className="h-8 w-24 rounded-lg bg-slate-200" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EmptySessionState                                                    */
/* ------------------------------------------------------------------ */

export function EmptySessionState({ role }: { role: SessionRole }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
      <Calendar className="mb-3 h-8 w-8 text-slate-300" />
      <p className="text-sm font-medium text-slate-600">
        No {role === "hosting" ? "hosting" : "attending"} sessions found
      </p>
      <p className="mt-1 text-sm text-slate-400">
        Try adjusting your search or filter.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LoadMoreButton                                                       */
/* ------------------------------------------------------------------ */

export function LoadMoreButton({
  onClick,
  isLoading,
}: {
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="mx-auto flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-60"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      Load more sessions
    </button>
  );
}
