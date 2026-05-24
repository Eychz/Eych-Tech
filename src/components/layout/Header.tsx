import Link from 'next/link';
import Image from 'next/image';
import { verifySession } from '@/lib/session';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { SearchBar } from '@/components/layout/SearchBar';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { GadgetDropdown } from '@/components/layout/GadgetDropdown';

export async function Header() {
  const session = await verifySession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass h-14 flex items-center justify-center px-4 md:px-8">
      <div className="w-full max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/Logo.JPEG" 
              alt="Eych Tech Logo" 
              width={32} 
              height={32} 
              className="rounded-full object-cover w-8 h-8 group-hover:opacity-80 transition-opacity" 
            />
            <span className="text-apple-slate font-bold tracking-tight text-xl">
              Eych Tech
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium tracking-wide">
            <Link href="/shop" className="text-apple-slate hover:text-apple-blue transition-colors">Shop</Link>
            <GadgetDropdown />
            <Link href="/proofs" className="text-apple-slate hover:text-apple-blue transition-colors">Transactions</Link>
            <Link href="/how-to-order" className="text-apple-slate hover:text-apple-blue transition-colors">How to Order</Link>
            <Link href="/sell-gadget" className="text-apple-slate hover:text-apple-blue transition-colors">Sell my Gadget</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar />
          {session?.role === 'ADMIN' && (
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-apple-blue hover:text-apple-blue-hover transition-colors text-xs font-medium">
                Admin Dashboard
              </Link>
              <LogoutButton />
            </div>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
