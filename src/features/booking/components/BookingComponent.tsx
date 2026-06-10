import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  Clock,
  Calendar,
  User,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IAvailableSlot {
  startTime: number; // minutes from midnight
  endTime: number;
  isAvailable: boolean;
}

export interface IMentor {
  name: string;
  title: string;
  avatarUrl?: string;
}

export interface ISessionInfo {
  type: string;
  durationPerSlot: number; // minutes
  pricePerSlot: number; // in currency units
  currencySymbol?: string; // e.g. "₹", "$"
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const minsToLabel = (mins: number): string => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${String(hr).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
};

const formatDateLabel = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// ─── Sub-components ───────────────────────────────────────────────────────────

// ── Calendar ──────────────────────────────────────────────────────────────────

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const BookingCalendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-slate-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="h-10" />;
          }
          const date = new Date(viewYear, viewMonth, day);
          const past = isPast(day);
          const isSelected = selectedDate
            ? isSameDay(date, selectedDate)
            : false;
          const isToday = isSameDay(date, today);

          return (
            <div key={day} className="flex items-center justify-center h-10">
              <button
                disabled={past}
                onClick={() => onDateSelect(date)}
                className={`
                  w-9 h-9 rounded-xl text-sm font-medium transition-all
                  ${
                    past
                      ? "text-slate-300 cursor-not-allowed"
                      : isSelected
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                        : isToday
                          ? "border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                          : "text-slate-700 hover:bg-slate-100"
                  }
                `}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── TimeSlotGrid ──────────────────────────────────────────────────────────────

interface TimeSlotGridProps {
  date: Date;
  slots: IAvailableSlot[];
  selectedSlots: IAvailableSlot[];
  onSlotToggle: (slot: IAvailableSlot) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  date,
  slots,
  selectedSlots,
  onSlotToggle,
}) => {
  /**
   * Contiguous group logic:
   * A slot is "selectable" if:
   *   - it is available, AND
   *   - if nothing is selected: always true
   *   - if something IS selected: it must be directly adjacent to the current selection
   *     AND there's no unavailable gap between them
   */
  const isSelected = (slot: IAvailableSlot) =>
    selectedSlots.some((s) => s.startTime === slot.startTime);

  const canSelect = (slot: IAvailableSlot): boolean => {
    if (!slot.isAvailable) return false;
    if (selectedSlots.length === 0) return true;

    const sorted = [...selectedSlots].sort((a, b) => a.startTime - b.startTime);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    // Directly adjacent before or after
    const adjacentBefore = slot.endTime === first.startTime;
    const adjacentAfter = slot.startTime === last.endTime;

    if (!adjacentBefore && !adjacentAfter) return false;

    // Check no unavailable slot sits between them
    if (adjacentBefore) {
      const gap = slots.find(
        (s) => s.startTime >= slot.endTime && s.endTime <= first.startTime,
      );
      return !gap || gap.isAvailable;
    }
    if (adjacentAfter) {
      const gap = slots.find(
        (s) => s.startTime >= last.endTime && s.endTime <= slot.startTime,
      );
      return !gap || gap.isAvailable;
    }
    return false;
  };

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-slate-700 mb-3">
        Available times for{" "}
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </p>

      {slots.length === 0 ? (
        <p className="text-sm text-slate-400">
          No available slots for this date.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot) => {
            const selected = isSelected(slot);
            const selectable = canSelect(slot);
            const unavailable = !slot.isAvailable;

            return (
              <button
                key={slot.startTime}
                disabled={unavailable || (!selected && !selectable)}
                onClick={() => onSlotToggle(slot)}
                className={`
                  h-11 rounded-xl text-sm font-medium border transition-all
                  ${
                    unavailable
                      ? "border-slate-100 bg-slate-50 text-slate-300 line-through cursor-not-allowed"
                      : selected
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                        : selectable
                          ? "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                          : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  }
                `}
              >
                {minsToLabel(slot.startTime)}
              </button>
            );
          })}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-4">
        <Globe size={12} />
        Times are shown in your local timezone.
      </p>
    </div>
  );
};

// ── BookingSummaryCard ────────────────────────────────────────────────────────

interface BookingSummaryCardProps {
  mentor: IMentor;
  session: ISessionInfo;
  selectedDate: Date | null;
  selectedSlots: IAvailableSlot[];
  onBookNow: () => void;
  onAddNote: () => void;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  mentor,
  session,
  selectedDate,
  selectedSlots,
  onBookNow,
  onAddNote,
}) => {
  const sorted = [...selectedSlots].sort((a, b) => a.startTime - b.startTime);
  const totalSlots = sorted.length;
  const totalMinutes = totalSlots * session.durationPerSlot;
  const totalPrice = totalSlots * session.pricePerSlot;
  const symbol = session.currencySymbol ?? "₹";

  const startLabel =
    sorted.length > 0 ? minsToLabel(sorted[0].startTime) : null;
  const endLabel =
    sorted.length > 0 ? minsToLabel(sorted[sorted.length - 1].endTime) : null;
  const dateLabel = selectedDate ? formatDateLabel(selectedDate) : null;

  const canBook = selectedDate !== null && selectedSlots.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4 sticky top-6">
      {/* Mentor */}
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          {mentor.avatarUrl && <AvatarImage src={mentor.avatarUrl} />}
          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
            {mentor.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-slate-900">{mentor.name}</p>
          <p className="text-xs text-slate-500">{mentor.title}</p>
        </div>
      </div>

      <Separator />

      {/* Session details */}
      <div className="flex flex-col gap-3">
        <DetailRow label="Session Type" value={session.type} />
        <DetailRow
          label="Duration"
          value={
            totalMinutes > 0
              ? `${totalMinutes} mins`
              : `${session.durationPerSlot} mins / slot`
          }
        />
        {dateLabel && <DetailRow label="Date" value={dateLabel} />}
        {startLabel && endLabel && (
          <DetailRow label="Time" value={`${startLabel} – ${endLabel}`} bold />
        )}
      </div>

      <Separator />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Total</span>
        <span className="text-xl font-bold text-slate-900">
          {symbol}
          {totalPrice.toLocaleString()}
        </span>
      </div>

      {/* CTA */}
      <Button
        disabled={!canBook}
        onClick={onBookNow}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-semibold text-sm disabled:opacity-40"
      >
        Continue
      </Button>

      <button
        onClick={onAddNote}
        className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        <StickyNote size={12} />
        Add note
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <Lock size={11} />
        Secure booking
      </div>
    </div>
  );
};

// ── DetailRow ─────────────────────────────────────────────────────────────────

const DetailRow: React.FC<{ label: string; value: string; bold?: boolean }> = ({
  label,
  value,
  bold,
}) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-slate-400">{label}</span>
    <span
      className={`text-sm ${bold ? "font-semibold text-slate-900" : "text-slate-700"}`}
    >
      {value}
    </span>
  </div>
);

// ── TimezoneSelector ──────────────────────────────────────────────────────────

export const TimezoneSelector: React.FC<{ timezone: string }> = ({
  timezone,
}) => (
  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-9 text-sm text-slate-600 bg-white cursor-pointer hover:border-slate-300 transition-colors select-none">
    <Globe size={14} className="text-slate-400" />
    <span>{timezone}</span>
    <ChevronRight size={14} className="text-slate-400 rotate-90" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

// Replace with your real props / API shape
interface BookingPageProps {
  mentor: IMentor;
  session: ISessionInfo;
  timezone?: string;
  /** Called when user selects a date; you fire your API call here */
  onDateChange: (date: Date) => void;
  /** Slots returned from your API for the selected date */
  availableSlots: IAvailableSlot[];
  /** Called when user clicks Continue / Book Now */
  onBookNow: (date: Date, slots: IAvailableSlot[]) => void;
  /** Called when user clicks Add note */
  onAddNote: () => void;
}

const BookingPageComponent: React.FC<BookingPageProps> = ({
  mentor,
  session,
  timezone = "Asia/Kolkata (GMT+05:30)",
  onDateChange,
  availableSlots,
  onBookNow,
  onAddNote,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<IAvailableSlot[]>([]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlots([]);
    onDateChange(date); // ← your API call goes here
  };

  const handleSlotToggle = (slot: IAvailableSlot) => {
    setSelectedSlots((prev) => {
      const already = prev.some((s) => s.startTime === slot.startTime);
      if (already) {
        // Deselecting: only allow deselecting from the ends
        const sorted = [...prev].sort((a, b) => a.startTime - b.startTime);
        const isFirst = sorted[0].startTime === slot.startTime;
        const isLast = sorted[sorted.length - 1].startTime === slot.startTime;
        if (isFirst || isLast) {
          return prev.filter((s) => s.startTime !== slot.startTime);
        }
        return prev; // can't deselect middle slot
      }
      return [...prev, slot];
    });
  };

  const handleBookNow = () => {
    if (selectedDate && selectedSlots.length > 0) {
      onBookNow(selectedDate, selectedSlots); // ← your booking logic goes here
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* ── Reusable Navbar placeholder ──────────────────────────────────────── */}
      {/* <Navbar /> */}

      <div className="flex-1 px-8 py-8 max-w-5xl mx-auto w-full">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Select a Date & Time
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Booking with {mentor.name} · {session.type} ·{" "}
              {session.durationPerSlot} mins
            </p>
          </div>
          <TimezoneSelector timezone={timezone} />
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
          {/* Left column */}
          <div>
            <BookingCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />

            {selectedDate && (
              <TimeSlotGrid
                date={selectedDate}
                slots={availableSlots}
                selectedSlots={selectedSlots}
                onSlotToggle={handleSlotToggle}
              />
            )}
          </div>

          {/* Right column */}
          <BookingSummaryCard
            mentor={mentor}
            session={session}
            selectedDate={selectedDate}
            selectedSlots={selectedSlots}
            onBookNow={handleBookNow}
            onAddNote={onAddNote}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPageComponent;
