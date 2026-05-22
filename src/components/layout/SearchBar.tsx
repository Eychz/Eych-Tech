'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
      <div className="relative group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-48 lg:w-64 bg-black/5 hover:bg-black/10 focus:bg-white border border-transparent focus:border-apple-blue/20 rounded-full py-1.5 pl-9 pr-4 text-xs text-apple-slate outline-none transition-all focus:shadow-sm"
        />
        <Search className="w-3.5 h-3.5 text-apple-gray absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-apple-blue transition-colors" />
      </div>
    </form>
  );
}
