'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { createProductAction, updateProductAction } from '@/controllers/product.controller';
import { useToast } from '@/components/ui/Toast';
import { Loader2, X, Upload } from 'lucide-react';
import { ProductCategory, ProductAvailability } from '@prisma/client';

type ProductFormProps = {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
};

export function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const { showToast } = useToast();
  const isEditing = !!initialData;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (existingImages.length + newFiles.length + selected.length > 4) {
        showToast('Maximum of 4 images allowed', 'error');
        return;
      }
      setNewFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    let imageUrls = [...existingImages];

    // Upload new files
    for (const file of newFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

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
      
      imageUrls.push(publicUrlData.publicUrl);
    }

    if (imageUrls.length === 0) {
      showToast('At least one image is required', 'error');
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      condition: formData.get('condition'),
      category: formData.get('category'),
      availability: formData.get('availability'),
      storage: formData.get('storage') || undefined,
      batteryHealth: formData.get('batteryHealth') || undefined,
      variant: formData.get('variant') || undefined,
      images: imageUrls,
    };

    let result;
    if (isEditing) {
      result = await updateProductAction(initialData.id, payload);
    } else {
      result = await createProductAction(payload);
    }

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast(`Product ${isEditing ? 'updated' : 'created'} successfully`);
      onSuccess();
    }
    setLoading(false);
  };

  const totalImages = existingImages.length + newFiles.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-black/5 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-apple-slate">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-apple-slate" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            
            {/* Image Upload Gallery */}
            <div>
              <label className="block text-sm font-medium text-apple-slate mb-2">Product Images ({totalImages}/4)</label>
              <div className="grid grid-cols-4 gap-4">
                {/* Existing Images */}
                {existingImages.map((url, i) => (
                  <div key={`existing-${i}`} className="relative aspect-square rounded-2xl overflow-hidden bg-apple-bg border border-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* New Files */}
                {newFiles.map((file, i) => (
                  <div key={`new-${i}`} className="relative aspect-square rounded-2xl overflow-hidden bg-apple-bg border border-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(file)} alt={`New Preview ${i}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewFile(i)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                {totalImages < 4 && (
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-black/10 rounded-2xl cursor-pointer bg-apple-bg hover:bg-black/5 transition-colors overflow-hidden">
                    <Upload className="w-6 h-6 text-apple-gray mb-2" />
                    <span className="text-xs text-apple-gray font-medium">Add Image</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-apple-slate mb-2">Item Name</label>
                <input type="text" name="title" defaultValue={initialData?.title} required className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-slate mb-2">Price ($)</label>
                <input type="number" step="0.01" name="price" defaultValue={initialData?.price} required className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-slate mb-2">Description</label>
              <textarea name="description" rows={3} defaultValue={initialData?.description} required className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 resize-none" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-apple-slate mb-2">Storage</label>
                <input type="text" name="storage" defaultValue={initialData?.storage} placeholder="e.g. 256GB" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-slate mb-2">Battery Health</label>
                <input type="text" name="batteryHealth" defaultValue={initialData?.batteryHealth} placeholder="e.g. 100%" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-slate mb-2">Variant</label>
                <input type="text" name="variant" defaultValue={initialData?.variant} placeholder="e.g. Space Black" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-apple-slate mb-2">Condition</label>
                <input type="text" name="condition" defaultValue={initialData?.condition} placeholder="e.g. Brand New" required className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-slate mb-2">Category</label>
                <select name="category" defaultValue={initialData?.category || 'PHONE'} className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 appearance-none">
                  <option value={ProductCategory.PHONE}>Phone</option>
                  <option value={ProductCategory.LAPTOP}>Laptop</option>
                  <option value={ProductCategory.PAD}>Pad</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-slate mb-2">Availability</label>
                <select name="availability" defaultValue={initialData?.availability || 'AVAILABLE'} className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 appearance-none">
                  <option value={ProductAvailability.AVAILABLE}>Available</option>
                  <option value={ProductAvailability.PENDING}>Pending</option>
                  <option value={ProductAvailability.SOLD}>Sold</option>
                </select>
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl font-medium text-apple-slate hover:bg-apple-bg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-apple-blue hover:bg-apple-blue-hover text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
