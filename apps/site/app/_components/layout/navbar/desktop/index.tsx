"use client"

import { Link, PathnameKey, usePathname } from '@/lang';

import { cn } from '@omi3/utils';
import { useTranslations } from 'next-intl';

export function Desktop() {
  const pathname = usePathname();
  const t = useTranslations('Components.navbar');
  const navItems: { href: PathnameKey; label: string }[] = [{ href: '/', label: t('items.home') }];

  return (
    <ul className="hidden items-center space-x-5 md:flex">
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              'dark:hover:text-main/75 hover:text-text/75 text-sm transition-colors',
              pathname === item.href && 'dark:text-main text-text font-semibold',
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
