import ratio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import radix from 'tailwindcss-radix';

type ThemeConfig = NonNullable<Config['theme']>;
type StyleConfig = Partial<ThemeConfig>;

const baseConfig: Omit<Config, 'content'> = {
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      borderRadius: {
        base: '5px'
      },
      boxShadow: {
        light: '4px 4px 0px 0px #000',
        dark: '4px 4px 0px 0px #000',
      },
      translate: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
      fontFamily: {
        silk: ['var(--font-silk)'],
        montserrat: 'var(--font-montserrat)',
      },
    },
  } as ThemeConfig,
  future: { hoverOnlyWhenSupported: true },
  plugins: [radix, forms, typography, animate, ratio],
};

const styles: Record<'neobrutalism' | 'shadcn', StyleConfig> = {
  neobrutalism: {
    colors: {
      main: '#A3E636',
      overlay: 'rgba(0,0,0,0.8)',

      // light mode
      bg: '#E0E7F1',
      text: '#000',
      border: '#000',

      // dark mode
      darkBg: '#111903',
      darkText: '#eeefe9',
      darkBorder: '#000',
      secondaryBlack: '#1b1b1b', // opposite of plain white, not used pitch black because borders and box-shadows are that color
    }
  },
  shadcn: {
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
    },
  },
};

const createTailwindConfig = (styleType: keyof typeof styles, content: string[]): Config => ({
  content,
  ...baseConfig,
  theme: {
    ...baseConfig.theme,
    ...styles[styleType],
    extend: {
      ...baseConfig.theme?.extend,
      ...styles[styleType].extend,
    },
  },
});

export default createTailwindConfig;
