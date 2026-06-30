import { type ReactNode, useState } from 'react';
import { Collapsible } from './Collapsible.js';

interface ListItemCardProps {
  summary: string;
  defaultOpen?: boolean;
  onRemove: () => void;
  children: ReactNode;
}

export function ListItemCard({
  summary,
  defaultOpen = false,
  onRemove,
  children,
}: ListItemCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const header = (
    <div className="flex items-center gap-2 py-2.5">
      <svg
        className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 4l4 4-4 4" />
      </svg>
      <span className="min-w-0 flex-1 truncate text-sm text-ink">{summary || 'Untitled'}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="shrink-0 rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-red"
        title="Remove"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 3l8 8M11 3l-8 8" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="border-b border-line last:border-b-0">
      <Collapsible
        open={open}
        onToggle={() => {
          setOpen(!open);
        }}
        header={header}
      >
        <div className="pb-3 pl-5">{children}</div>
      </Collapsible>
    </div>
  );
}
