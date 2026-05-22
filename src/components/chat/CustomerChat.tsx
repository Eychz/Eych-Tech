'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessagesAction, sendMessageAction } from '@/controllers/chat.controller';
import { Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: Date;
  sender: { role: 'ADMIN' | 'CUSTOMER' };
};

export function CustomerChat({
  roomId,
  prefillProduct,
  currentUserId
}: {
  roomId: string;
  prefillProduct: any;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initial Prefill
  useEffect(() => {
    if (prefillProduct && messages.length === 0 && !loading) {
      setInput(`Hi! I'm interested in negotiating for the ${prefillProduct.title} (₱${Number(prefillProduct.price).toFixed(2)}).`);
      // Remove ?product from URL cleanly
      router.replace('/messages', { scroll: false });
    }
  }, [prefillProduct, messages.length, loading, router]);

  const fetchMessages = useCallback(async () => {
    const res = await getMessagesAction(roomId);
    if (res.messages) {
      const fetched = res.messages as Message[];

      // Check if there are new messages from the Admin
      setMessages((prev) => {
        if (prev.length > 0 && fetched.length > prev.length) {
          const newMessages = fetched.slice(prev.length);
          const hasReply = newMessages.some(m => m.senderId !== currentUserId);

          if (hasReply) {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setMessages(fetched);
            }, 1500); // Show typing animation for 1.5s
            return prev; // Don't update state yet, wait for timeout
          }
        }
        return fetched;
      });
    }
    setLoading(false);
  }, [roomId, currentUserId]);

  // Initial Load & Polling
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Scroll to bottom when new messages arrive or when typing indicator appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const textToSend = input.trim();
    setInput(''); // Optimistic clear
    setSending(true);

    // Optimistic UI Update
    const optimisticMsg: Message = {
      id: Math.random().toString(),
      text: textToSend,
      senderId: currentUserId,
      createdAt: new Date(),
      sender: { role: 'CUSTOMER' }
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const res = await sendMessageAction(roomId, textToSend);
    if (res.error) {
      // Revert if error
      setInput(textToSend);
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      alert(res.error);
    } else {
      // Fetch fresh to get exact DB timestamp/id
      fetchMessages();
    }

    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-apple-gray" />
      </div>
    );
  }

  const renderMessageText = (text: string) => {
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

  return (
    <>
      {/* Storage Warning Banner */}
      <div className="bg-yellow-50 text-yellow-800 text-xs px-4 py-2 border-b border-yellow-200 text-center font-medium flex-shrink-0">
        Notice: Chats inactive for 7 days are automatically deleted to optimize storage.
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fafafa]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-apple-gray">
            <p>Send a message to start negotiating.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${isMe
                      ? 'bg-apple-blue text-white rounded-br-sm'
                      : 'bg-white border border-black/5 text-apple-slate rounded-bl-sm shadow-sm'
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{renderMessageText(msg.text)}</p>
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
