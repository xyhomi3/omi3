'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
// import { usePathname } from "next/navigation";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  //   const pathname = usePathname();
  // const isDarkPath = pathname.includes("docs")");
  // const theme = isDarkPath ? "dark" : undefined;

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
