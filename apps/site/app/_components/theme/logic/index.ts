'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

export function useThemeLogic() {
  const { theme, setTheme } = useTheme();
  const [mountedTheme, setMountedTheme] = useState<string | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setMountedTheme(theme);
  }, [theme]);

  const getIconClassName = (iconTheme: string) => {
    if (!isMounted) return 'absolute h-[1.2rem] w-[1.2rem] transition-all rotate-90 scale-0';
    const baseClasses = 'absolute h-[1.2rem] w-[1.2rem] transition-all';
    const activeClasses = 'rotate-0 scale-100';
    const inactiveClasses = 'rotate-90 scale-0 fill-text/50 dark:fill-darkText/50';

    const fillClass =
      iconTheme === 'dark' ? 'fill-main/50' : iconTheme === 'light' ? 'fill-main' : 'fill-main dark:fill-main/50';

    return `${baseClasses} ${mountedTheme === iconTheme ? `${activeClasses} ${fillClass}` : inactiveClasses}`;
  };

  return { mountedTheme, setTheme, getIconClassName, isMounted };
}
