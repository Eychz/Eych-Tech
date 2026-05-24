'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export function GadgetDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-apple-slate hover:text-apple-blue transition-colors outline-none"
      >
        View Gadgets
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-40 bg-white rounded-xl shadow-lg border border-black/5 py-2 flex flex-col z-50">
          <Link 
            href="/laptop" 
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-apple-slate hover:bg-apple-bg transition-colors"
          >
            Laptop
          </Link>
          <Link 
            href="/pad" 
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-apple-slate hover:bg-apple-bg transition-colors"
          >
            Pad
          </Link>
          <Link 
            href="/phone" 
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-apple-slate hover:bg-apple-bg transition-colors"
          >
            Phone
          </Link>
        </div>
      )}
    </div>
  );
}
