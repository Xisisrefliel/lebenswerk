import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

const variantClasses: Record<ButtonProps['variant'], string> = {
  secondary: 'border border-line-strong bg-surface text-ink hover:border-accent',
  ghost: 'text-muted hover:text-ink',
  danger: 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-black',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2 py-1',
};

export function Button({ variant, size = 'md', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1 font-medium uppercase tracking-wider transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
