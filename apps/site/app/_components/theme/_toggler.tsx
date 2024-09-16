'use client';

import { Button, Icons, Skeleton, useMounted } from '@omi3/ui';

import { useTheme } from 'next-themes';

const themeOptions = [
  { name: 'dark', Icon: Icons.Moon, label: 'Mode sombre' },
  { name: 'light', Icon: Icons.Sun, label: 'Mode clair' },
  { name: 'system', Icon: Icons.Monitor, label: 'Système' },
] as const;

export function ThemeToggler() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <div className="flex space-x-2" aria-hidden="true">
        {themeOptions.map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-2" role="group" aria-label="Sélection du thème">
      {themeOptions.map(({ name, Icon, label }) => {
        const isActive = theme === name;
        return (
          <Button
            key={name}
            className={`p-0 transition-colors duration-200 ${isActive && 'dark:bg-main bg-bg'}`}
            size="icon"
            variant={isActive ? 'noShadow' : 'neutral'}
            onClick={() => setTheme(name)}
            title={label}
          >
            <Icon
              className={`h-5 w-5 ${isActive ? 'fill-main dark:fill-white' : 'fill-text/50 dark:fill-darkText/50'}`}
              aria-hidden="true"
            />
            <span className="sr-only">{label}</span>
          </Button>
        );
      })}
    </div>
  );
}
