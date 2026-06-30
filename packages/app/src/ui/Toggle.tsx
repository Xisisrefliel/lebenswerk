interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label
      className={`inline-flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => {
          onChange(!checked);
        }}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center border border-line-strong transition-colors ${
          checked ? 'bg-accent' : 'bg-surface'
        } ${disabled ? '' : 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0'}`}
      >
        <span
          className={`inline-block h-3 w-3 bg-ink transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
      )}
    </label>
  );
}
