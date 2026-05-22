import { ProofService } from '@/services/proof.service';
import { Image as ImageIcon } from 'lucide-react';

export default async function ProofsPage() {
  const proofs = await ProofService.getAllProofs();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-[calc(100vh-64px)]">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-apple-slate mb-4">Proofs of Transaction</h1>
        <p className="text-lg text-apple-gray max-w-2xl mx-auto">
          We take pride in our service. Here are some of our successful transactions and feedback from happy customers!
        </p>
      </div>

      {proofs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-apple-gray">
          <ImageIcon className="w-16 h-16 opacity-20 mb-4" />
          <p className="text-lg">No transactions have been posted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {proofs.map((proof) => (
            <div key={proof.id} className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm group hover:shadow-md transition-shadow">
              <div className="aspect-square relative bg-apple-bg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={proof.imageUrl} 
                  alt={proof.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-apple-slate mb-2">{proof.title}</h3>
                <p className="text-sm text-apple-gray leading-relaxed mb-4">{proof.description}</p>
                <div className="text-[10px] text-apple-gray uppercase tracking-wider font-semibold">
                  {new Date(proof.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
