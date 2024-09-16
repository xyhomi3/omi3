import { Desktop } from './desktop';
import { Link } from '@/lang';
import { Mobile } from './mobile';
import { ThemeWidget } from '../../theme';

export function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full px-5">
      <div className="rounded-base border-border bg-secondaryWhite dark:border-darkBorder dark:bg-secondaryBlack z-50 mx-auto mt-5 flex w-full max-w-screen-md items-center justify-between border-2 p-3">
        <Link href="/" className="flex items-center text-xl font-semibold">
          Omi<span className="dark:text-main text-[#e63650]">3</span>
        </Link>

        <div className="flex items-center space-x-5">
          <Desktop />
          <div className="flex items-center gap-3">
            <ThemeWidget />
            <Mobile />
          </div>
        </div>
      </div>
    </nav>
  );
}
