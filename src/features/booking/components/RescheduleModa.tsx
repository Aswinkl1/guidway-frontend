import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookingCalendar,
  BookingSummaryCard,
  TimeSlotGrid,
  TimezoneSelector,
  type IAvailableSlot,
  type IMentor,
  type ISessionInfo,
} from "./BookingComponent";

// ─────────────────────────────────────────────────────────────────────────────
// RescheduleModal
// ─────────────────────────────────────────────────────────────────────────────

interface RescheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mentorId: string;
  mentor: IMentor;
  session: ISessionInfo;
  timezone?: string;

  /** Slots for the currently selected date — you own the fetch, just pass the result in */
  availableSlots: IAvailableSlot[];

  /**
   * Fired whenever the user picks a date in the calendar.
   * Kick off your existing slot-fetching hook here using mentorId + date,
   * then update the `availableSlots` prop you pass back in.
   */
  onDateChange: (mentorId: string, date: Date) => void;

  /**
   * Fired when the user confirms the reschedule.
   * Write your reschedule mutation / API call here.
   */
  onConfirmReschedule: (
    mentorId: string,
    date: Date,
    slots: IAvailableSlot[],
  ) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  open,
  onOpenChange,
  mentorId,
  mentor,
  session,
  timezone = "Asia/Kolkata (GMT+05:30)",
  availableSlots,
  onDateChange,
  onConfirmReschedule,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<IAvailableSlot[]>([]);

  // Reset selection whenever the modal is reopened for a (possibly different) mentor
  useEffect(() => {
    if (open) {
      setSelectedDate(null);
      setSelectedSlots([]);
    }
  }, [open, mentorId]);

  // Whenever the slots for the selected date arrive/change, drop any stale selection
  useEffect(() => {
    setSelectedSlots([]);
  }, [availableSlots]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlots([]);
    onDateChange(mentorId, date); // ← your fetch-slots hook goes here
  };

  const handleSlotToggle = (slot: IAvailableSlot) => {
    setSelectedSlots((prev) => {
      const already = prev.some((s) => s.startTime === slot.startTime);
      if (already) {
        const sorted = [...prev].sort((a, b) => a.startTime - b.startTime);
        const isFirst = sorted[0].startTime === slot.startTime;
        const isLast = sorted[sorted.length - 1].startTime === slot.startTime;
        if (isFirst || isLast) {
          return prev.filter((s) => s.startTime !== slot.startTime);
        }
        return prev; // can't deselect a middle slot
      }
      return [...prev, slot];
    });
  };

  const handleReschedule = () => {
    if (selectedDate && selectedSlots.length > 0) {
      onConfirmReschedule(mentorId, selectedDate, selectedSlots); // ← your reschedule logic goes here
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Reschedule session
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-1">
                {mentor.name} · {session.type} · {session.durationPerSlot} mins
              </p>
            </div>
            <TimezoneSelector timezone={timezone} />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 items-start px-6 pb-6">
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
            onBookNow={handleReschedule}
            onAddNote={() => {}}
            isReschedule={true}
            // NOTE: BookingSummaryCard's button label is currently hardcoded
            // to "Pay now" — see below for the one-line change to make it say
            // "Confirm reschedule" instead.
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
