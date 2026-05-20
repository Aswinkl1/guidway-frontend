import { useState } from "react";
import { Bell, MessageSquare, Clock, Globe } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { useMentorVisibility } from "../hooks/useMentorStatusMutation";
import { MentorStatus } from "../types/profile.types";
import type {
  BookingRuleField,
  BookingRulePayload,
  UpdateVisibilityDTO,
} from "../types/settings.types";
import { useMentorBookingRules } from "../hooks/useMentorBookingRulesMutation";
import { ChangePasswordModal } from "../components/modals/ResetPassword.modal";
import type { ChangePasswordFormData } from "../schemas/resetPassword.schema";
import { resetPassword } from "../services/settings.services";
import toast from "react-hot-toast";
import { useSettings } from "../hooks/useSettings";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionCardProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

interface SettingSelectProps {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  description?: string;
}

// ─── Reused: SectionCard (adapted to accept an icon prop) ─────────────────────

const SectionCard = ({
  icon,
  title,
  children,
  className = "",
}: SectionCardProps) => (
  <Card
    className={`shadow-none border border-slate-200 rounded-2xl ${className}`}
  >
    <CardHeader className="flex flex-row items-center gap-2 pb-3 pt-5 px-6">
      {icon && (
        <span className="w-4 h-4 text-slate-400 flex items-center justify-center shrink-0">
          {icon}
        </span>
      )}
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    </CardHeader>
    <CardContent className="px-6 pb-5">{children}</CardContent>
  </Card>
);

// ─── New: SettingSelect ───────────────────────────────────────────────────────

const SettingSelect: React.FC<SettingSelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  description,
}) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-xs text-slate-500">{label}</Label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 text-sm border-slate-200 bg-white rounded-lg">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="text-sm">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {description && <p className="text-xs text-slate-400">{description}</p>}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const MentorSettingsPage = () => {
  // ── Public Profile ─────────────────────────────────────────────────────────
  const [publicProfile, setPublicProfile] = useState(true);
  const { mutateAsync: mutateAsyncForMentorVisibility } = useMentorVisibility();
  const { mutateAsync: mutateAsyncForMentorBookingRules } =
    useMentorBookingRules();
  function handleMentorVisibility(isVisible: boolean) {
    console.log(isVisible);
    const data: UpdateVisibilityDTO = {
      status: isVisible ? MentorStatus.ACTIVE : MentorStatus.PAUSED,
    };
    setPublicProfile(isVisible);
    mutateAsyncForMentorVisibility(data);
  }

  // ── Booking Rules ──────────────────────────────────────────────────────────
  const { data, isPending } = useSettings();
  console.log(data);
  const [earliestBooking, setEarliestBooking] = useState("24");
  const [bookingWindow, setBookingWindow] = useState("30");
  const [maxSessions, setMaxSessions] = useState("4");
  const [bufferTime, setBufferTime] = useState("15");
  const [openRP, setOpenRP] = useState(false);
  function handleBookingRules(field: BookingRuleField, value: string) {
    const payload: BookingRulePayload = { [field]: Number(value) };
    mutateAsyncForMentorBookingRules(payload);
  }
  // // ── Trust & Dispute ────────────────────────────────────────────────────────
  // const [allowReschedule, setAllowReschedule] = useState(true);
  // const [allowCancellation, setAllowCancellation] = useState(true);
  // const [actionCutoff, setActionCutoff] = useState("24h");

  // ── Timezone ───────────────────────────────────────────────────────────────
  // const [timezone, setTimezone] = useState("America/New_York");
  async function handleResetPassword(
    data: Omit<ChangePasswordFormData, "confirmPassword">,
  ) {
    await resetPassword(data);
    toast.success("reset password successfull");
  }

  if (isPending) {
    return;
  }
  return (
    <>
      <ChangePasswordModal
        onClose={() => {
          setOpenRP(false);
        }}
        onSave={handleResetPassword}
        open={openRP}
      />
      <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
        {/* ── Main ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Topbar (reused from MentorProfilePage) */}
          <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-full hover:bg-slate-100">
                <Bell size={18} className="text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 rounded-full hover:bg-slate-100">
                <MessageSquare size={18} className="text-slate-500" />
              </button>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src="https://i.pravatar.cc/40?img=47"
                    alt="Alex Johnson"
                  />
                  <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                    AJ
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    Alex Johnson
                  </p>
                  <p className="text-xs text-slate-400 leading-tight">
                    Senior Mentor
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="px-8 py-6 max-w-4xl space-y-5">
            {/* Page heading */}
            <div className="mb-1">
              <h2 className="text-2xl font-bold text-slate-900">
                Settings & Preferences
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage your availability, booking rules, and account security.
              </p>
            </div>

            {/* ── Public Profile Visibility ── */}
            <Card className="shadow-none border border-slate-200 rounded-2xl">
              <CardContent className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                      <Globe size={17} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Public profile visibility
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        When turned off, your profile is hidden from search and
                        new bookings are paused.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={data.status == MentorStatus.ACTIVE}
                    onCheckedChange={handleMentorVisibility}
                    className="data-[state=checked]:bg-violet-600 shrink-0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* ── Booking Rules + Trust & Dispute (side by side) ── */}
            <div className="grid grid-cols-1 gap-5">
              {/* Booking Rules */}
              <SectionCard icon={<Clock size={15} />} title="Booking Rules">
                <div className="grid grid-cols-2 gap-4">
                  <SettingSelect
                    label="Earliest Booking"
                    value={String(data.BookingRules.leadTimeHours)}
                    onValueChange={(v: string) => {
                      setEarliestBooking(v);
                      handleBookingRules("leadTimeHours", v);
                    }}
                    options={[
                      { value: "1", label: "1 hour before" },
                      { value: "2", label: "2 hours before" },
                      { value: "6", label: "6 hours before" },
                      { value: "12", label: "12 hours before" },
                      { value: "24", label: "24 hours before" },
                      { value: "48", label: "48 hours before" },
                    ]}
                  />
                  <SettingSelect
                    label="Booking Window"
                    value={data.BookingRules.futureLimitDays + ""}
                    onValueChange={(v: string) => {
                      setBookingWindow(v);
                      handleBookingRules("futureLimitDays", v);
                    }}
                    options={[
                      { value: "7", label: "7 days into future" },
                      { value: "14", label: "14 days into future" },
                      { value: "30", label: "30 days into future" },
                      { value: "60", label: "60 days into future" },
                      { value: "90", label: "90 days into future" },
                    ]}
                  />
                  <SettingSelect
                    label="Max Sessions / Day"
                    value={data.BookingRules.maxSessionsDaily + ""}
                    onValueChange={(v: string) => {
                      setMaxSessions(v);
                      handleBookingRules("maxSessionsDaily", v);
                    }}
                    options={[
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                      { value: "3", label: "3" },
                      { value: "4", label: "4" },
                      { value: "5", label: "5" },
                      { value: "6", label: "6" },
                    ]}
                  />
                  <SettingSelect
                    label="Buffer Time"
                    value={data.BookingRules.bufferTimeMinutes + ""}
                    onValueChange={(v: string) => {
                      setBufferTime(v);
                      handleBookingRules("bufferTimeMinutes", v);
                    }}
                    options={[
                      { value: "0", label: "None" },
                      { value: "5", label: "5 min" },
                      { value: "10", label: "10 min" },
                      { value: "15", label: "15 min" },
                      { value: "30", label: "30 min" },
                      { value: "60", label: "60 min" },
                    ]}
                  />
                </div>
              </SectionCard>

              {/* Trust & Dispute */}
              {/* <SectionCard
              icon={<ShieldCheck size={15} />}
              title="Trust & Dispute"
            >
              <div className="space-y-0 divide-y divide-slate-100">
                <VisibilityToggle
                  label="Allow Rescheduling"
                  subtitle="Mentees can change time"
                  checked={allowReschedule}
                  onChange={setAllowReschedule}
                />
                <VisibilityToggle
                  label="Allow Cancellations"
                  subtitle="Mentees can cancel"
                  checked={allowCancellation}
                  onChange={setAllowCancellation}
                />
              </div>

              <div className="mt-4">
                <SettingSelect
                  label="Action Cutoff Window"
                  value={actionCutoff}
                  onValueChange={setActionCutoff}
                  options={[
                    { value: "1h", label: "1 hour before session" },
                    { value: "6h", label: "6 hours before session" },
                    { value: "12h", label: "12 hours before session" },
                    { value: "24h", label: "24 hours before session" },
                    { value: "48h", label: "48 hours before session" },
                  ]}
                  description="Mentees cannot reschedule or cancel after this time."
                />
              </div>
            </SectionCard> */}
            </div>

            {/* ── Notification Preferences ── */}
            {/* <SectionCard
            icon={<Bell size={15} />}
            title="Notification Preferences"
          >
            <div className="divide-y divide-slate-100">
              <NotificationRow
                label="Session Reminders"
                emailChecked={notifs.sessionReminders.email}
                inAppChecked={notifs.sessionReminders.inApp}
                onEmailChange={(v) => setNotif("sessionReminders", "email", v)}
                onInAppChange={(v) => setNotif("sessionReminders", "inApp", v)}
              />
              <NotificationRow
                label="Booking Confirmations"
                emailChecked={notifs.bookingConfirmations.email}
                inAppChecked={notifs.bookingConfirmations.inApp}
                onEmailChange={(v) =>
                  setNotif("bookingConfirmations", "email", v)
                }
                onInAppChange={(v) =>
                  setNotif("bookingConfirmations", "inApp", v)
                }
              />
              <NotificationRow
                label="Cancellations"
                emailChecked={notifs.cancellations.email}
                inAppChecked={notifs.cancellations.inApp}
                onEmailChange={(v) => setNotif("cancellations", "email", v)}
                onInAppChange={(v) => setNotif("cancellations", "inApp", v)}
              />
              <NotificationRow
                label="Payouts"
                emailChecked={notifs.payouts.email}
                inAppChecked={notifs.payouts.inApp}
                onEmailChange={(v) => setNotif("payouts", "email", v)}
                onInAppChange={(v) => setNotif("payouts", "inApp", v)}
              />
            </div>
          </SectionCard> */}

            {/* ── Timezone & Security ── */}
            <SectionCard icon={<Globe size={15} />} title="Security">
              <div className="grid grid-cols-2 gap-6">
                {/* Timezone */}
                {/* <div className="flex flex-col gap-3">
                <SettingSelect
                  label="Your Timezone"
                  value={timezone}
                  onValueChange={setTimezone}
                  options={[
                    {
                      value: "America/New_York",
                      label: "Eastern Time (US & Canada) (GMT-5:00)",
                    },
                    {
                      value: "America/Chicago",
                      label: "Central Time (US & Canada) (GMT-6:00)",
                    },
                    {
                      value: "America/Denver",
                      label: "Mountain Time (US & Canada) (GMT-7:00)",
                    },
                    {
                      value: "America/Los_Angeles",
                      label: "Pacific Time (US & Canada) (GMT-8:00)",
                    },
                    { value: "Europe/London", label: "London (GMT+0:00)" },
                    { value: "Europe/Paris", label: "Paris (GMT+1:00)" },
                    { value: "Asia/Kolkata", label: "Mumbai (GMT+5:30)" },
                    { value: "Asia/Tokyo", label: "Tokyo (GMT+9:00)" },
                  ]}
                />
                <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertTriangle
                    size={13}
                    className="text-amber-500 mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Changing your timezone will update all your available slots
                    relative to existing bookings.
                  </p>
                </div>
              </div> */}

                {/* Security */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-slate-500">reset</Label>
                  <div className="flex items-center justify-between h-9 px-3 border border-slate-200 rounded-lg bg-white">
                    <span className="text-sm text-slate-700">
                      Rest password
                    </span>
                    <button
                      onClick={() => setOpenRP(true)}
                      className="text-xs font-medium text-violet-600 hover:text-violet-700 hover:underline"
                    >
                      click
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ── Danger Zone ── */}
            {/* <Card className="shadow-none border border-red-200 rounded-2xl bg-white">
            <CardContent className="px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-red-600 mb-1">
                    Danger Zone
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    Delete Account
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-sm leading-relaxed">
                    Once you delete your account, there is no going back. Please
                    be certain. You currently have{" "}
                    <span className="font-semibold text-slate-700">
                      3 upcoming sessions
                    </span>
                    , so deletion is temporarily disabled.
                  </p>
                </div>
                <Button
                  size="sm"
                  disabled
                  className="bg-slate-100 text-slate-400 cursor-not-allowed shrink-0 hover:bg-slate-100"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorSettingsPage;
