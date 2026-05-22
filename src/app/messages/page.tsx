import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getOrCreateRoomAction } from '@/controllers/chat.controller';
import { CustomerChat } from '@/components/chat/CustomerChat';
import { ProductService } from '@/services/product.service';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  const session = await verifySession();

  if (!session || !session.userId) {
    redirect('/login?redirect=/messages');
  }

  // Admins should use the admin dashboard for chatting
  if (session.role === 'ADMIN') {
    redirect('/admin/messages');
  }

  const { roomId, error } = await getOrCreateRoomAction();

  if (error || !roomId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-apple-gray">Error loading chat room: {error}</p>
      </div>
    );
  }

  // Await searchParams in Next 15
  const sp = await searchParams;
  let prefillProduct = null;

  if (sp.product) {
    const p = await ProductService.getProductById(sp.product);
    if (p) {
      prefillProduct = {
        ...p,
        price: Number(p.price),
        slug: `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${p.id}`
      };
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-apple-gray hover:text-apple-slate mb-6 transition-colors font-medium self-start"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Shop
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-apple-slate">Eych Tech</h1>
        <p className="text-apple-gray text-sm">We typically reply within a few minutes. If you don't see a reply, we may be offline. We will get back to you as soon as possible.</p>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-black/5 overflow-hidden flex flex-col min-h-[500px]">
        <CustomerChat roomId={roomId} prefillProduct={prefillProduct} currentUserId={session.userId} />
      </div>
    </div>
  );
}
