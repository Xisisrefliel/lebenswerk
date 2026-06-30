interface ToggleGroupProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>({ options, value, onChange }: ToggleGroupProps<T>) {
  return (
    <div className="inline-flex max-w-full flex-wrap items-center gap-0.5 rounded-lg border border-line-strong bg-white/[0.03] p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => {
            onChange(opt.value);
          }}
          className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
            value === opt.value
              ? 'bg-white/[0.1] text-ink shadow-sm'
              : 'text-muted hover:text-ink hover:bg-white/[0.04]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
