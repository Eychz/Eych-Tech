'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function FloatingChatHead() {
  const pathname = usePathname();

  // Don't show the floating chat head if we are already on the messages page or in admin
  if (pathname?.startsWith('/messages') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <Link
      href="/messages"
      className="fixed bottom-6 right-6 w-14 h-14 bg-apple-blue text-white rounded-full shadow-xl flex items-center justify-center hover:bg-apple-blue-hover hover:scale-105 active:scale-95 transition-all z-50 group"
      aria-label="Open Chat"
    >
      <MessageCircle className="w-7 h-7" />
      {/* Optional Notification Dot */}
      <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full hidden"></span>
    </Link>
  );
}
