interface ToggleGroupProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>({ options, value, onChange }: ToggleGroupProps<T>) {
  return (
    <div className="inline-flex border border-line-strong bg-surface">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => {
            onChange(opt.value);
          }}
          className={`border-r border-line-strong px-2.5 py-1 text-xs font-medium uppercase tracking-wider transition-colors last:border-r-0 ${
            value === opt.value ? 'bg-accent text-black' : 'text-muted hover:text-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
