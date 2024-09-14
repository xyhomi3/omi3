import '@omi3/ui/neobrutalism.css';

import { Footer } from './_components/layout/footer';
import type { Metadata } from 'next';
import { Providers } from './_providers';
import { cn } from '@omi3/utils';
import { silk } from '@omi3/ui';

export const metadata: Metadata = {
  metadataBase: new URL('https://omi3.dev'),
  title: {
    template: '%s - Omi3',
    default: 'Omi3',
  },
  description: 'Omi3',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          silk.variable,
          'font-silk bg-bg dark:bg-darkBg text-text dark:text-darkText flex min-h-full flex-col antialiased',
        )}
      >
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
