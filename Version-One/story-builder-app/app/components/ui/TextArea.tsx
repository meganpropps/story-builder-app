'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      maxLength,
      showCount = false,
      value,
      ...props
    },
    ref
  ) => {
    const currentLength = value?.toString().length || 0;

    return (
      <div className="w-full space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-purple-900">
              {label}
            </label>
            {showCount && maxLength && (
              <span className="text-xs text-purple-500">
                {currentLength} / {maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          className={cn(
            'flex min-h-[120px] w-full glass rounded-xl border border-white/30 px-4 py-3',
            'text-base placeholder:text-purple-400/50',
            'focus-visible:outline-none focus-visible:border-purple-400 focus-visible:shadow-glow',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-300 custom-scrollbar',
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 animate-slide-up">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };