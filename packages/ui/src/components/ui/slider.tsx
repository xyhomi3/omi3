'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@omi3/utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbProps?: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, thumbProps, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className="border-border dark:border-darkBorder bg-bg dark:bg-secondaryBlack relative h-3 w-full grow overflow-hidden rounded-full border-2">
        <SliderPrimitive.Range className="bg-main absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          'border-border dark:border-darkBorder bg-bg dark:bg-darkBg block h-5 w-5 rounded-full border-2 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          thumbProps?.className,
        )}
        {...thumbProps}
      />
    </SliderPrimitive.Root>
  ),
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
