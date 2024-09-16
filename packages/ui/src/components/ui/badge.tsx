import { cva, type VariantProps } from 'class-variance-authority';

import * as React from 'react';

import { cn } from '@omi3/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-base border-2 text-text border-border dark:border-darkBorder px-2.5 font-base py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-border dark:focus:ring-darkBorder focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-main',
        neutral: 'bg-white dark:bg-darkBg dark:text-darkText',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
