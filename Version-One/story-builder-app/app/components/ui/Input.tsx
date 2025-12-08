'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const inputVariants = cva(
  'flex w-full transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-400/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        glass: 'glass border-white/30 focus:border-purple-400 focus:shadow-glow',
        glassDark: 'glass-dark border-white/20 focus:border-purple-300 text-white',
        outline: 'bg-white/50 border-2 border-purple-300 focus:border-purple-500',
        magic: 'glass border-2 border-transparent focus:border-purple-400 focus:shadow-magic',
      },
      inputSize: {
        sm: 'h-9 px-3 text-sm rounded-lg',
        md: 'h-11 px-4 text-base rounded-xl',
        lg: 'h-14 px-6 text-lg rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'glass',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      type = 'text',
      label,
      error,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-purple-900">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, inputSize }),
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              error && 'border-red-400 focus:border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 animate-slide-up">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };