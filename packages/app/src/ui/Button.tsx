import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

const variantClasses: Record<ButtonProps['variant'], string> = {
  primary:
    'bg-accent text-black hover:bg-white/90 active:bg-white/80 shadow-sm',
  secondary:
    'border border-line-strong bg-white/[0.03] text-ink hover:bg-white/[0.07] hover:border-white/25',
  ghost: 'text-muted hover:text-ink hover:bg-white/[0.06]',
  danger:
    'border border-red/40 text-red hover:bg-red hover:text-white hover:border-red',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-2.5 py-1 rounded-md',
  md: 'text-xs px-3 py-1.5 rounded-md',
};

export function Button({ variant, size = 'md', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
