import * as React from 'react';

import { cn } from '@omi3/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-base border-2 border-border bg-[#fffcf7] px-3 py-2 text-sm font-base !text-text ring-offset-white transition-all selection:bg-main selection:text-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-700 focus:border-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-darkBorder dark:ring-offset-black dark:focus-visible:ring-white',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
