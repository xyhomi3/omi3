import '@omi3/ui/neobrutalism.css';

import { silk } from '@omi3/ui';
import { cn } from '@omi3/utils';
import type { Metadata } from 'next';
import { Footer } from './_components/layout/footer';
import { Providers } from './_providers';

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
          <main className="flex flex-grow items-center justify-center p-5" tabIndex={-1} role="main">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
