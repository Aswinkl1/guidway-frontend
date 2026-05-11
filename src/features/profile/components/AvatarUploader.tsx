import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useRef } from "react";

interface AvatarUploaderProps {
  preview: string | undefined;
  initials: string;
  onChange: (file: File) => void;
}

export const AvatarUploader = ({
  preview,
  initials,
  onChange,
}: AvatarUploaderProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-4">
      <div className="relative group">
        <Avatar className="w-16 h-16 border-2 border-slate-100">
          {preview ? (
            <AvatarImage src={preview} alt="Profile picture" />
          ) : (
            <AvatarFallback className="text-lg bg-violet-100 text-violet-700">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 rounded-full flex items-center justify-center
            bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Upload photo"
        >
          <Camera size={16} className="text-white" />
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
        >
          Change photo
        </button>
        <p className="text-xs text-slate-400 mt-0.5">
          JPG, PNG or WEBP · max 5 MB
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
          e.target.value = ""; // allow re-selecting same file
        }}
      />
    </div>
  );
};
