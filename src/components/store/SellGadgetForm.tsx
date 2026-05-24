'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { Loader2, Upload, X } from 'lucide-react';
import { submitSellRequestAction } from '@/controllers/sell.controller';
import { useRouter } from 'next/navigation';

export function SellGadgetForm() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const { showToast } = useToast();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (images.length + selected.length > 4) {
        showToast('You can only upload up to 4 images.', 'error');
        return;
      }
      setImages((prev) => [...prev, ...selected]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length === 0) {
      showToast('Please upload at least 1 image.', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const imageUrls: string[] = [];

    // Upload images
    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `sell-requests/${fileName}`;

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

    const data = {
      images: imageUrls,
      location: formData.get('location') as string,
      batteryHealth: formData.get('batteryHealth') as string,
      storage: formData.get('storage') as string,
      existingIssue: formData.get('existingIssue') as string,
      repairHistory: formData.get('repairHistory') as string,
      price: Number(formData.get('price')),
      underWarranty: formData.get('underWarranty') === 'true',
      inclusions: formData.get('inclusions') as string,
      contacts: formData.get('contacts') as string,
    };

    const result = await submitSellRequestAction(data);

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Your request has been submitted successfully!', 'success');
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Images Section */}
      <div>
        <label className="block text-sm font-semibold text-apple-slate mb-2">
          Gadget Pictures (Max 4) <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {images.map((file, i) => (
            <div key={i} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < 4 && (
            <label className="w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors text-apple-gray">
              <Upload className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-apple-slate mb-2">Location <span className="text-red-500">*</span></label>
          <input required type="text" name="location" placeholder="e.g. Cebu City" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-apple-slate mb-2">Expected Price (₱) <span className="text-red-500">*</span></label>
          <input required type="number" step="0.01" name="price" placeholder="e.g. 25000" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-apple-slate mb-2">Storage Capacity <span className="text-red-500">*</span></label>
          <input required type="text" name="storage" placeholder="e.g. 256GB" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-apple-slate mb-2">Battery Health <span className="text-red-500">*</span></label>
          <input required type="text" name="batteryHealth" placeholder="e.g. 85%" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-apple-slate mb-2">Under Warranty? <span className="text-red-500">*</span></label>
          <select required name="underWarranty" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-apple-slate mb-2">Inclusions <span className="text-red-500">*</span></label>
          <input required type="text" name="inclusions" placeholder="e.g. Box, Charger, Case" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-apple-slate mb-2">Existing Issues (Optional)</label>
          <textarea name="existingIssue" rows={3} placeholder="Describe any dents, scratches, or defects..." className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-apple-slate mb-2">Repair History (Optional)</label>
          <textarea name="repairHistory" rows={3} placeholder="Has it been opened or repaired before?" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm resize-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-apple-slate mb-2">Contact Details <span className="text-red-500">*</span></label>
        <p className="text-xs text-apple-gray mb-3">Please provide at least one way for us to contact you (Facebook Link, TikTok Link, or Phone Number). You can provide multiple.</p>
        <textarea required name="contacts" rows={3} placeholder="e.g. Phone: 09123456789&#10;Facebook: fb.com/yourprofile" className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm resize-none" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-apple-blue hover:bg-apple-blue-hover text-white font-medium py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}
