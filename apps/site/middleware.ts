import { NextRequest, NextResponse } from 'next/server';

import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lang';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  try {
    const response = intlMiddleware(request);
    return response;
  } catch (error) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
