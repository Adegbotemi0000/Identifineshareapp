"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { validateImageFile, compressImage } from "@/lib/image";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  maxDimension?: number;
  heightClassName?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  maxDimension = 1200,
  heightClassName = "h-32",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const compressed = await compressImage(file, maxDimension);
      onChange(compressed);
    } catch {
      setError("Something went wrong processing that image. Try another file.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-ink-soft mb-1.5">
        {label}
      </label>

      <div
        className={`relative rounded-xl border border-dashed border-gold-line bg-ivory overflow-hidden ${heightClassName}`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URL preview, not an optimizable remote asset
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-ink-soft"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImagePlus className="w-5 h-5" />
            )}
            <span className="text-xs">
              {loading ? "Processing..." : "Click to upload"}
            </span>
          </button>
        )}

        {value && (
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-paper/90 rounded-full px-2.5 py-1 text-[11px] text-ink shadow-sm"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-paper/90 rounded-full p-1 text-ink shadow-sm"
              aria-label={`Remove ${label}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}