import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none active:scale-95 whitespace-nowrap',
          {
            'bg-brand-primary text-black hover:bg-brand-hover hover:text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]': variant === 'primary',
            'bg-brand-surface text-brand-text hover:bg-brand-border border border-brand-border': variant === 'secondary',
            'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20': variant === 'danger',
            'hover:bg-brand-surface text-brand-text': variant === 'ghost',
            'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-black': variant === 'outline',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-6 py-2': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
