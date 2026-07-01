import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const inputBase =
  'min-h-8 border border-line-strong bg-white/[0.025] px-2.5 py-1.5 text-sm leading-5 text-ink placeholder:text-muted/65 transition-colors hover:border-white/25 focus:border-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/45 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50';
const labelBase = 'text-xs font-medium text-muted';

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
