"use client"

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icons } from '@omi3/ui';
import { Link, PathnameKey, usePathname } from '@/lang';

import { cn } from '@omi3/utils';
import { useTranslations } from 'next-intl';

export function Mobile() {
  const pathname = usePathname();
  const t = useTranslations('Components.navbar');
  const navItems: { href: PathnameKey; label: string }[] = [{ href: '/', label: t('items.home') }];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant={'noShadow'} className="!bg-main md:hidden">
          <Icons.Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="left-5 right-5 mx-5 mt-5 w-[calc(100vw-2.5rem)] max-w-screen-md p-2">
        <div className="grid grid-cols-2 gap-2">
          {navItems.map((item, index) => (
            <DropdownMenuItem
              key={item.href}
              asChild
              className={cn('p-0', index % 2 === 0 && index === navItems.length - 1 && 'col-span-2')}
            >
              <Link
                href={item.href}
                className={cn(
                  'rounded-base flex h-full w-full items-center justify-center border-2 px-2 py-4 transition-colors',
                  pathname === item.href ? '!bg-main text-text font-semibold' : 'text-text dark:text-darkText',
                )}
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
