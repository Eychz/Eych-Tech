import { AdminChatDashboard } from '@/components/chat/AdminChatDashboard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminMessagesPage() {
  return (
    <div className="p-6 h-[calc(100vh-64px)]">
      <Link 
        href="/admin" 
        className="inline-flex items-center gap-2 text-apple-gray hover:text-apple-slate mb-6 transition-colors font-medium self-start"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-apple-slate">Live Chat Dashboard</h1>
        <p className="text-apple-gray text-sm">Negotiate directly with customers in real-time.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-black/5 h-[calc(100%-80px)] overflow-hidden">
        <AdminChatDashboard />
      </div>
    </div>
  );
}
