import { useState } from "react";
import {
  Plus,
  Trash2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CalendarClock,
  Clock,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared";

// ── Reused from shared barrel ─────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeSlot {
  id: string;
  start: string; // "HH:MM"
  end: string;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
}

interface DateOverride {
  id: string;
  date: string; // "YYYY-MM-DD"
  label: string; // human-readable
  slots: TimeSlot[];
  isBlocked: boolean; // true = entire day blocked / unavailable
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _id = 0;
const uid = () => `id_${++_id}`;

const slot = (start: string, end: string): TimeSlot => ({
  id: uid(),
  start,
  end,
});

const fmt12 = (val: string) => {
  if (!val) return "";
  const [h, m] = val.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${String(hr).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
};

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_SCHEDULE: DaySchedule[] = [
  {
    day: "Monday",
    enabled: true,
    slots: [slot("09:00", "12:00"), slot("13:30", "17:00")],
  },
  { day: "Tuesday", enabled: true, slots: [slot("09:00", "17:00")] },
  { day: "Wednesday", enabled: false, slots: [] },
  { day: "Thursday", enabled: false, slots: [] },
  { day: "Friday", enabled: false, slots: [] },
  { day: "Saturday", enabled: false, slots: [] },
  { day: "Sunday", enabled: false, slots: [] },
];

const INITIAL_OVERRIDES: DateOverride[] = [
  {
    id: uid(),
    date: "2025-07-04",
    label: "Jul 4, 2025",
    slots: [],
    isBlocked: true,
  },
  {
    id: uid(),
    date: "2025-07-14",
    label: "Jul 14, 2025",
    slots: [slot("10:00", "14:00")],
    isBlocked: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── TimeRangeRow ──────────────────────────────────────────────────────────────

interface TimeRangeRowProps {
  slot: TimeSlot;
  onChange: (id: string, field: "start" | "end", val: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const TimeRangeRow: React.FC<TimeRangeRowProps> = ({
  slot,
  onChange,
  onRemove,
  canRemove,
}) => (
  <div className="flex items-center gap-2">
    <input
      type="time"
      value={slot.start}
      onChange={(e) => onChange(slot.id, "start", e.target.value)}
      className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700
        focus:outline-none focus:ring-1 focus:ring-blue-300 w-36"
    />
    <span className="text-slate-400 text-sm select-none">–</span>
    <input
      type="time"
      value={slot.end}
      onChange={(e) => onChange(slot.id, "end", e.target.value)}
      className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700
        focus:outline-none focus:ring-1 focus:ring-blue-300 w-36"
    />
    {canRemove && (
      <button
        onClick={() => onRemove(slot.id)}
        className="w-8 h-8 flex items-center justify-center rounded-lg
          text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        aria-label="Remove time slot"
      >
        <Trash2 size={14} />
      </button>
    )}
  </div>
);

// ── AddTimeSlotBtn ────────────────────────────────────────────────────────────

const AddTimeSlotBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-xs font-medium text-blue-600
      hover:text-blue-700 mt-1"
  >
    <Plus size={13} /> Add time slot
  </button>
);

// ── DayRow ────────────────────────────────────────────────────────────────────

interface DayRowProps {
  schedule: DaySchedule;
  onToggle: (day: string) => void;
  onSlotChange: (
    day: string,
    id: string,
    field: "start" | "end",
    val: string,
  ) => void;
  onSlotAdd: (day: string) => void;
  onSlotRemove: (day: string, id: string) => void;
  isLast: boolean;
}

const DayRow: React.FC<DayRowProps> = ({
  schedule,
  onToggle,
  onSlotChange,
  onSlotAdd,
  onSlotRemove,
  isLast,
}) => (
  <div className={`py-4 ${!isLast ? "border-b border-slate-100" : ""}`}>
    <div className="flex items-start gap-4">
      {/* Toggle + day label */}
      <div className="flex items-center gap-3 w-36 shrink-0 pt-1">
        <Switch
          checked={schedule.enabled}
          onCheckedChange={() => onToggle(schedule.day)}
          className="data-[state=checked]:bg-blue-500"
        />
        <span
          className={`text-sm font-medium ${schedule.enabled ? "text-slate-800" : "text-slate-400"}`}
        >
          {schedule.day}
        </span>
      </div>

      {/* Time slots or unavailable label */}
      {schedule.enabled ? (
        <div className="flex flex-col gap-2">
          {schedule.slots.map((sl) => (
            <TimeRangeRow
              key={sl.id}
              slot={sl}
              onChange={(id, field, val) =>
                onSlotChange(schedule.day, id, field, val)
              }
              onRemove={(id) => onSlotRemove(schedule.day, id)}
              canRemove={schedule.slots.length > 1}
            />
          ))}
          <AddTimeSlotBtn onClick={() => onSlotAdd(schedule.day)} />
        </div>
      ) : (
        <span className="text-sm text-slate-400 pt-1.5">Unavailable</span>
      )}
    </div>
  </div>
);

// ── DateOverrideRow ───────────────────────────────────────────────────────────

interface DateOverrideRowProps {
  override: DateOverride;
  onRemove: (id: string) => void;
  onSlotChange: (
    id: string,
    slotId: string,
    field: "start" | "end",
    val: string,
  ) => void;
  onSlotAdd: (id: string) => void;
  onSlotRemove: (id: string, slotId: string) => void;
}

const DateOverrideRow: React.FC<DateOverrideRowProps> = ({
  override,
  onRemove,
  onSlotChange,
  onSlotAdd,
  onSlotRemove,
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
            <TimeRangeRow
              key={sl.id}
              slot={sl}
              onChange={(slotId, field, val) =>
                onSlotChange(override.id, slotId, field, val)
              }
              onRemove={(slotId) => onSlotRemove(override.id, slotId)}
              canRemove={override.slots.length > 1}
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
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [overrides, setOverrides] = useState<DateOverride[]>(INITIAL_OVERRIDES);
  const [overridesExpanded, setOverridesExpanded] = useState(true);
  const [lastSaved, setLastSaved] = useState("Today at 2:30 PM");

  // ── Weekly schedule handlers ───────────────────────────────────────────────

  const toggleDay = (day: string) =>
    setSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              enabled: !d.enabled,
              slots:
                !d.enabled && d.slots.length === 0
                  ? [slot("09:00", "17:00")]
                  : d.slots,
            }
          : d,
      ),
    );

  const updateSlot = (
    day: string,
    id: string,
    field: "start" | "end",
    val: string,
  ) =>
    setSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              slots: d.slots.map((sl) =>
                sl.id === id ? { ...sl, [field]: val } : sl,
              ),
            }
          : d,
      ),
    );

  const addSlot = (day: string) =>
    setSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, slots: [...d.slots, slot("09:00", "17:00")] }
          : d,
      ),
    );

  const removeSlot = (day: string, id: string) =>
    setSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, slots: d.slots.filter((sl) => sl.id !== id) }
          : d,
      ),
    );

  // ── Override handlers ──────────────────────────────────────────────────────

  const removeOverride = (id: string) =>
    setOverrides((prev) => prev.filter((o) => o.id !== id));

  const updateOverrideSlot = (
    ovId: string,
    slotId: string,
    field: "start" | "end",
    val: string,
  ) =>
    setOverrides((prev) =>
      prev.map((o) =>
        o.id === ovId
          ? {
              ...o,
              slots: o.slots.map((sl) =>
                sl.id === slotId ? { ...sl, [field]: val } : sl,
              ),
            }
          : o,
      ),
    );

  const addOverrideSlot = (ovId: string) =>
    setOverrides((prev) =>
      prev.map((o) =>
        o.id === ovId
          ? { ...o, slots: [...o.slots, slot("09:00", "17:00")] }
          : o,
      ),
    );

  const removeOverrideSlot = (ovId: string, slotId: string) =>
    setOverrides((prev) =>
      prev.map((o) =>
        o.id === ovId
          ? { ...o, slots: o.slots.filter((sl) => sl.id !== slotId) }
          : o,
      ),
    );

  const handleSave = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setLastSaved(`Today at ${time}`);
    // await api.saveAvailability({ schedule, overrides });
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

        {/* ── Weekly Availability — reuses SectionCard ── */}
        <SectionCard
          title="Weekly Availability"
          icon={<CalendarDays size={15} />}
          className="mb-5"
        >
          {/* Sub-heading */}
          <p className="text-xs text-slate-400 -mt-2 mb-3">
            Set your standard recurring hours for each day of the week.
          </p>

          {schedule.map((day, i) => (
            <DayRow
              key={day.day}
              schedule={day}
              onToggle={toggleDay}
              onSlotChange={updateSlot}
              onSlotAdd={addSlot}
              onSlotRemove={removeSlot}
              isLast={i === schedule.length - 1}
            />
          ))}
        </SectionCard>

        {/* ── Date Overrides — reuses SectionCard ── */}
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
                      onRemove={removeOverride}
                      onSlotChange={updateOverrideSlot}
                      onSlotAdd={addOverrideSlot}
                      onSlotRemove={removeOverrideSlot}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Add override button */}
          <button
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600
              hover:text-blue-700 mt-4"
          >
            <Plus size={14} /> Add date override
          </button>
        </SectionCard>
      </div>

      {/* ── Sticky save footer ── */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={12} />
          Last saved: {lastSaved}
        </div>
        <Button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-9 font-semibold"
        >
          Save Availability
        </Button>
      </div> */}
    </div>
  );
};

export default AvailabilityPage;
