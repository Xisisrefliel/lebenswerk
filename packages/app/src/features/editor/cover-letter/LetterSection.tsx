import type { ReactNode } from 'react';

interface LetterSectionProps {
  title: string;
  children: ReactNode;
}

export function LetterSection({ title, children }: LetterSectionProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-line-strong bg-surface p-3.5">
      <h3 className="text-xs font-semibold text-ink">{title}</h3>
      {children}
    </section>
  );
}
