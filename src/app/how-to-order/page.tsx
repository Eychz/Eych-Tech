import { MapPin, Store, Truck, Banknote, CreditCard, Wallet, Video, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Order - Eych Tech',
  description: 'Information about ordering, payment methods, and shipping options.',
};

export default function HowToOrderPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-apple-slate mb-6">
            How to Order
          </h1>
          <p className="text-lg text-apple-gray">
            We offer multiple convenient transaction methods to ensure you get your device safely and securely. Choose the method that works best for you.
          </p>
        </div>

        {/* Payment Methods Banner */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/[0.04] mb-16 hover:shadow-md transition-shadow group">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-apple-slate mb-2">Accepted Payment Methods</h2>
            <p className="text-apple-gray">We accept the following payment options for all transaction types.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 bg-apple-bg/50 px-6 py-4 rounded-2xl group-hover:bg-green-50 transition-colors">
              <Banknote className="w-8 h-8 text-green-600" />
              <span className="font-semibold text-apple-slate text-lg">Cash</span>
            </div>
            <div className="flex items-center gap-3 bg-apple-bg/50 px-6 py-4 rounded-2xl group-hover:bg-blue-50 transition-colors">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-apple-slate text-lg">Bank Transfer</span>
            </div>
            <div className="flex items-center gap-3 bg-apple-bg/50 px-6 py-4 rounded-2xl group-hover:bg-purple-50 transition-colors">
              <Wallet className="w-8 h-8 text-purple-600" />
              <span className="font-semibold text-apple-slate text-lg">E-Wallet</span>
            </div>
          </div>
        </div>

        {/* Transaction Methods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Meetup Card */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-black/[0.04] group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="p-8 pb-6 flex-1">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7 text-apple-blue" />
              </div>
              <h3 className="text-2xl font-bold text-apple-slate mb-3">Meetup</h3>
              <p className="text-apple-gray mb-6 leading-relaxed">
                Meet up in person to inspect and purchase your device. Our preferred secure meetup location is <span className="font-semibold text-apple-slate">McDonald's Cordova</span>.
              </p>
            </div>
            <div className="w-full h-64 bg-apple-bg relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d981.502624872172!2d123.94773053771308!3d10.260736265424637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99b7c7a002ac1%3A0xd1c89a7a17de461a!2sMcDonald&#39;s%20Cordova!5e0!3m2!1sen!2sph!4v1779625268518!5m2!1sen!2sph" 
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Meetup Location - McDonald's Cordova"
              />
            </div>
          </div>

          {/* Pickup Card */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-black/[0.04] group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="p-8 pb-6 flex-1">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-apple-slate mb-3">Pick-up</h3>
              <p className="text-apple-gray mb-6 leading-relaxed">
                Pick up your unit directly from our location. Fast and convenient. Pick-ups are done at <span className="font-semibold text-apple-slate">Gaisano Grand Cordova</span>.
              </p>
            </div>
            <div className="w-full h-64 bg-apple-bg relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d583.6112116525363!2d123.94833910073011!3d10.257341104663894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a5c18a2d331%3A0xfc813bbc6454dc7c!2sGaisano%20Grand%20Cordova!5e0!3m2!1sen!2sph!4v1779625334874!5m2!1sen!2sph" 
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Pick-up Location - Gaisano Grand Cordova"
              />
            </div>
          </div>

          {/* Shipping Card */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-black/[0.04] group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="p-8 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-apple-slate mb-3">Shipping</h3>
              <p className="text-apple-gray mb-8 leading-relaxed">
                Too far away? We securely ship nationwide via <span className="font-bold text-apple-slate">LBC</span>.
              </p>
              
              <ul className="space-y-4 mt-auto">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-apple-slate text-sm leading-relaxed">
                    <strong>Payment First:</strong> To avoid capital stack, payment must be made on the day of shipment.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-apple-slate text-sm leading-relaxed">
                    <strong>Warranty:</strong> 1-week personal warranty starts immediately upon receiving the item.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-apple-slate text-sm leading-relaxed">
                    <strong>Shipping Fee:</strong> The shipping fee will be covered by the buyer.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Video className="w-5 h-5 text-apple-blue shrink-0 mt-0.5" />
                  <span className="text-apple-slate text-sm leading-relaxed">
                    <strong>Transparency:</strong> A video call will be done with the buyer during the actual shipment process.
                  </span>
                </li>
              </ul>
            </div>
            {/* Small LBC Banner matching the iframe height aesthetically */}
            <div className="w-full h-8 bg-apple-bg flex items-center justify-center border-t border-black/[0.04]">
              <span className="text-[10px] font-bold text-apple-gray uppercase tracking-widest">Secured via LBC Courier</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
