import { Chip } from "./skill-modal/Chip";

interface LanguageChipProps {
  name: string;
  code: string;
  proficiency: "NATIVE" | "FLUENT" | "CONVERSATIONAL" | "BASIC";

  onProficiencyChange: (
    v: "NATIVE" | "FLUENT" | "CONVERSATIONAL" | "BASIC",
  ) => void;

  onRemove: () => void;

  error?: string;
}

const PROFICIENCY_OPTIONS = [
  "NATIVE",
  "FLUENT",
  "CONVERSATIONAL",
  "BASIC",
] as const;

export const LanguageChip = ({
  name,
  code,
  proficiency,
  onProficiencyChange,
  onRemove,
  error,
}: LanguageChipProps) => {
  return (
    <Chip
      title={`${name} (${code.toUpperCase()})`}
      onRemove={onRemove}
      error={error}
    >
      <select
        value={proficiency}
        onChange={(e) =>
          onProficiencyChange(
            e.target.value as LanguageChipProps["proficiency"],
          )
        }
        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
      >
        {PROFICIENCY_OPTIONS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </Chip>
  );
};
