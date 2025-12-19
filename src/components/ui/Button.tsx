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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
      const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-transparent',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-transparent',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border-transparent',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent',
        outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
      };
      
      const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
      };

      return (
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
            variants[variant],
            sizes[size],
            className
          )}
          {...props}
        />
      );
    }
);
Button.displayName = 'Button';
