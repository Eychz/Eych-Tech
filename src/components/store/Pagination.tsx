'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-12">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-black/10 text-apple-slate text-sm font-medium hover:bg-apple-blue hover:text-white hover:border-apple-blue transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
      ) : (
        <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-black/5 text-apple-gray text-sm font-medium opacity-40 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              page === currentPage
                ? 'bg-apple-blue text-white shadow-sm'
                : 'bg-white border border-black/10 text-apple-slate hover:bg-apple-bg'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-black/10 text-apple-slate text-sm font-medium hover:bg-apple-blue hover:text-white hover:border-apple-blue transition-all shadow-sm"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-black/5 text-apple-gray text-sm font-medium opacity-40 cursor-not-allowed">
          Next
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
