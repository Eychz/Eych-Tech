'use client';

import { useState } from 'react';
import { ProductForm } from './ProductForm';
import { deleteProductAction } from '@/controllers/product.controller';
import { useToast } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AdminDashboardProps = {
  products: any[];
};

export function AdminDashboard({ products }: AdminDashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const result = await deleteProductAction(id);
    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Product deleted successfully');
      router.refresh();
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-apple-slate mb-1">Products</h1>
          <p className="text-apple-gray">Manage your storefront inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/proofs')}
            className="bg-white hover:bg-black/5 text-apple-slate border border-black/10 px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            Transactions
          </button>
          <button
            onClick={() => router.push('/admin/messages')}
            className="bg-white hover:bg-black/5 text-apple-slate border border-black/10 px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Package className="w-4 h-4 hidden" />
            Live Chat
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-apple-blue hover:bg-apple-blue-hover text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-black/[0.04] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/[0.04] bg-apple-bg/50 text-sm font-medium text-apple-gray uppercase tracking-wider">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-apple-gray">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No products found. Add your first product!</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-apple-bg/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-apple-bg" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-apple-bg flex items-center justify-center">
                            <Package className="w-5 h-5 text-apple-gray" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-apple-slate">{product.title}</p>
                          <p className="text-sm text-apple-gray">{product.condition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-apple-slate">
                      ₱{Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-black/5 px-2.5 py-1 rounded-md text-xs font-semibold text-apple-slate">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.availability === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                          product.availability === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {product.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(product)} className="p-2 text-apple-gray hover:text-apple-blue transition-colors rounded-full hover:bg-apple-blue/10">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-apple-gray hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm
          initialData={editingProduct}
          onSuccess={() => {
            closeForm();
            router.refresh();
          }}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
