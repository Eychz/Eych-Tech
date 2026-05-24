'use client';

import { useState, useEffect } from 'react';
import { CustomerChat } from '@/components/chat/CustomerChat';
import { getOrCreateRoomAction } from '@/controllers/chat.controller';
import { getOrCreateGuestId } from '@/lib/guestId';
import { Loader2 } from 'lucide-react';

type GuestChatLoaderProps = {
  prefillProduct?: { id: string; title: string; price: number; images: string[] } | null;
};

export function GuestChatLoader({ prefillProduct }: GuestChatLoaderProps) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const guestId = getOrCreateGuestId();
      const res = await getOrCreateRoomAction(guestId);
      if (res.error) {
        setError(res.error);
      } else if (res.roomId) {
        setRoomId(res.roomId);
      }
    }
    init();
  }, []);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-apple-gray text-sm">
        <p>Error loading chat: {error}</p>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-apple-gray" />
      </div>
    );
  }

  return <CustomerChat roomId={roomId} prefillProduct={prefillProduct} />;
}
