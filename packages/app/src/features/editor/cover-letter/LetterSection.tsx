import type { ReactNode } from 'react';

interface LetterSectionProps {
  title: string;
  children: ReactNode;
}

export function LetterSection({ title, children }: LetterSectionProps) {
  return (
    <section className="border-b border-line bg-surface/20 last:border-b-0">
      <div className="flex min-h-12 items-center px-3 py-2.5">
        <h3 className="min-w-0 truncate text-sm font-medium text-ink">{title}</h3>
      </div>
      <div className="flex flex-col gap-3 border-t border-line bg-canvas/80 p-4">{children}</div>
    </section>
  );
}
