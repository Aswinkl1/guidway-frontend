import { useState } from "react";
import {
  Plus,
  Trash2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CalendarClock,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { SectionCard } from "@/components/shared";
import { TimeRangeModal } from "../components/AvailabiliyModal";
import {
  useAvailability,
  useDeleteAvailability,
  useToggleAvailability,
} from "../hooks/useAddAvailability";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface ITimeSlot {
  id: string;
  startTime: number; // minutes from midnight
  endTime: number; // minutes from midnight
}

export interface GetAvailabilityPayload {
  dayOfWeek: DayOfWeek;
  slots: ITimeSlot[];
  isActive: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert minutes from midnight → "HH:MM AM/PM" */
const minsToLabel = (mins: number): string => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${String(hr).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── TimeSlotChip (read-only) ──────────────────────────────────────────────────

interface TimeSlotChipProps {
  slot: ITimeSlot;
  onRemove: (id: string) => void;
}

const TimeSlotChip: React.FC<TimeSlotChipProps> = ({ slot, onRemove }) => (
  <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 w-fit">
    <span>{minsToLabel(slot.startTime)}</span>
    <span className="text-slate-400">–</span>
    <span>{minsToLabel(slot.endTime)}</span>
    <button
      onClick={() => onRemove(slot.id)}
      className="w-5 h-5 flex items-center justify-center rounded
        text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
      aria-label="Remove time slot"
    >
      <Trash2 size={12} />
    </button>
  </div>
);

// ── AddTimeSlotBtn ────────────────────────────────────────────────────────────

const AddTimeSlotBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 mt-1"
  >
    <Plus size={13} /> Add time slot
  </button>
);

// ── DayRow ────────────────────────────────────────────────────────────────────

interface DayRowProps {
  payload: GetAvailabilityPayload;
  onToggle: (day: DayOfWeek, isActive: boolean) => void;
  onSlotRemove: (day: DayOfWeek, slotId: string) => void;
  onSlotAdd: (day: DayOfWeek) => void;
  isLast: boolean;
}

const DayRow: React.FC<DayRowProps> = ({
  payload,
  onToggle,
  onSlotRemove,
  onSlotAdd,
  isLast,
}) => (
  <div className={`py-4 ${!isLast ? "border-b border-slate-100" : ""}`}>
    <div className="flex items-start gap-4">
      {/* Toggle + day label */}
      <div className="flex items-center gap-3 w-36 shrink-0 pt-1">
        <Switch
          checked={payload.isActive}
          onCheckedChange={() => onToggle(payload.dayOfWeek, !payload.isActive)}
          className="data-[state=checked]:bg-blue-500"
        />
        <span
          className={`text-sm font-medium ${
            payload.isActive ? "text-slate-800" : "text-slate-400"
          }`}
        >
          {payload.dayOfWeek}
        </span>
      </div>

      {/* Time slots or unavailable */}
      {payload.isActive ? (
        <div className="flex flex-col gap-2">
          {payload.slots.map((sl) => (
            <TimeSlotChip
              key={sl.id}
              slot={sl}
              onRemove={(id) => onSlotRemove(payload.dayOfWeek, id)}
            />
          ))}
          <AddTimeSlotBtn onClick={() => onSlotAdd(payload.dayOfWeek)} />
        </div>
      ) : (
        <>
          <span className="text-sm text-slate-400 pt-1.5">Unavailable</span>
        </>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// OVERRIDE TYPES & SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

export interface IDateOverride {
  id: string;
  date: string; // "YYYY-MM-DD"
  label: string; // human-readable e.g. "Jul 4, 2025"
  slots: ITimeSlot[];
  isBlocked: boolean; // true = entire day blocked
}

interface DateOverrideRowProps {
  override: IDateOverride;
  onRemove: (id: string) => void;
  onSlotRemove: (ovId: string, slotId: string) => void;
  onSlotAdd: (ovId: string) => void;
}

const DateOverrideRow: React.FC<DateOverrideRowProps> = ({
  override,
  onRemove,
  onSlotRemove,
  onSlotAdd,
}) => (
  <div className="flex items-start gap-4 py-3 border-b border-slate-100 last:border-0">
    <div className="w-36 shrink-0">
      <p className="text-sm font-semibold text-slate-800">{override.label}</p>
      {override.isBlocked && (
        <span className="inline-flex items-center mt-0.5 text-xs text-red-500 font-medium">
          Blocked
        </span>
      )}
    </div>

    <div className="flex-1 flex flex-col gap-2">
      {override.isBlocked ? (
        <span className="text-sm text-slate-400">No availability this day</span>
      ) : (
        <>
          {override.slots.map((sl) => (
            <TimeSlotChip
              key={sl.id}
              slot={sl}
              onRemove={(slotId) => onSlotRemove(override.id, slotId)}
            />
          ))}
          <AddTimeSlotBtn onClick={() => onSlotAdd(override.id)} />
        </>
      )}
    </div>

    <button
      onClick={() => onRemove(override.id)}
      className="w-8 h-8 flex items-center justify-center rounded-lg
        text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
      aria-label="Remove override"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const AvailabilityPage: React.FC = () => {
  const [overridesExpanded, setOverridesExpanded] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "">("");

  // ── Data ───────────────────────────────────────────────────────────────────

  const { data, isPending } = useAvailability();
  const { mutateAsync } = useDeleteAvailability();
  const [openDel, setOpenDel] = useState(false);
  const [delId, setDelId] = useState<string>("");
  const { mutateAsync: mutateAsyncForToggleAvailability } =
    useToggleAvailability();
  if (isPending) {
    return;
  }

  // `data` is expected to be:
  //   { schedule: GetAvailabilityPayload[], overrides: IDateOverride[] }
  // Adjust the destructuring below to match your actual API shape.

  const schedule: GetAvailabilityPayload[] = data ?? [];
  const overrides: IDateOverride[] = data?.overrides ?? [];

  if (isPending) return null;

  // ── Weekly schedule handlers ───────────────────────────────────────────────

  const handleToggle = (day: DayOfWeek, isActive: boolean) => {
    console.log("jhdfdkja", day);
    mutateAsyncForToggleAvailability({ dayOfWeek: day, isActive });
  };

  const handleSlotRemove = (day: DayOfWeek, slotId: string) => {
    setDelId(slotId);
    setOpenDel(true);
  };

  const handleSlotAdd = (day: DayOfWeek) => {
    setSelectedDay(day);
    setOpenAdd(true);
  };

  // ── Override handlers ──────────────────────────────────────────────────────

  const handleOverrideRemove = (id: string) => {
    // TODO: call your delete override mutation here
  };

  const handleOverrideSlotRemove = (ovId: string, slotId: string) => {
    // TODO: call your delete override slot mutation here
  };

  const handleOverrideSlotAdd = (ovId: string) => {
    // TODO: open an add-slot modal for this override
  };

  const handleAddOverride = () => {
    // TODO: open date-picker / override creation modal
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Top label bar */}
      <div className="border-b border-slate-200 bg-white px-8 py-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Availability Settings
        </p>
      </div>

      <ConfirmDialog
        title="Delete slot"
        description="This action cannot be undone. Proceed with deletion?"
        onCancel={() => {
          setOpenDel(false);
        }}
        onConfirm={() => {
          mutateAsync(delId);
        }}
        open={openDel}
        cancelLabel="Cancel"
        confirmLabel="Delete"
      />

      <TimeRangeModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={() => {}}
        dayOfWeek={selectedDay}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 max-w-3xl pb-24">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Manage Schedule</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Configure your weekly schedule, date-specific exceptions, and manage
            your session offerings. Changes here will apply to future bookings
            only.
          </p>
        </div>

        {/* ── Weekly Availability ── */}
        <SectionCard
          title="Weekly Availability"
          icon={<CalendarDays size={15} />}
          className="mb-5"
        >
          <p className="text-xs text-slate-400 -mt-2 mb-3">
            Set your standard recurring hours for each day of the week.
          </p>

          {schedule.map((payload, i) => (
            <DayRow
              key={payload.dayOfWeek}
              payload={payload}
              onToggle={handleToggle}
              onSlotRemove={handleSlotRemove}
              onSlotAdd={handleSlotAdd}
              isLast={i === schedule.length - 1}
            />
          ))}
        </SectionCard>

        {/* ── Date Overrides ── */}
        <SectionCard title="Date Overrides" icon={<CalendarClock size={15} />}>
          <p className="text-xs text-slate-400 -mt-2 mb-4">
            Add exceptions for specific dates to override your weekly schedule.
          </p>

          {/* Collapsible active overrides */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOverridesExpanded((v) => !v)}
              className="flex items-center justify-between w-full px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700">
                Active Overrides ({overrides.length})
              </span>
              {overridesExpanded ? (
                <ChevronUp size={15} className="text-slate-400" />
              ) : (
                <ChevronDown size={15} className="text-slate-400" />
              )}
            </button>

            {overridesExpanded && (
              <div className="px-4 pb-2 bg-white border-t border-slate-100">
                {overrides.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center">
                    No active overrides
                  </p>
                ) : (
                  overrides.map((ov) => (
                    <DateOverrideRow
                      key={ov.id}
                      override={ov}
                      onRemove={handleOverrideRemove}
                      onSlotRemove={handleOverrideSlotRemove}
                      onSlotAdd={handleOverrideSlotAdd}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Add override button */}
          <button
            onClick={handleAddOverride}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600
              hover:text-blue-700 mt-4"
          >
            <Plus size={14} /> Add date override
          </button>
        </SectionCard>
      </div>
    </div>
  );
};

export default AvailabilityPage;
