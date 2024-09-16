'use client';

import { Logo, buttonVariants } from '@omi3/ui';

import { LangueSelect } from '../../lang';
import { cn } from '@omi3/utils';

export function Footer() {
  return (
    <footer
      className="border-t-border dark:border-t-darkBorder bg-secondaryWhite dark:bg-secondaryBlack z-50 flex items-center justify-between gap-1 border-t-2 p-3"
      tabIndex={-1}
    >
      <a
        className={cn(buttonVariants({ variant: 'noShadow', size: 'icon' }), 'text-text dark:text-darkText')}
        href="https://github.com/xyhomi3/omi3"
        target="_blank"
      >
        <Logo.Github />
      </a>
      <LangueSelect />
    </footer>
  );
}
