import type { Metadata } from 'next';
import { SellGadgetForm } from '@/components/store/SellGadgetForm';

export const metadata: Metadata = {
  title: 'Sell My Gadget - Eych Tech',
  description: 'Submit your gadget details to trade-in or sell.',
};

export default function SellGadgetPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-apple-slate mb-4">
            Sell My Gadget
          </h1>
          <p className="text-lg text-apple-gray max-w-xl mx-auto">
            Ready to upgrade? Provide the details of your current device below, and we'll review it for a potential trade-in or purchase.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-black/[0.04]">
          <SellGadgetForm />
        </div>

      </div>
    </div>
  );
}
