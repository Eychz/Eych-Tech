import Image from 'next/image';
import Link from 'next/link';
import { NegotiateButton } from './NegotiateButton';

type ProductCardProps = {
  product: any;
};

export function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.availability === 'AVAILABLE';
  const isPending = product.availability === 'PENDING';
  const isSold = product.availability === 'SOLD';

  const showNegotiate = isAvailable || isPending;

  const slug = `${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${product.id}`;

  return (
    <div className="group block bg-white rounded-[1.5rem] p-4 flex flex-col shadow-sm border border-black/[0.04] transition-transform duration-300 hover:scale-[1.02] hover:shadow-md relative overflow-visible ">

      {/* Availability Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-black/5">
        <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' :
          isPending ? 'bg-yellow-500' :
            'bg-red-500'
          }`} />
        <span className="text-[10px] font-bold tracking-wider uppercase text-apple-slate">
          {product.availability}
        </span>
      </div>

      <Link href={`/product/${slug}`} className="block">
        {/* 4:3 Image Container */}
        <div className="relative w-full aspect-[4/3] bg-apple-bg rounded-2xl mb-6 overflow-hidden">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-apple-gray">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 px-2">
        <Link href={`/product/${slug}`}>
          <h3 className="text-xl font-semibold mb-1 text-apple-slate hover:text-apple-blue transition-colors">{product.title}</h3>
        </Link>
        {product.subtitle && (
          <p className="text-sm text-apple-gray mb-3">{product.subtitle}</p>
        )}

        <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-apple-gray uppercase tracking-wider mb-0.5">{product.condition}</p>
            <p className="font-semibold text-apple-slate text-lg">
              ₱{Number(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {showNegotiate && <NegotiateButton productId={product.id} />}

            <Link
              href={`/product/${slug}`}
              className="bg-apple-bg text-apple-slate px-4 py-2 rounded-full text-sm font-medium hover:bg-apple-slate hover:text-white transition-colors text-center"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
