import { Chip } from "./Chip";

interface SkillChipProps {
  name: string;
  yearsExperience?: number;
  onYearsChange: (v: number | undefined) => void;
  onRemove: () => void;
  error?: string;
}

export const SkillChip = ({
  name,
  yearsExperience,
  onYearsChange,
  onRemove,
  error,
}: SkillChipProps) => {
  return (
    <Chip
      title={name}
      onInputChange={onYearsChange}
      onRemove={onRemove}
      error={error}
      inputValue={yearsExperience}
    />
  );
};
