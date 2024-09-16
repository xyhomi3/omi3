'use client';

import { Button } from '@omi3/ui';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  error: Error;
  reset(): void;
};

export default function Error({ error, reset }: Props) {
  const t = useTranslations('Pages.error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-dvh flex-col items-center justify-center p-5">
      {t.rich('description', {
        p: (chunks) => <p className="mt-4">{chunks}</p>,
        retry: (chunks) => <Button onClick={reset}>{chunks}</Button>,
      })}
    </main>
  );
}
