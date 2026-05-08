import { useState, useRef, useEffect } from "react";
import { Languages, Search, ChevronDown, Loader2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { FormField, ModalHeader } from "@/components/shared";

import {
  type LanguageModalProps,
  type LanguagesFormData,
  LanguagesFormSchema,
} from "@/features/profile/types/language.types";
import { Highlight } from "./skill-modal/Highlight";
import {
  useAddOrUpdateMentorLanguage,
  useRemoveMentorLanguage,
  useFetchLanguage,
} from "../../hooks/useLanguage";
import { LanguageChip } from "./LanguageChip";
import {
  DropdownLoading,
  DropdownError,
  DropdownEmpty,
} from "./skill-modal/DropdownStates";

export const LanguageModal = ({
  open,
  onClose,
  onSave,
  initialData = [],
}: LanguageModalProps) => {
  const [query, setQuery] = useState("");

  const [dropOpen, setDropOpen] = useState(false);

  const dropRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    mutateAsync: mutateForAddOrUpdate,
    isPending: isPendingForAddOrUpdate,
  } = useAddOrUpdateMentorLanguage();

  const { mutateAsync: mutateForRemove, isPending: isPendingForRemove } =
    useRemoveMentorLanguage();

  const {
    data: languageOptions = [],
    isLoading,
    isError,
    refetch,
  } = useFetchLanguage(open);

  // ── Form setup ──
  const {
    control,
    reset,
    formState: { errors },
  } = useForm<LanguagesFormData>({
    resolver: zodResolver(LanguagesFormSchema),
    defaultValues: { languages: initialData },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "languages",
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

  // ── Filter languages ──
  const selectedIds = new Set(fields.map((f) => f.languageId));

  const filtered = languageOptions.filter(
    (language) =>
      (language.name.toLowerCase().includes(query.toLowerCase()) ||
        language.code.toLowerCase().includes(query.toLowerCase())) &&
      !selectedIds.has(language.id),
  );

  // ── Handlers ──
  const handleSelect = (language: (typeof languageOptions)[number]) => {
    mutateForAddOrUpdate({
      languageId: language.id,
      proficiency: "BASIC",
    });

    append({
      languageId: language.id,
      proficiency: "BASIC",
    });

    setQuery("");

    setDropOpen(true);

    inputRef.current?.focus();
  };

  const handleProficiencyChange = (
    index: number,
    proficiency: "NATIVE" | "FLUENT" | "CONVERSATIONAL" | "BASIC",
    id: string,
  ) => {
    mutateForAddOrUpdate({
      languageId: id,
      proficiency,
    });

    update(index, {
      ...fields[index],
      proficiency,
    });
  };

  const handleClose = () => {
    reset({ languages: initialData });

    setQuery("");

    setDropOpen(false);

    onClose();
  };

  const handleRemove = (index: number, id: string) => {
    remove(index);

    mutateForRemove(id);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg w-full rounded-2xl p-6 gap-0">
        <ModalHeader
          icon={<Languages size={18} />}
          title={initialData.length ? "Edit Languages" : "Add Languages"}
          subtitle="Select languages and set proficiency level"
        />

        <Separator className="my-4" />

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Search */}
          <FormField
            label="Search Languages"
            required
            error={
              (errors.languages as { message?: string } | undefined)?.message
            }
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
                  placeholder={
                    isLoading ? "Loading languages…" : "Search languages…"
                  }
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
                  ) : filtered.length === 0 ? (
                    <DropdownEmpty query={query} />
                  ) : (
                    filtered.map((language) => (
                      <button
                        key={language.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();

                          handleSelect(language);

                          setDropOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-slate-700
                          hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="flex flex-col">
                          <span>
                            <Highlight text={language.name} query={query} />
                          </span>

                          <span className="text-xs text-slate-400 uppercase">
                            {language.code}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </FormField>

          {/* Selected languages */}
          {fields.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Selected Languages
                </p>

                <Badge
                  variant="outline"
                  className="text-xs text-slate-500 border-slate-200 rounded-full"
                >
                  {fields.length} selected
                </Badge>
              </div>

              <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 pb-1">
                <span className="text-xs text-slate-400">Language</span>

                <span className="text-xs text-slate-400 w-32 text-center">
                  Proficiency
                </span>

                <span className="w-5" />
              </div>

              <div className="flex flex-col gap-2">
                <Controller
                  control={control}
                  name="languages"
                  render={() => (
                    <>
                      {fields.map((field, index) => {
                        const language = languageOptions.find(
                          (l) => l.id === field.languageId,
                        );

                        return (
                          <LanguageChip
                            key={field.id}
                            name={language?.name ?? field.languageId}
                            code={language?.code ?? ""}
                            proficiency={field.proficiency}
                            onProficiencyChange={(v) =>
                              handleProficiencyChange(
                                index,
                                v,
                                field.languageId,
                              )
                            }
                            onRemove={() =>
                              handleRemove(index, field.languageId)
                            }
                            error={
                              (
                                errors.languages as
                                  | Record<
                                      number,
                                      {
                                        proficiency?: {
                                          message?: string;
                                        };
                                      }
                                    >
                                  | undefined
                              )?.[index]?.proficiency?.message
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
              <Languages size={20} className="text-slate-300 mb-2" />

              <p className="text-sm text-slate-400">
                No languages selected yet
              </p>

              <p className="text-xs text-slate-300 mt-0.5">
                Search above to add languages
              </p>
            </div>
          )}
        </div>

        <Separator className="my-4" />
      </DialogContent>
    </Dialog>
  );
};
