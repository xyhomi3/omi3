import * as React from 'react';

import { cn } from '@omi3/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'rounded-base border-border font-base !text-text selection:bg-main focus:border-bg dark:border-darkBorder flex h-10 w-full border-2 bg-[#fffcf7] px-3 py-2 text-sm ring-offset-white transition-all selection:text-black file:border-0 file:bg-[transparent] file:text-sm file:font-medium placeholder:text-secondaryBlack/50 dark:placeholder:text-darkText focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondaryBlack focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-secondaryBlack dark:focus-visible:ring-secondaryWhite',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
