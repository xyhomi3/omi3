'use client';

import {
  Badge,
  Icons,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@omi3/ui';
import React, { useCallback } from 'react';
import { usePathname, useRouter } from '@/lang/router';

import { Locale } from '@/lang';
import { useParams } from 'next/navigation';

interface LocaleProps {
  code: Locale;
  name: string;
}

const LOCALES: LocaleProps[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
];

function LangueSelect() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = useCallback(
    (lang: Locale) => {
      router.push(pathname, { locale: lang });
    },
    [pathname, router],
  );

  const selectedLocale = LOCALES.find((locale) => locale.code === params.locale);

  return (
    <Select value={params.locale as string} onValueChange={handleLanguageChange}>
      <SelectTrigger className="relative w-[5.5rem]" aria-label="Languages">
        <Badge className="absolute -right-3 -top-4 font-normal">beta</Badge>
        <div className="flex w-full items-center justify-between">
          <Icons.Languages className="size-5 animate-pulse" />
          <SelectValue>{selectedLocale?.code.toUpperCase()}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="flex flex-col items-center gap-2">
          <SelectLabel>
            <Icons.Languages className="size-5" />
            Langues
          </SelectLabel>
          {LOCALES.map(({ code, name }) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default React.memo(LangueSelect);
