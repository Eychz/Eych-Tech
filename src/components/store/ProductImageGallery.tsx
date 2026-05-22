'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProductImageGallery({ images, title }: { images: string[], title: string }) {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-apple-bg rounded-3xl flex items-center justify-center text-apple-gray">
        No Image Available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-[4/3] md:aspect-square bg-apple-bg rounded-3xl overflow-hidden relative border border-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={mainImage} 
          alt={title} 
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                mainImage === img ? 'border-apple-blue' : 'border-transparent hover:border-black/10'
              } bg-apple-bg`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img} 
                alt={`${title} thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
