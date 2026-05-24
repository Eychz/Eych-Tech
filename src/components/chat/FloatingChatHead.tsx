'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { checkUnreadMessagesAction } from '@/controllers/chat.controller';
import { getOrCreateGuestId } from '@/lib/guestId';

export function FloatingChatHead() {
  const pathname = usePathname();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // If we're on the messages page or admin page, don't poll
    if (pathname?.startsWith('/messages') || pathname?.startsWith('/admin')) {
      return;
    }

    const checkUnread = async () => {
      try {
        const guestId = getOrCreateGuestId();
        const lastRead = localStorage.getItem('customer_chat_last_read') || new Date(0).toISOString();
        const res = await checkUnreadMessagesAction(lastRead, guestId);
        if (res && res.hasUnread !== undefined) {
          setHasUnread(res.hasUnread);
        }
      } catch (err) {
        // fail silently
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [pathname]);

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
      {/* Notification Dot */}
      {hasUnread && (
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white"></span>
        </span>
      )}
    </Link>
  );
}
