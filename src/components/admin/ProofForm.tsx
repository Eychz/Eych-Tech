'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { createProofAction } from '@/controllers/proof.controller';
import { useToast } from '@/components/ui/Toast';
import { Loader2, X, Upload } from 'lucide-react';

type ProofFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export function ProofForm({ onSuccess, onCancel }: ProofFormProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      showToast('An image is required', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // Upload file
    const fileExt = file.name.split('.').pop();
    const fileName = `proof_${Math.random()}.${fileExt}`;
    const filePath = `public/proofs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('Eych Tech')
      .upload(filePath, file);

    if (uploadError) {
      showToast(`Image upload failed: ${uploadError.message}`, 'error');
      setLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('Eych Tech')
      .getPublicUrl(filePath);
    
    formData.set('imageUrl', publicUrlData.publicUrl);

    const result = await createProofAction(formData);

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Proof created successfully');
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-black/5 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-apple-slate">Add Proof of Transaction</h2>
          <button onClick={onCancel} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-apple-slate" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-apple-slate mb-2">Transaction Image</label>
              {!file ? (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-black/10 rounded-2xl cursor-pointer bg-apple-bg hover:bg-black/5 transition-colors overflow-hidden">
                  <Upload className="w-8 h-8 text-apple-gray mb-3" />
                  <span className="text-sm text-apple-gray font-medium">Click to upload image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-apple-bg border border-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setFile(null)} className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors backdrop-blur-md">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-slate mb-2">Title</label>
              <input type="text" name="title" placeholder="e.g., Sold iPhone 14 Pro Max" required className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20" />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-slate mb-2">Description / Customer Feedback</label>
              <textarea name="description" rows={4} placeholder="e.g., Fast transaction, very accommodating seller!" required className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 resize-none" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl font-medium text-apple-slate hover:bg-apple-bg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-apple-blue hover:bg-apple-blue-hover text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
