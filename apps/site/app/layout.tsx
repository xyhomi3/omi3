import '@omi3/ui/neobrutalism.css';

import { Footer } from './_components/layout/footer';
import type { Metadata } from 'next';
import { cn } from '@omi3/utils';
import { silk } from '@omi3/ui';

export const metadata: Metadata = {
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
    <html lang="en" className="h-full">
      <body className={cn(silk.variable, 'font-silk flex min-h-full flex-col antialiased')}>
        <main className="flex flex-grow items-center justify-center p-5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
