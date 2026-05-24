'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/shop', label: 'Shop' },
    { href: '/laptop', label: 'Laptop' },
    { href: '/pad', label: 'Pad' },
    { href: '/phone', label: 'Phone' },
    { href: '/proofs', label: 'Transactions' },
    { href: '/how-to-order', label: 'How to Order' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 -mr-2 text-apple-slate hover:bg-black/5 rounded-full transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 top-14 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 bg-white shadow-xl z-50 border-b border-black/5 animate-in slide-in-from-top-2 duration-200 p-4 rounded-b-3xl">
            <nav className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    pathname === link.href 
                      ? 'bg-apple-blue/10 text-apple-blue' 
                      : 'text-apple-slate hover:bg-apple-bg'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
