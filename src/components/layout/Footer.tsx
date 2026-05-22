import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-black/5 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-apple-slate tracking-tight mb-4">Eych Tech</h2>
            <p className="text-apple-gray text-sm max-w-sm mb-6">
              Your premium destination for buying and selling high-quality, pre-owned, and brand-new gadgets. Quality checked and ready to ship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-apple-slate mb-4">Store</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-sm text-apple-gray hover:text-apple-blue transition-colors">All Products</Link></li>
              <li><Link href="/phone" className="text-sm text-apple-gray hover:text-apple-blue transition-colors">Phones</Link></li>
              <li><Link href="/laptop" className="text-sm text-apple-gray hover:text-apple-blue transition-colors">Laptops</Link></li>
              <li><Link href="/pad" className="text-sm text-apple-gray hover:text-apple-blue transition-colors">Pads</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-apple-slate mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.tiktok.com/@eych.tech" target="_blank" rel="noopener noreferrer" className="text-sm text-apple-gray hover:text-apple-blue transition-colors flex items-center gap-1">
                  TikTok <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://facebook.com/GadgetEych" target="_blank" rel="noopener noreferrer" className="text-sm text-apple-gray hover:text-apple-blue transition-colors flex items-center gap-1">
                  Facebook <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-apple-gray">
            &copy; {currentYear} Eych Tech. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-apple-gray hover:text-apple-slate transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-apple-gray hover:text-apple-slate transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
