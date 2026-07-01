interface ToggleGroupProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>({ options, value, onChange }: ToggleGroupProps<T>) {
  return (
    <div className="inline-flex max-w-full flex-wrap items-center gap-0.5 border border-line-strong bg-white/[0.025] p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => {
            onChange(opt.value);
          }}
          className={`h-7 whitespace-nowrap px-2.5 text-xs font-medium leading-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/65 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
            value === opt.value
              ? 'bg-white/[0.09] text-ink shadow-sm'
              : 'text-muted hover:bg-white/[0.045] hover:text-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
