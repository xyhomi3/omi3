'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@omi3/utils';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  loadValue?: number;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, loadValue, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'rounded-base border-border dark:border-darkBorder dark:bg-darkBg relative h-4 w-full overflow-hidden border-2 bg-white',
        className,
      )}
      {...props}
    >
      {loadValue !== undefined && (
        <ProgressPrimitive.Indicator
          className="border-border dark:border-darkBorder absolute inset-0 z-0 h-full w-full flex-1 border-r-2 bg-gray-400 transition-all dark:bg-gray-600"
          style={{ transform: `translateX(-${100 - (loadValue || 0)}%)` }}
        />
      )}
      <ProgressPrimitive.Indicator
        className="border-border bg-main dark:border-darkBorder absolute inset-0 z-10 h-full w-full flex-1 border-r-2 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  ),
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
