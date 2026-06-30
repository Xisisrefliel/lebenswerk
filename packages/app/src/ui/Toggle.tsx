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
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200 ${
          checked ? 'border-white/20 bg-accent' : 'border-line-strong bg-white/[0.06]'
        } ${disabled ? '' : 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200 ${
            checked ? 'translate-x-[1.125rem] bg-black' : 'translate-x-0.5 bg-muted'
          }`}
        />
      </button>
      {label && <span className="text-xs font-medium text-muted">{label}</span>}
    </label>
  );
}
