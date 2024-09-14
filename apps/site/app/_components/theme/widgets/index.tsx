import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Icons,
} from '@omi3/ui';

import { ThemeToggler } from '../_toggler';
import { memo } from 'react';
import { useThemeLogic } from '../logic';

export const ThemeWidget = memo(function ThemeWidget() {
  const { isMounted, getIconClassName } = useThemeLogic();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="neutral"
          data-umami-event="theme-toggle"
          aria-label="Toggle theme"
        >
          {!isMounted ? (
            <Icons.Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Icons.Moon className={getIconClassName('dark')} />
              <Icons.Sun className={getIconClassName('light')} />
              <Icons.Monitor className={getIconClassName('system')} />
            </>
          )}
          <span className="sr-only">Theme Widget</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-3 bg-bg" align="center">
        <ThemeToggler />
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
