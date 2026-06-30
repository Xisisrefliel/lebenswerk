import type { ReactNode } from 'react';

interface CollapsibleProps {
  open: boolean;
  onToggle: () => void;
  header: ReactNode;
  children: ReactNode;
}

export function Collapsible({ open, onToggle, header, children }: CollapsibleProps) {
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="cursor-pointer"
      >
        {header}
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
