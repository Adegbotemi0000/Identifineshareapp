"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X, Loader2 } from "lucide-react";
import { validatePdfFile, fileToDataUrl, formatFileSize } from "@/lib/image";

interface FileUploadProps {
  label: string;
  value: string;
  fileName: string;
  fileSize: number;
  onChange: (dataUrl: string, fileName: string, fileSize: number) => void;
  onRemove: () => void;
}

export function FileUpload({
  label,
  value,
  fileName,
  fileSize,
  onChange,
  onRemove,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    const validationError = validatePdfFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl, file.name, file.size);
    } catch {
      setError("Something went wrong reading that file. Try again.");
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

      {value ? (
        <div className="flex items-center justify-between rounded-xl border border-gold-line bg-paper px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-4 h-4 text-gold shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-ink truncate">{fileName}</p>
              <p className="text-xs text-ink-soft">{formatFileSize(fileSize)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={value}
              download={fileName}
              className="text-xs text-gold font-medium"
            >
              View
            </a>
            <button type="button" onClick={onRemove} aria-label="Remove file">
              <X className="w-4 h-4 text-ink-soft" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-gold-line bg-ivory px-4 py-5 text-sm text-ink-soft"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}