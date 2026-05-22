import { ProductService } from '@/services/product.service';
import { ProductCard } from '@/components/store/ProductCard';
import { Package } from 'lucide-react';

export default async function PadPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const sp = await searchParams;
  const products = await ProductService.getStoreProducts('PAD', sp.q);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-apple-slate mb-4">Pads</h1>
        <p className="text-lg text-apple-gray max-w-2xl mx-auto">Unbelievably thin. Incredibly powerful.</p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-apple-gray">
          <Package className="w-16 h-16 opacity-20 mb-4" />
          <p className="text-lg">No pads available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
