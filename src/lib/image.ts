// Client-side image handling for the prototype. Compresses images before
// they're stored as data URLs so localStorage doesn't fill up with huge
// uncompressed uploads. See spec §24.
//
// NOTE: localStorage typically caps out around 5-10MB per origin. Since the
// whole profile (photo + cover + background + gallery + portfolio) is
// stored as one JSON blob, these limits are intentionally conservative.

export const MAX_IMAGE_SOURCE_SIZE = 10 * 1024 * 1024; // 10MB raw upload cap (pre-compression)
export const MAX_PDF_SIZE = 4 * 1024 * 1024; // 4MB — PDFs aren't compressed, so this cap is stricter

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG or WEBP image.";
  }
  if (file.size > MAX_IMAGE_SOURCE_SIZE) {
    return "Image must be smaller than 10MB.";
  }
  return null;
}

export function validatePdfFile(file: File): string | null {
  if (file.type !== "application/pdf") {
    return "Please upload a PDF file.";
  }
  if (file.size > MAX_PDF_SIZE) {
    return `PDF must be smaller than ${(MAX_PDF_SIZE / (1024 * 1024)).toFixed(0)}MB for this prototype.`;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function compressImage(
  file: File,
  maxDimension = 900,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error("Could not process the image."));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
          } else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas is not supported in this browser."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}