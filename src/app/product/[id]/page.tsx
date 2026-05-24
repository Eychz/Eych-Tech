import { ProductService } from '@/services/product.service';
import { notFound } from 'next/navigation';
import { ProductImageGallery } from '@/components/store/ProductImageGallery';
import { NegotiateButton } from '@/components/store/NegotiateButton';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Battery, HardDrive, Smartphone } from 'lucide-react';

type PageProps = {
  params: { id: string };
};

export default async function ProductDetailPage({ params }: PageProps) {
  // In Next.js 15+, params is a Promise that needs to be awaited
  const { id } = await params;

  // Extract the real CUID from the end of the slug (e.g. iphone-14-pro-brand-new-[id])
  const actualId = id.split('-').pop() as string;
  const product = await ProductService.getProductById(actualId);

  if (!product) {
    notFound();
  }

  const isAvailable = product.availability === 'AVAILABLE';
  const isPending = product.availability === 'PENDING';
  const showNegotiate = isAvailable || isPending;

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-apple-gray hover:text-apple-slate mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </Link>

        <div className="bg-white rounded-[2rem] shadow-sm border border-black/[0.04] p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left: Image Gallery */}
            <div>
              <ProductImageGallery images={product.images} title={product.title} />
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${isAvailable ? 'bg-green-50 text-green-700 border-green-200' :
                  isPending ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                  {product.availability}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-apple-bg text-apple-gray border border-black/5">
                  {product.condition}
                </span>
              </div>

              {/* Title & Price */}
              <h1 className="text-3xl md:text-4xl font-bold text-apple-slate mb-2">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-lg text-apple-gray mb-6">{product.subtitle}</p>
              )}

              <div className="text-4xl font-semibold text-apple-slate mb-8">
                ₱{Number(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </div>

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-apple-slate mb-3">About this item</h3>
                <p className="text-apple-gray leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.storage && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-apple-bg border border-black/5">
                    <HardDrive className="w-6 h-6 text-apple-blue" />
                    <div>
                      <div className="text-xs text-apple-gray font-medium">Storage</div>
                      <div className="font-semibold text-apple-slate">{product.storage}</div>
                    </div>
                  </div>
                )}
                {product.batteryHealth && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-apple-bg border border-black/5">
                    <Battery className="w-6 h-6 text-green-500" />
                    <div>
                      <div className="text-xs text-apple-gray font-medium">Battery Health</div>
                      <div className="font-semibold text-apple-slate">{product.batteryHealth}</div>
                    </div>
                  </div>
                )}
                {product.variant && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-apple-bg border border-black/5">
                    <Smartphone className="w-6 h-6 text-apple-blue" />
                    <div>
                      <div className="text-xs text-apple-gray font-medium">Variant</div>
                      <div className="font-semibold text-apple-slate">{product.variant}</div>
                    </div>
                  </div>
                )}
              </div>


              {/* Negotiate CTA */}
              <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-apple-slate mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Open for swap
                  </div>
                  <div className="flex items-center gap-2 text-sm text-apple-slate">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Ready for Shipment process
                  </div>
                </div>

                {showNegotiate && (
                  <NegotiateButton productId={product.id} />
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
