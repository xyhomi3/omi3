const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'omi3.dev';
export const APP_NAME: string = 'Omi3';
export const isProd = process.env.NODE_ENV === 'production';

export const MAIN_URL: string = isProd ? `https://${mainDomain}` : 'http://localhost:3000';
