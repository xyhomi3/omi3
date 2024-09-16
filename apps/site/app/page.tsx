import { routing } from '@/lang';
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
