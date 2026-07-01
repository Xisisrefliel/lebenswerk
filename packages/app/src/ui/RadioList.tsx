interface RadioListProps<T extends string> {
  layout?: 'horizontal' | 'vertical';
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function RadioList<T extends string>({
  layout = 'vertical',
  options,
  value,
  onChange,
}: RadioListProps<T>) {
  const isHorizontal = layout === 'horizontal';

  return (
    <div
      role="radiogroup"
      className={`flex border border-line ${isHorizontal ? 'flex-row' : 'flex-col'}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              onChange(option.value);
            }}
            className={`flex min-h-9 items-center gap-2 px-2.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/60 ${
              isHorizontal
                ? 'flex-1 border-r border-line last:border-r-0'
                : 'w-full border-b border-line last:border-b-0'
            } ${
              selected
                ? 'bg-white/[0.065] text-ink'
                : 'bg-white/[0.018] text-muted hover:bg-white/[0.045] hover:text-ink'
            }`}
          >
            <span
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
                selected ? 'border-ink' : 'border-muted/60'
              }`}
            >
              {selected && <span className="h-1.5 w-1.5 bg-ink" />}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
