import localFont from 'next/font/local';

export const silk = localFont({
  src: [
    {
      path: './silkscreen-regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-silk',
});

export const montserrat = localFont({
  src: './montserrat-variable.ttf',
  style: 'normal',
  variable: '--font-montserrat',
});
