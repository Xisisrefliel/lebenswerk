/**
 * Shared image utilities for photo and signature uploads.
 *
 * Since everything runs client-side (data stored in localStorage + exported JSON),
 * we accept any file size but automatically resize and compress to keep storage
 * and rendering performant.
 */

/** Max dimension in pixels — enough for 300dpi A4 print. */
const MAX_PHOTO_DIMENSION = 800;
const MAX_SIGNATURE_DIMENSION = 600;

/** JPEG quality for compressed output. */
const JPEG_QUALITY = 0.85;

/**
 * Read an image file and return a compressed data URL.
 * Resizes to fit within maxDimension (preserving aspect ratio) and
 * re-encodes as JPEG (or PNG for transparent images).
 */
export function processImageFile(file: File, maxDimension = MAX_PHOTO_DIMENSION): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      reject(reader.error ?? new Error('Failed to read file'));
    };
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('Failed to decode image'));
      };
      img.onload = () => {
        const { width, height } = img;

        // If already small enough and reasonably sized, return raw data URL
        if (width <= maxDimension && height <= maxDimension && file.size <= 500_000) {
          resolve(reader.result as string);
          return;
        }

        // Calculate scaled dimensions
        const scale = Math.min(maxDimension / width, maxDimension / height, 1);
        const targetW = Math.round(width * scale);
        const targetH = Math.round(height * scale);

        // Draw to canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // Use PNG for transparent formats, JPEG otherwise
        const isPng = file.type === 'image/png';
        const mimeType = isPng ? 'image/png' : 'image/jpeg';
        const quality = isPng ? undefined : JPEG_QUALITY;
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/** Process a photo upload (max 800px). */
export function processPhotoFile(file: File): Promise<string> {
  return processImageFile(file, MAX_PHOTO_DIMENSION);
}

/** Process a signature upload (max 600px). */
export function processSignatureFile(file: File): Promise<string> {
  return processImageFile(file, MAX_SIGNATURE_DIMENSION);
}

/** Validate that a file is an accepted image type. */
export function isValidImageFile(file: File): boolean {
  return file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/webp';
}
