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
        className="flex h-9 w-full items-center gap-2 border-b border-line bg-white/[0.02] px-2 text-left text-sm transition-colors last:border-b-0 hover:bg-white/[0.045]"
      >
        <span
          className="block h-5 w-5 shrink-0 border border-line-strong"
          style={{ backgroundColor: value }}
        />
        <span className="min-w-0 truncate text-xs font-medium text-ink">{label}</span>
        <span className="ml-auto font-mono text-[10px] uppercase text-muted">{value}</span>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 flex flex-col gap-2 border border-line-strong bg-surface-2 p-3 shadow-lg">
          <HexColorPicker color={value} onChange={onChange} style={{ width: 200, height: 160 }} />
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted">#</span>
            <HexColorInput
              color={value}
              onChange={onChange}
              className="w-full border border-line-strong bg-canvas px-2 py-1 text-sm text-ink focus:border-blue focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
