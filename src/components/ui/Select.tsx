import { type SelectHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { label: string; value: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border border-brand-border !bg-brand-surface px-4 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        
        {/* Force options to be dark in case of browser defaults */}
        <style>{`
          select option {
            background-color: #1A2C22;
            color: white;
          }
        `}</style>
        
        {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
