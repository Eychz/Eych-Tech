'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessagesAction, sendMessageAction } from '@/controllers/chat.controller';
import { Send, Loader2, ExternalLink } from 'lucide-react';
import { getOrCreateGuestId } from '@/lib/guestId';

type Message = {
  id: string;
  text: string;
  guestId: string | null;
  isAdmin: boolean;
  createdAt: Date;
  product?: { id: string; title: string; price: any; images: string[] } | null;
};

const TIKTOK_URL = 'https://www.tiktok.com/@eych.tech';
const FACEBOOK_URL = 'https://facebook.com/GadgetEych';

export function CustomerChat({
  roomId,
  prefillProduct,
}: {
  roomId: string;
  prefillProduct?: { id: string; title: string; price: number; images: string[] } | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [guestId, setGuestId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize guestId on mount
  useEffect(() => {
    const id = getOrCreateGuestId();
    setGuestId(id);
  }, []);

  const sentPrefill = useRef<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!guestId) return;
    const res = await getMessagesAction(roomId, guestId);
    if (res.messages) {
      const fetched = res.messages as Message[];

      setMessages((prev) => {
        if (prev.length > 0 && fetched.length > prev.length) {
          const newMessages = fetched.slice(prev.length);
          const hasReply = newMessages.some(m => m.isAdmin);

          if (hasReply) {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setMessages(fetched);
            }, 1500);
            return prev;
          }
        }
        return fetched;
      });
    }
    setLoading(false);
  }, [roomId, guestId]);

  // Automatically send product inquiry message when product is passed
  useEffect(() => {
    if (!prefillProduct || loading || !guestId) return;

    // Check if the user already inquired about this specific product in the chat history
    const alreadyInquired = messages.some(m => m.product?.id === prefillProduct.id);

    if (!alreadyInquired && sentPrefill.current !== prefillProduct.id) {
      sentPrefill.current = prefillProduct.id;
      const textToSend = "Hi! I'm interested in negotiating for this item.";
      
      const optimisticMsg: Message = {
        id: Math.random().toString(),
        text: textToSend,
        guestId: guestId,
        isAdmin: false,
        createdAt: new Date(),
        product: {
          id: prefillProduct.id,
          title: prefillProduct.title,
          price: prefillProduct.price,
          images: prefillProduct.images
        }
      };
      setMessages(prev => [...prev, optimisticMsg]);
      setSending(true);

      sendMessageAction(roomId, textToSend, guestId, prefillProduct.id).then(res => {
        if (res.error) {
          setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
          sentPrefill.current = null; // Reset so they can try again if it failed
          alert(res.error);
        } else {
          fetchMessages();
        }
        setSending(false);
      });
    }
  }, [prefillProduct, messages, loading, guestId, roomId, fetchMessages]);

  // Initial Load & Polling & Read Status Tracking
  useEffect(() => {
    if (!guestId) return;

    const trackReadStatus = () => {
      localStorage.setItem('customer_chat_last_read', new Date().toISOString());
    };

    fetchMessages();
    trackReadStatus();

    const interval = setInterval(() => {
      fetchMessages();
      trackReadStatus();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [fetchMessages, guestId]);

  // Scroll function to be called manually on input focus
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || !guestId) return;

    const textToSend = input.trim();
    setInput('');
    setSending(true);

    const optimisticMsg: Message = {
      id: Math.random().toString(),
      text: textToSend,
      guestId: guestId,
      isAdmin: false,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const res = await sendMessageAction(roomId, textToSend, guestId);
    if (res.error) {
      setInput(textToSend);
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      alert(res.error);
    } else {
      fetchMessages();
    }

    setSending(false);
  };

  const renderMessageText = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 break-all">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  if (loading && !guestId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-apple-gray" />
      </div>
    );
  }

  return (
    <>
      {/* Cookie / Data Warning Banner */}
      <div className="bg-amber-50 text-amber-900 text-xs px-4 py-3 border-b border-amber-200 flex-shrink-0">
        <p className="font-semibold mb-1">⚠️ Your chat is tied to this browser.</p>
        <p className="text-amber-800 leading-relaxed">
          Clearing your browser data will disconnect you from this conversation. If you'd like to continue the discussion,
          you can also reach us on{' '}
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline inline-flex items-center gap-0.5">
            TikTok <ExternalLink className="w-3 h-3" />
          </a>
          {' '}or{' '}
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline inline-flex items-center gap-0.5">
            Facebook <ExternalLink className="w-3 h-3" />
          </a>
          . Chats inactive for 7 days are automatically deleted.
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fafafa]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-apple-gray" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-apple-gray">
            <p>Send a message to start negotiating.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = !msg.isAdmin;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${isMe
                    ? 'bg-apple-blue text-white rounded-br-sm'
                    : 'bg-white border border-black/5 text-apple-slate rounded-bl-sm shadow-sm'
                    }`}
                >
                  {msg.product && (
                    <a href={`/product/${msg.product.id}`} target="_blank" rel="noopener noreferrer" className="block mb-3 bg-white text-apple-slate rounded-lg overflow-hidden border border-black/10 hover:shadow-md transition-shadow max-w-[240px]">
                      {msg.product.images?.[0] && (
                        <div className="w-full h-32 bg-apple-bg relative">
                          <img src={msg.product.images[0]} alt={msg.product.title} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div className="p-3">
                        <div className="font-semibold text-sm truncate">{msg.product.title}</div>
                        <div className="text-apple-blue font-medium text-xs mt-1">
                          ₱{Number(msg.product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </a>
                  )}
                  {msg.text && <p className="text-sm whitespace-pre-wrap">{renderMessageText(msg.text)}</p>}
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-white/70 text-right' : 'text-apple-gray'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-black/5 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center shadow-sm h-11">
              <div className="w-2 h-2 bg-apple-gray/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-apple-gray/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-apple-gray/50 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-black/5">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={scrollToBottom}
            placeholder="Type your message..."
            className="flex-1 bg-apple-bg px-4 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-apple-slate"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-full bg-apple-blue text-white flex items-center justify-center hover:bg-apple-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </>
  );
}
