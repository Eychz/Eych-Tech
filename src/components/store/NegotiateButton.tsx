'use client';

import { useState } from 'react';
import { MessageCircle, ExternalLink, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type NegotiateButtonProps = {
  productId: string;
  className?: string;
};

export function NegotiateButton({ productId, className }: NegotiateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Social Media Links
  const TIKTOK_URL = 'https://www.tiktok.com/@eych.tech';
  const FACEBOOK_URL = 'https://facebook.com/GadgetEych';

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className || ''}`}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full justify-center bg-apple-blue text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-apple-blue-hover transition-colors flex items-center gap-2 cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">Message</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-2xl shadow-xl border border-black/5 p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between px-3 py-2 mb-1 border-b border-black/5">
              <span className="text-xs font-semibold text-apple-gray uppercase tracking-wider">Message via</span>
              <button onClick={(e) => handleAction(e, () => { })} className="text-apple-gray hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={(e) => handleAction(e, () => router.push(`/messages?product=${productId}`))}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-apple-slate hover:bg-apple-bg rounded-xl transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-apple-blue" />
              Website Chat
            </button>
            <button
              onClick={(e) => handleAction(e, () => window.open(TIKTOK_URL, '_blank'))}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-apple-slate hover:bg-apple-bg rounded-xl transition-colors flex items-center gap-2 mt-1"
            >
              <ExternalLink className="w-4 h-4 text-black" />
              TikTok
            </button>
            <button
              onClick={(e) => handleAction(e, () => window.open(FACEBOOK_URL, '_blank'))}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-apple-slate hover:bg-apple-bg rounded-xl transition-colors flex items-center gap-2 mt-1"
            >
              <ExternalLink className="w-4 h-4 text-blue-600" />
              Facebook
            </button>
          </div>
        </>
      )}
    </div>
  );
}
