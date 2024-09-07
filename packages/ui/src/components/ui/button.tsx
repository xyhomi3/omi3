import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@omi3/utils';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center text-text justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all focus-visible:outline-none outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 outline-none',
  {
    variants: {
      variant: {
        default:
          'bg-main border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark data-[state=pressed]:translate-x-boxShadowX data-[state=pressed]:translate-y-boxShadowY data-[state=pressed]:shadow-none dark:data-[state=pressed]:shadow-none',
        noShadow: 'bg-white border-2 border-border dark:border-darkBorder',
        link: 'underline-offset-4 text-text dark:text-darkText hover:underline',
        neutral:
          'bg-white dark:bg-darkBg dark:text-darkText border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark data-[state=pressed]:translate-x-boxShadowX data-[state=pressed]:translate-y-boxShadowY data-[state=pressed]:shadow-none dark:data-[state=pressed]:shadow-none',
        outline: 'bg-transparent border-2 text-white border-main',
        ghost: 'border-none text-white',
        second: 'bg-main border-2 text-black border-black',
        destructive:
          'bg-[#ff6b6b] text-white border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark data-[state=pressed]:translate-x-boxShadowX data-[state=pressed]:translate-y-boxShadowY data-[state=pressed]:shadow-none dark:data-[state=pressed]:shadow-none',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  label?: string | null;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      children,
      label,

      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const [pressed, setPressed] = React.useState(false);

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading}
        ref={ref}
        data-state={pressed ? 'pressed' : 'unpressed'}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        onTouchCancel={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
