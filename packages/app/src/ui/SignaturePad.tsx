import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SignaturePadLib from 'signature_pad';
import { Button } from './Button.js';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
}

/**
 * Trims whitespace around the signature by scanning pixel data for the
 * bounding box of non-empty pixels, then cropping to that area with padding.
 */
function trimCanvas(source: HTMLCanvasElement, padding = 8): string {
  const ctx = source.getContext('2d');
  if (!ctx) return source.toDataURL('image/png');

  const { width, height } = source;
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  // Scan all pixels — a pixel is "content" if its alpha > 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3] ?? 0;
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Nothing drawn
  if (maxX === 0 && maxY === 0) return source.toDataURL('image/png');

  // Add padding and clamp to canvas bounds
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  const trimmed = document.createElement('canvas');
  trimmed.width = cropW;
  trimmed.height = cropH;
  const tCtx = trimmed.getContext('2d');
  if (!tCtx) return source.toDataURL('image/png');

  tCtx.drawImage(source, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  return trimmed.toDataURL('image/png');
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext('2d');
    ctx?.scale(ratio, ratio);

    const pad = new SignaturePadLib(canvas, {
      penColor: '#1b1f23',
      minWidth: 0.5,
      maxWidth: 2.5,
      backgroundColor: 'rgba(0,0,0,0)',
    });
    padRef.current = pad;

    return () => {
      pad.off();
      padRef.current = null;
    };
  }, []);

  const handleClear = () => {
    padRef.current?.clear();
  };

  const handleApply = () => {
    const pad = padRef.current;
    const canvas = canvasRef.current;
    if (!pad || !canvas || pad.isEmpty()) return;
    const dataUrl = trimCanvas(canvas);
    onSave(dataUrl);
  };

  return (
    <div className="flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        className="h-30 w-full cursor-crosshair border-2 border-dashed border-line-strong bg-white"
      />
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={handleClear}>
          {t('coverLetterEditor.signaturePadClear')}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleApply}>
          {t('coverLetterEditor.signaturePadApply')}
        </Button>
      </div>
    </div>
  );
}
