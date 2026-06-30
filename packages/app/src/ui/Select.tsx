import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: readonly { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...rest }: SelectProps) {
  const select = (
    <div className="relative">
      <select
        className={`w-full appearance-none rounded-md border border-line-strong bg-white/[0.03] py-1.5 pl-2.5 pr-8 text-sm text-ink transition-colors hover:border-white/25 focus:border-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas ${className}`}
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
      <span className="text-xs font-medium text-muted">{label}</span>
      {select}
    </label>
  );
}
