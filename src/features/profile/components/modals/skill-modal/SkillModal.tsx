import { useState, useRef, useEffect } from "react";
import { Sparkles, Search, ChevronDown, Loader2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FormField, ModalHeader } from "@/components/shared";
import {
  type SkillModalProps,
  type SkillsFormData,
  SkillsFormSchema,
} from "@/features/profile/types/skill.types";
import {
  DropdownLoading,
  DropdownError,
  DropdownEmpty,
} from "./DropdownStates";
import { SkillChip } from "./SkillChip";

import { Highlight } from "./Highlight";
import {
  useAddOrUpdateMentorSkill,
  useFetchSkill,
  useRemoveMentorSkill,
} from "@/features/profile/hooks/useSkill";

export const SkillModal = ({
  open,
  onClose,
  onSave,
  initialData = [],
}: SkillModalProps) => {
  const [query, setQuery] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    mutateAsync: mutateForAddOrUpdate,
    isPending: isPendingForAddOrUpdate,
  } = useAddOrUpdateMentorSkill();

  const { mutateAsync: mutateForRemove, isPending: isPendingForRemove } =
    useRemoveMentorSkill();
  const {
    data: skillOptions = [],
    isLoading,
    isError,
    isPending,
    refetch,
  } = useFetchSkill(open);

  // ── Form setup ──
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillsFormData>({
    resolver: zodResolver(SkillsFormSchema),
    defaultValues: { skills: initialData },
  });

  console.log(initialData);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "skills",
  });

  // ── Close dropdown when clicking outside ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Filter and group skills ──
  const selectedIds = new Set(fields.map((f) => f.skillId));

  const filtered = skillOptions.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedIds.has(s.id),
  );

  const grouped = filtered.reduce((acc, s) => {
    const key = s.category ?? "Other";
    (acc[key] ??= []).push(s);
    return acc;
  }, {});

  // ── Handlers ──
  const handleSelect = (skill: (typeof skillOptions)[number]) => {
    mutateForAddOrUpdate({ skillId: skill.id, yearsExperience: undefined });
    append({ skillId: skill.id, yearsExperience: undefined });
    setQuery("");
    setDropOpen(true);
    inputRef.current?.focus();
  };

  const handleYearsChange = (
    index: number,
    v: number | undefined,
    id: string,
  ) => {
    mutateForAddOrUpdate({ skillId: id, yearsExperience: v });

    update(index, { ...fields[index], yearsExperience: v });
  };

  const handleClose = () => {
    reset({ skills: initialData });
    setQuery("");
    setDropOpen(false);
    onClose();
  };
  const handleRemove = (i, id) => {
    remove(i);
    mutateForRemove(id);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg w-full rounded-2xl p-6 gap-0">
        <ModalHeader
          icon={<Sparkles size={18} />}
          title={initialData.length ? "Edit Skills" : "Add Skills"}
          subtitle="Select skills and optionally add years of experience"
        />

        <Separator className="my-4" />

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Search */}
          <FormField
            label="Search Skills"
            required
            error={(errors.skills as { message?: string } | undefined)?.message}
          >
            <div className="relative" ref={dropRef}>
              <div className="relative">
                {isLoading ? (
                  <Loader2
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin pointer-events-none"
                  />
                ) : (
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  placeholder={isLoading ? "Loading skills…" : "Search skills…"}
                  disabled={isLoading || isError}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setDropOpen(true);
                  }}
                  onFocus={() => setDropOpen(true)}
                  className="w-full h-9 pl-8 pr-8 rounded-lg border border-slate-200 text-sm
                    bg-white text-slate-800 placeholder:text-slate-400
                    focus:outline-none focus:ring-1 focus:ring-slate-300
                    disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
                <ChevronDown
                  size={14}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                    transition-transform ${dropOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Dropdown */}
              {dropOpen && (
                <div
                  className="absolute z-50 mt-1 w-full bg-white border border-slate-200
                    rounded-xl shadow-lg max-h-52 overflow-y-auto"
                >
                  {isLoading ? (
                    <DropdownLoading />
                  ) : isError ? (
                    <DropdownError onRetry={() => refetch()} />
                  ) : Object.keys(grouped).length === 0 ? (
                    <DropdownEmpty query={query} />
                  ) : (
                    Object.entries(grouped).map(([category, skills]) => (
                      <div key={category}>
                        {skills[0].category && (
                          <p className="px-3 pt-2 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            {category}
                          </p>
                        )}
                        {skills.map((skill) => (
                          <button
                            key={skill.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelect(skill);
                              setDropOpen(false);
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-slate-700
                              hover:bg-slate-50 transition-colors text-left"
                          >
                            <Highlight text={skill.name} query={query} />
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </FormField>

          {/* Selected skills */}
          {fields.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Selected Skills
                </p>
                <Badge
                  variant="outline"
                  className="text-xs text-slate-500 border-slate-200 rounded-full"
                >
                  {fields.length} selected
                </Badge>
              </div>

              <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 pb-1">
                <span className="text-xs text-slate-400">Skill</span>
                <span className="text-xs text-slate-400 w-14 text-center">
                  Exp.
                </span>
                <span className="w-5" />
              </div>

              <div className="flex flex-col gap-2">
                <Controller
                  control={control}
                  name="skills"
                  render={() => (
                    <>
                      {fields.map((field, index) => {
                        const skill = skillOptions.find(
                          (s) => s.id === field.skillId,
                        );
                        return (
                          <SkillChip
                            key={field.id}
                            name={skill?.name ?? field.skillId}
                            yearsExperience={field.yearsExperience}
                            onYearsChange={(v) =>
                              handleYearsChange(index, v, field.skillId)
                            }
                            onRemove={() => handleRemove(index, field.skillId)}
                            error={
                              (
                                errors.skills as
                                  | Record<
                                      number,
                                      { yearsExperience?: { message?: string } }
                                    >
                                  | undefined
                              )?.[index]?.yearsExperience?.message
                            }
                          />
                        );
                      })}
                    </>
                  )}
                />
              </div>
            </div>
          )}

          {/* Empty state */}
          {fields.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 border border-dashed border-slate-200 rounded-xl text-center">
              <Sparkles size={20} className="text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">No skills selected yet</p>
              <p className="text-xs text-slate-300 mt-0.5">
                Search above to add skills
              </p>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {/* <ModalFooter
          onClose={handleClose}
          onSave={handleSubmit(submitHandler)}
          isSaving={isSubmitting}
        /> */}
      </DialogContent>
    </Dialog>
  );
};
