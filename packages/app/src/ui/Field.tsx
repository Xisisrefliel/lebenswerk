import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const inputBase =
  'border border-line-strong bg-surface px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none';
const labelBase = 'text-xs font-medium uppercase tracking-wider text-muted';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Field({ label, id, className, ...rest }: FieldProps) {
  const inputId = id ?? `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1 text-sm">
      <span className={labelBase}>{label}</span>
      <input id={inputId} className={`${inputBase} ${className ?? ''}`} {...rest} />
    </label>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextAreaField({ label, id, className, rows = 4, ...rest }: TextAreaFieldProps) {
  const inputId = id ?? `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1 text-sm">
      <span className={labelBase}>{label}</span>
      <textarea id={inputId} rows={rows} className={`${inputBase} ${className ?? ''}`} {...rest} />
    </label>
  );
}
