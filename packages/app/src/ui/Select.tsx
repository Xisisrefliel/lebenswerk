import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: readonly { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...rest }: SelectProps) {
  const select = (
    <div className="relative">
      <select
        className={`w-full appearance-none border border-line-strong bg-surface py-1 pl-2 pr-8 text-sm text-ink focus:border-accent focus:outline-none ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </div>
  );

  if (!label) return select;

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
      {select}
    </label>
  );
}
