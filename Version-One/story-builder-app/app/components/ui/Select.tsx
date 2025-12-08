'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-purple-900">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between glass rounded-xl border border-white/30',
            'px-4 h-11 text-base transition-all duration-300',
            'hover:border-purple-400 focus:outline-none focus:border-purple-400 focus:shadow-glow',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-400',
            className
          )}
        >
          <span className="flex items-center gap-2">
            {selectedOption?.icon}
            <span className={selectedOption ? 'text-purple-900' : 'text-purple-400/50'}>
              {selectedOption?.label || placeholder}
            </span>
          </span>
          <ChevronDown
            className={cn(
              'h-5 w-5 text-purple-400 transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 glass rounded-xl border border-white/30 shadow-magic overflow-hidden animate-slide-down">
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 px-4 py-3 text-left transition-colors',
                      'hover:bg-purple-100/50',
                      option.value === value && 'bg-purple-100/70 font-semibold'
                    )}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 animate-slide-up">{error}</p>
      )}
    </div>
  );
};

export { Select };