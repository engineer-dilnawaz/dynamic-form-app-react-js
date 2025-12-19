import { type SelectHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

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
        <div className="relative">
            <select
            ref={ref}
            className={cn(
                'flex h-12 w-full appearance-none rounded-xl border border-brand-border bg-brand-input px-4 py-2 pr-10 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all duration-200',
                error && 'border-red-500 focus:ring-red-500',
                className
            )}
            {...props}
            >
            {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-muted">
                <ChevronDown className="h-4 w-4" />
            </div>
        </div>
        
        {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
