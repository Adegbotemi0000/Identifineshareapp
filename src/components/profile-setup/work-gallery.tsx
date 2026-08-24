"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { validateImageFile, compressImage } from "@/lib/image";

interface WorkGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function WorkGallery({ images, onChange, max = 6 }: WorkGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const remaining = max - images.length;
    if (remaining <= 0) {
      setError(`You can add up to ${max} work images.`);
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    setLoading(true);

    try {
      const compressed: string[] = [];
      for (const file of selected) {
        const validationError = validateImageFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }
        // Gallery thumbnails don't need to be large — keep them small to
        // leave storage room for the other profile images and portfolio.
        compressed.push(await compressImage(file, 700, 0.68));
      }
      if (compressed.length) onChange([...images, ...compressed]);
    } catch {
      setError("Something went wrong processing one of those images.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-xs font-medium text-ink-soft mb-1.5">
        Work gallery ({images.length}/{max})
      </label>

      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-lg overflow-hidden border border-gold-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL preview */}
            <img
              src={src}
              alt={`Work sample ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 bg-paper/90 rounded-full p-1 shadow-sm"
              aria-label={`Remove work image ${i + 1}`}
            >
              <X className="w-3 h-3 text-ink" />
            </button>
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border border-dashed border-gold-line bg-ivory flex flex-col items-center justify-center gap-1 text-ink-soft"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ImagePlus className="w-4 h-4" />
            )}
            <span className="text-[10px]">Add</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}