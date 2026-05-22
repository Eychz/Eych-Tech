'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getAdminRoomsAction, getMessagesAction, sendMessageAction } from '@/controllers/chat.controller';
import { Send, Loader2, User } from 'lucide-react';

type Room = {
  id: string;
  updatedAt: Date;
  customer: { email: string };
  messages: { text: string, createdAt: Date }[];
};

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: Date;
  sender: { role: 'ADMIN' | 'CUSTOMER' };
};

export function AdminChatDashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Rooms
  const fetchRooms = useCallback(async () => {
    const res = await getAdminRoomsAction();
    if (res.rooms) {
      setRooms(res.rooms as any);
    }
    setLoadingRooms(false);
  }, []);

  // Fetch Messages for active room
  const fetchMessages = useCallback(async () => {
    if (!activeRoomId) return;
    const res = await getMessagesAction(activeRoomId);
    if (res.messages) {
      const fetched = res.messages as Message[];
      
      // Check if there are new messages from the Customer
      setMessages((prev) => {
        if (prev.length > 0 && fetched.length > prev.length) {
          const newMessages = fetched.slice(prev.length);
          const hasReply = newMessages.some(m => m.sender.role !== 'ADMIN');
          
          if (hasReply) {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setMessages(fetched);
            }, 1500); // Show typing animation for 1.5s
            return prev;
          }
        }
        return fetched;
      });
    }
    setLoadingMessages(false);
  }, [activeRoomId]);

  // Global Polling
  useEffect(() => {
    fetchRooms();
    fetchMessages();
    const interval = setInterval(() => {
      fetchRooms();
      fetchMessages();
    }, 5000); // Changed to 5 seconds
    return () => clearInterval(interval);
  }, [fetchRooms, fetchMessages]);

  // Scroll to bottom when new messages arrive or typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  const handleRoomSelect = (roomId: string) => {
    setActiveRoomId(roomId);
    setLoadingMessages(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeRoomId || sending) return;

    const textToSend = input.trim();
    setInput('');
    setSending(true);

    const optimisticMsg: Message = {
      id: Math.random().toString(),
      text: textToSend,
      senderId: 'admin', // placeholder
      createdAt: new Date(),
      sender: { role: 'ADMIN' }
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const res = await sendMessageAction(activeRoomId, textToSend);
    if (res.error) {
      setInput(textToSend);
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      alert(res.error);
    } else {
      fetchMessages();
      fetchRooms();
    }
    
    setSending(false);
  };

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

  if (loadingRooms) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-apple-gray" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Sidebar: Room List */}
      <div className="w-1/3 border-r border-black/5 bg-[#fafafa] flex flex-col h-full">
        <div className="p-4 border-b border-black/5 bg-white">
          <h2 className="font-semibold text-apple-slate">Active Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-6 text-center text-apple-gray text-sm">No active conversations.</div>
          ) : (
            rooms.map(room => (
              <button
                key={room.id}
                onClick={() => handleRoomSelect(room.id)}
                className={`w-full text-left p-4 border-b border-black/5 hover:bg-black/5 transition-colors ${
                  activeRoomId === room.id ? 'bg-apple-blue/5' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-apple-bg flex items-center justify-center text-apple-gray">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 truncate font-medium text-sm text-apple-slate">
                    {room.customer.email}
                  </div>
                </div>
                <div className="pl-11 pr-2 truncate text-xs text-apple-gray">
                  {room.messages?.[0]?.text || 'No messages yet'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Area: Chat Window */}
      <div className="w-2/3 flex flex-col h-full bg-white relative">
        {!activeRoomId ? (
          <div className="h-full flex flex-col items-center justify-center text-apple-gray bg-[#fafafa]">
            <MessageCircleIcon />
            <p className="mt-4">Select a conversation to start messaging</p>
          </div>
        ) : loadingMessages ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-apple-gray" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-black/5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-apple-bg flex items-center justify-center text-apple-gray">
                  <User className="w-4 h-4" />
                </div>
                <div className="font-semibold text-apple-slate text-sm">
                  {rooms.find(r => r.id === activeRoomId)?.customer.email}
                </div>
              </div>
              <div className="bg-yellow-50 text-yellow-800 text-[10px] px-2.5 py-1 rounded-md font-medium border border-yellow-200 text-center sm:text-left">
                Chats inactive for 7 days are automatically deleted to optimize storage.
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fafafa]">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-apple-gray text-sm">
                  No messages yet.
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.sender.role === 'ADMIN';
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          isAdmin 
                            ? 'bg-apple-blue text-white rounded-br-sm' 
                            : 'bg-white border border-black/5 text-apple-slate rounded-bl-sm shadow-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{renderMessageText(msg.text)}</p>
                        <p className={`text-[10px] mt-1 ${isAdmin ? 'text-white/70 text-right' : 'text-apple-gray'}`}>
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

            {/* Input */}
            <div className="p-4 bg-white border-t border-black/5">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-apple-bg px-4 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-apple-slate"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-full bg-apple-blue text-white flex items-center justify-center hover:bg-apple-blue-hover transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MessageCircleIcon() {
  return (
    <svg className="w-16 h-16 text-apple-gray/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
