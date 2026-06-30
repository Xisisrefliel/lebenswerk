import { useEffect, useRef, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

interface ColorPickerPopoverProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export function ColorPickerPopover({ label, value, onChange }: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={popoverRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
        }}
        className="flex items-center gap-2 text-sm"
      >
        <span
          className="block h-7 w-7 border border-line-strong"
          style={{ backgroundColor: value }}
        />
        <span className="text-ink">{label}</span>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 flex flex-col gap-2 border-2 border-line-strong bg-surface p-3">
          <HexColorPicker color={value} onChange={onChange} style={{ width: 200, height: 160 }} />
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted">#</span>
            <HexColorInput
              color={value}
              onChange={onChange}
              className="w-full border border-line-strong bg-canvas px-2 py-1 text-sm text-ink"
            />
          </div>
        </div>
      )}
    </div>
  );
}
