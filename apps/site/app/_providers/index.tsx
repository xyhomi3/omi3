import { ReactNode } from 'react';
import { StoreProvider } from './store';

type Props = {
  children: ReactNode;
};

export async function Providers({ children }: Props) {
  return <StoreProvider>{children}</StoreProvider>;
}
