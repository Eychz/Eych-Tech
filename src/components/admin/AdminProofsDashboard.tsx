'use client';

import { useState } from 'react';
import { ProofForm } from './ProofForm';
import { deleteProofAction } from '@/controllers/proof.controller';
import { useToast } from '@/components/ui/Toast';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AdminProofsDashboardProps = {
  proofs: any[];
};

export function AdminProofsDashboard({ proofs }: AdminProofsDashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this proof of transaction?')) return;
    
    const result = await deleteProofAction(id);
    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Proof deleted successfully');
      router.refresh();
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-apple-slate mb-1">Proofs of Transaction</h1>
          <p className="text-apple-gray">Manage your customer transaction gallery.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin')}
            className="bg-white hover:bg-black/5 text-apple-slate border border-black/10 px-5 py-2.5 rounded-full font-medium transition-colors shadow-sm"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-apple-blue hover:bg-apple-blue-hover text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {proofs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-[1.5rem] border border-black/[0.04]">
            <ImageIcon className="w-16 h-16 opacity-20 mb-4 text-apple-gray" />
            <p className="text-apple-gray">No transaction proofs added yet.</p>
          </div>
        ) : (
          proofs.map((proof) => (
            <div key={proof.id} className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm group">
              <div className="aspect-square relative bg-apple-bg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proof.imageUrl} alt={proof.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-apple-slate mb-2 line-clamp-1">{proof.title}</h3>
                <p className="text-sm text-apple-gray line-clamp-2 mb-4">{proof.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-apple-gray uppercase tracking-wider font-semibold">
                    {new Date(proof.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleDelete(proof.id)}
                    className="p-2 text-apple-gray hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <ProofForm 
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
