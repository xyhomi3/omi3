import { ReactNode } from 'react';
import { StoreProvider } from './store';
import { ThemeProvider } from './theme';

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <StoreProvider>{children}</StoreProvider>
    </ThemeProvider>
  );
}
