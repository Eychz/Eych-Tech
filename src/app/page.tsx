import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { verifySession } from '@/lib/session';

export default async function Home() {
  const session = await verifySession();

  return (
    <main className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-apple-slate leading-tight">
          High quality. <br className="hidden md:block" /> Brand new like condition.
        </h1>
        <p className="text-xl md:text-2xl text-apple-gray font-medium mb-8 max-w-2xl mx-auto">
          A premium destination of gadgets and accessories offering top-tier preowned and brand new gadgets.
        </p>
        <div className="flex items-center justify-center gap-4 mb-16">
          <Link href="/shop" className="bg-apple-blue hover:bg-apple-blue-hover text-white px-6 py-3 rounded-full font-medium transition-colors">
            Shop Now
          </Link>
          {!session && (
            <Link href="/login" className="text-apple-blue hover:underline font-medium flex items-center gap-1">
              Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-[2rem] overflow-hidden bg-apple-bg shadow-2xl border border-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-cartoon.png"
            alt="3D Cartoon Smartphone"
            className="w-full h-content object-cover -translate-y-10 hover:scale-105 transition-transform duration-[2000ms]"
          />
        </div>
      </section>

      {/* Category Links */}
      <section id="store" className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-apple-slate mb-2">Browse by Category</h2>
          <p className="text-apple-gray">Find exactly what you're looking for.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone Category */}
          <div className="bg-white rounded-[1.5rem] p-8 flex flex-col items-center text-center shadow-sm border border-black/[0.04] transition-transform hover:scale-[1.01]">
            <div className="w-48 h-48 bg-apple-bg rounded-full mb-8 relative overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/thumb-phone.png" alt="Phones" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <h3 className="text-2xl font-semibold mb-1 text-apple-slate">Phones</h3>
            <p className="text-apple-gray mb-6">Premium smartphones, incredible condition.</p>
            <Link
              href="/phone"
              className="mt-auto bg-apple-bg text-apple-slate px-8 py-3 rounded-full font-medium hover:bg-apple-slate hover:text-white transition-colors flex items-center gap-2"
            >
              Shop Phones <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Laptop Category */}
          <div className="bg-white rounded-[1.5rem] p-8 flex flex-col items-center text-center shadow-sm border border-black/[0.04] transition-transform hover:scale-[1.01]">
            <div className="w-48 h-48 bg-apple-bg rounded-full mb-8 relative overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/thumb-laptop.png" alt="Laptops" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <h3 className="text-2xl font-semibold mb-1 text-apple-slate">Laptops</h3>
            <p className="text-apple-gray mb-6">Power and portability, ready to go.</p>
            <Link
              href="/laptop"
              className="mt-auto bg-apple-bg text-apple-slate px-8 py-3 rounded-full font-medium hover:bg-apple-slate hover:text-white transition-colors flex items-center gap-2"
            >
              Shop Laptops <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pad Category */}
          <div className="bg-white rounded-[1.5rem] p-8 flex flex-col items-center text-center shadow-sm border border-black/[0.04] transition-transform hover:scale-[1.01]">
            <div className="w-48 h-48 bg-apple-bg rounded-full mb-8 relative overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/thumb-pad.png" alt="Pads" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <h3 className="text-2xl font-semibold mb-1 text-apple-slate">Pads</h3>
            <p className="text-apple-gray mb-6">Unbelievably thin. Incredibly powerful.</p>
            <Link
              href="/pad"
              className="mt-auto bg-apple-bg text-apple-slate px-8 py-3 rounded-full font-medium hover:bg-apple-slate hover:text-white transition-colors flex items-center gap-2"
            >
              Shop Pads <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
