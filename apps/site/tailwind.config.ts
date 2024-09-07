import createTailwindConfig from '@omi3/tailwind';

const config = createTailwindConfig('neobrutalism', [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
]);

export default config;
