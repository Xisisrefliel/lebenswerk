import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

const variantClasses: Record<ButtonProps['variant'], string> = {
  primary:
    'border border-transparent bg-accent text-black shadow-sm hover:bg-white/90 active:bg-white/80',
  secondary:
    'border border-line-strong bg-white/[0.025] text-ink hover:border-white/25 hover:bg-white/[0.055]',
  ghost: 'border border-transparent text-muted hover:bg-white/[0.045] hover:text-ink',
  danger:
    'border border-red/35 bg-transparent text-red hover:border-red hover:bg-red hover:text-white',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-7 rounded-[5px] px-2.5 text-xs',
  md: 'h-8 rounded-[5px] px-3 text-xs',
};

export function Button({ variant, size = 'md', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium leading-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/65 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
