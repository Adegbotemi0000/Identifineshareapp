"use client";

import { useEffect } from "react";
import { X, Download } from "lucide-react";

interface ImageLightboxProps {
  src: string | null;
  alt: string;
  downloadName: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, downloadName, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (!src) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-full max-h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- data URL preview */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[70vh] rounded-xl object-contain"
        />
        <div className="mt-4 flex gap-3">
          <a
            href={src}
            download={downloadName}
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white px-5 py-2.5 text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}