import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  error?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CustomSelect({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("w-full space-y-1 relative", className)} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-xl border border-brand-border !bg-brand-surface px-4 py-2 text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary',
            error ? 'border-red-500' : 'hover:border-brand-primary/50',
            disabled && 'opacity-50 cursor-not-allowed',
            !selectedOption ? 'text-gray-500' : 'text-brand-text'
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn("h-4 w-4 text-brand-muted transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-brand-border/50 bg-brand-surface shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto overflow-x-hidden p-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors text-left",
                  option.value === value 
                    ? "bg-brand-primary/10 text-brand-primary font-medium" 
                    : "text-brand-text hover:bg-brand-border/30 hover:text-white"
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && <Check className="h-4 w-4" />}
              </button>
            ))}
            {options.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-gray-500">
                No options available
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
}
