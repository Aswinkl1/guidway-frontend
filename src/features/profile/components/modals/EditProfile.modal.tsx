// EditProfileModal.tsx
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle, Plus, AlertCircle, Globe, Phone } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormField, ModalHeader, ModalFooter } from "@/components/shared";
import {
  EditProfileFormSchema,
  type CreateSocialLinkDTO,
  type EditProfileDTO,
  type EditProfileFormData,
  type UpdateMentorOverviewDTO,
} from "../../schemas/edit-profile.schema";
import { AvatarUploader } from "../AvatarUploader";
import { LinkRow } from "../LinkRow";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DomainOption {
  id: string;
  domainName: string;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * Called with payloads for each of the 3 endpoints.
   * Fire them in parallel or in sequence — your choice.
   */
  onSave: (payloads: EditProfileFormData) => Promise<any> | void;
  domains: DomainOption[];
  initialData?: Partial<EditProfileFormData>;
  currentAvatar?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (GMT-5:00)" },
  { value: "America/Chicago", label: "Central Time (GMT-6:00)" },
  { value: "America/Denver", label: "Mountain Time (GMT-7:00)" },
  { value: "America/Los_Angeles", label: "Pacific Time (GMT-8:00)" },
  { value: "Europe/London", label: "London (GMT+0:00)" },
  { value: "Europe/Paris", label: "Paris (GMT+1:00)" },
  { value: "Asia/Kolkata", label: "Mumbai (GMT+5:30)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9:00)" },
  { value: "Asia/Dubai", label: "Dubai (GMT+4:00)" },
  { value: "Australia/Sydney", label: "Sydney (GMT+11:00)" },
];

const MAX_LINKS = 5;
const MAX_BIO = 500;
const MAX_HEADLINE = 120;

const DEFAULTS: EditProfileFormData = {
  name: "",
  phoneNumber: "",
  timezone: "America/New_York",
  shortBio: "",
  headline: "",
  domainId: "",
  links: [],
  avatarFile: undefined,
};

// ─── Small reusable pieces ────────────────────────────────────────────────────

/** Section label used to visually group fields inside the single scroll area. */
const SectionLabel = ({ label }: { label: string }) => (
  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest pt-1">
    {label}
  </p>
);

/** Inline character counter shown beneath Textarea fields. */
const CharCount = ({ current, max }: { current: number; max: number }) => (
  <p
    className={`text-xs text-right mt-1 ${current > max ? "text-red-500" : "text-slate-400"}`}
  >
    {current} / {max}
  </p>
);

export const EditProfileModal = ({
  open,
  onClose,
  onSave,
  domains,
  initialData,
  currentAvatar,
}: EditProfileModalProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    currentAvatar,
  );

  // ── Form ───────────────────────────────────────────────────────────────────

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: { ...DEFAULTS, ...initialData },
  });
  console.log(errors);
  const { fields, append, remove } = useFieldArray({
    control,
    // useFieldArray works on object arrays; we wrap strings in {value}
    name: "links" as never,
  });

  const shortBioValue = watch("shortBio") ?? "";
  const headlineValue = watch("headline") ?? "";

  // ── Avatar handler ─────────────────────────────────────────────────────────

  const handleAvatarChange = (file: File) => {
    setValue("avatarFile", file, { shouldDirty: true });
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Submit — split into 3 payloads ─────────────────────────────────────────

  const submitHandler = async (data: EditProfileFormData) => {
    console.log("savdkfdklfjkldfjkdljflkjkl");
    const profile: EditProfileDTO = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      timezone: data.timezone,
    };
    console.log(profile);

    const overview: UpdateMentorOverviewDTO = {
      shortBio: data.shortBio,
      headline: data.headline,
      domainId: data.domainId,
    };

    // Filter out any empty strings before sending
    const validLinks = data.links.map((l) => l.value).filter(Boolean);

    const links: CreateSocialLinkDTO = { links: validLinks };
    console.log("link");

    console.log(links);
    await onSave({
      ...profile,
      ...overview,
      ...links,
      avatarFile: data.avatarFile,
    });

    handleClose();
  };

  const handleClose = () => {
    reset({ ...DEFAULTS, ...initialData });
    setAvatarPreview(currentAvatar);
    onClose();
  };

  // ── Portal guard ───────────────────────────────────────────────────────────

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const nameInitials =
    watch("name")
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "ME";

  // ── Render ─────────────────────────────────────────────────────────────────
  console.log(domains);
  return createPortal(
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-xl w-full rounded-2xl p-6 gap-0">
        {/* Header */}
        <ModalHeader
          icon={<UserCircle size={18} />}
          title="Edit Profile"
          subtitle="Update your personal info, bio and social links"
        />

        <Separator className="my-4" />

        {/* ── Scrollable body ── */}
        <div className="flex flex-col gap-5 max-h-[65vh] overflow-y-auto pr-1">
          {/* ════ SECTION 1 — Personal Info ════ */}
          <SectionLabel label="Personal Info" />

          {/* Avatar */}
          <AvatarUploader
            preview={avatarPreview}
            initials={nameInitials}
            onChange={handleAvatarChange}
          />

          {/* Name */}
          <FormField label="Full Name" required error={errors.name?.message}>
            <Input
              placeholder="e.g. Sarah Jenkins"
              {...register("name")}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            {/* Phone */}
            <FormField label="Phone Number" error={errors.phoneNumber?.message}>
              <div className="relative">
                <Phone
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <Input
                  placeholder="+1 555 000 0000"
                  {...register("phoneNumber")}
                  className="h-9 pl-8 text-sm border-slate-200"
                />
              </div>
            </FormField>

            {/* Timezone */}
            <FormField
              label="Timezone"
              required
              error={errors.timezone?.message}
            >
              <Controller
                control={control}
                name="timezone"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-sm border-slate-200">
                      <Globe size={13} className="text-slate-400 shrink-0" />
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="max-h-52">
                      {TIMEZONES.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-sm"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <Separator />

          {/* ════ SECTION 2 — Mentor Overview ════ */}
          <SectionLabel label="Mentor Overview" />

          {/* Domain */}
          <FormField
            label="Primary Domain"
            required
            error={errors.domainId?.message}
          >
            <Controller
              control={control}
              name="domainId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 text-sm border-slate-200">
                    <SelectValue placeholder="Select your domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map(({ id, domainName }) => (
                      <SelectItem key={id} value={id} className="text-sm">
                        {domainName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          {/* Headline */}
          <FormField label="Headline" error={errors.headline?.message}>
            <Input
              placeholder="e.g. Senior Staff Engineer at Google"
              {...register("headline")}
              className={`h-9 text-sm border-slate-200 ${
                headlineValue.length > MAX_HEADLINE ? "border-red-300" : ""
              }`}
            />
            <CharCount current={headlineValue.length} max={MAX_HEADLINE} />
          </FormField>

          {/* Short Bio */}
          <FormField label="Short Bio" error={errors.shortBio?.message}>
            <Textarea
              placeholder="Tell mentees about your background, expertise and what you enjoy helping with…"
              {...register("shortBio")}
              rows={4}
              className={`text-sm border-slate-200 resize-none ${
                shortBioValue.length > MAX_BIO ? "border-red-300" : ""
              }`}
            />
            <CharCount current={shortBioValue.length} max={MAX_BIO} />
          </FormField>

          <Separator />

          {/* ════ SECTION 3 — Social Links ════ */}
          <div className="flex items-center justify-between">
            <SectionLabel label="Social Links" />
            <span className="text-xs text-slate-400">
              {fields.length} / {MAX_LINKS}
            </span>
          </div>

          {fields.length === 0 && (
            <p className="text-xs text-slate-400 -mt-2">
              Add up to {MAX_LINKS} links — LinkedIn, GitHub, personal site,
              etc.
            </p>
          )}

          {/* Link rows */}
          {fields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`links.${index}` as never}
              render={({ field: f }) => (
                <LinkRow
                  index={index}
                  value={(f.value as { value: string }).value ?? ""}
                  onChange={(v) => f.onChange({ value: v })}
                  onRemove={() => remove(index)}
                  canRemove
                  error={
                    (
                      errors.links as unknown as
                        | { [k: number]: { value?: { message?: string } } }
                        | undefined
                    )?.[index]?.value?.message
                  }
                />
              )}
            />
          ))}

          {/* Array-level error (min / max) */}
          {errors.links?.root?.message && (
            <p className="flex items-center gap-1 text-xs text-red-500 -mt-2">
              <AlertCircle size={11} /> {errors.links.root.message}
            </p>
          )}

          {/* Add link button */}
          {fields.length < MAX_LINKS && (
            <button
              type="button"
              onClick={() => append({ value: "" } as never)}
              className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium w-fit"
            >
              <Plus size={14} /> Add link
            </button>
          )}
        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <ModalFooter
          onClose={handleClose}
          onSave={handleSubmit(submitHandler)}
          isSaving={isSubmitting}
          saveLabel="Save Profile"
        />
      </DialogContent>
    </Dialog>,
    modalRoot,
  );
};
