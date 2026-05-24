import { CustomerChat } from '@/components/chat/CustomerChat';
import { ProductService } from '@/services/product.service';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GuestChatLoader } from '@/components/chat/GuestChatLoader';

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  // Admins should use the admin dashboard for chatting
  // (Admin layout handles auth — if admin visits /messages it still works but they see guest chat)

  const sp = await searchParams;
  let prefillProduct = null;

  if (sp.product) {
    const p = await ProductService.getProductById(sp.product);
    if (p) {
      prefillProduct = {
        title: p.title,
        price: Number(p.price),
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
        <p className="text-apple-gray text-sm">We typically reply within a few minutes. If you don&apos;t see a reply, we may be offline.</p>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-black/5 overflow-hidden flex flex-col min-h-[500px]">
        {/* GuestChatLoader handles guestId on client side, then renders CustomerChat */}
        <GuestChatLoader prefillProduct={prefillProduct} />
      </div>
    </div>
  );
}
