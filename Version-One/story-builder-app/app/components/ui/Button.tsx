'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95',
  {
    variants: {
      variant: {
        magic: 'btn-magic text-white shadow-lg hover:shadow-magic',
        glass: 'glass hover:bg-white/30 text-purple-900 hover:shadow-glow',
        glassDark: 'glass-dark hover:bg-white/20 text-white hover:shadow-glow',
        outline: 'border-2 border-purple-400 text-purple-600 hover:bg-purple-50 hover:border-purple-500',
        ghost: 'hover:bg-purple-100 text-purple-600 hover:text-purple-700',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg',
        success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg',
        sparkle: 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white shadow-lg hover:shadow-glow sparkle',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-11 w-11',
        iconSm: 'h-9 w-9',
      },
      rounded: {
        default: 'rounded-xl',
        full: 'rounded-full',
        lg: 'rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'magic',
      size: 'md',
      rounded: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      isLoading,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };