'use client';

import { useState } from 'react';
import { updateSellRequestStatusAction, deleteSellRequestAction } from '@/controllers/sell.controller';
import { useToast } from '@/components/ui/Toast';
import { ChevronLeft, Check, X, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

function timeAgo(dateString: string | Date) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}

export function SellRequestsDashboard({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const handleUpdateStatus = async (id: string, status: 'PENDING' | 'REVIEWED' | 'REJECTED') => {
    const res = await updateSellRequestStatusAction(id, status);
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    showToast(`Status updated to ${status}`, 'success');
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    const res = await deleteSellRequestAction(id);
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    showToast('Request deleted', 'success');
    setRequests(prev => prev.filter(r => r.id !== id));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(null);
    }
  };

  if (selectedRequest) {
    return (
      <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-black/[0.04]">
        <button 
          onClick={() => setSelectedRequest(null)}
          className="flex items-center gap-2 text-apple-gray hover:text-apple-slate mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Requests
        </button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-apple-slate">Sell Request Details</h2>
            <p className="text-apple-gray text-sm mt-1">Submitted {timeAgo(selectedRequest.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              selectedRequest.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
              selectedRequest.status === 'REVIEWED' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {selectedRequest.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <h3 className="font-semibold text-apple-slate mb-4">Provided Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {selectedRequest.images.map((img: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt={`Gadget ${i}`} className="w-full aspect-square object-cover rounded-xl border border-black/10" />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="bg-apple-bg p-6 rounded-2xl space-y-4">
              <div className="flex justify-between border-b border-black/[0.04] pb-3">
                <span className="text-apple-gray font-medium">Expected Price</span>
                <span className="text-apple-slate font-bold">₱{selectedRequest.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.04] pb-3">
                <span className="text-apple-gray font-medium">Location</span>
                <span className="text-apple-slate">{selectedRequest.location}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.04] pb-3">
                <span className="text-apple-gray font-medium">Storage</span>
                <span className="text-apple-slate">{selectedRequest.storage}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.04] pb-3">
                <span className="text-apple-gray font-medium">Battery Health</span>
                <span className="text-apple-slate">{selectedRequest.batteryHealth}</span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-apple-gray font-medium">Under Warranty</span>
                <span className="text-apple-slate">{selectedRequest.underWarranty ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-apple-slate mb-2">Inclusions</h3>
              <p className="text-apple-gray bg-apple-bg p-4 rounded-xl text-sm">{selectedRequest.inclusions}</p>
            </div>

            {(selectedRequest.existingIssue || selectedRequest.repairHistory) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRequest.existingIssue && (
                  <div>
                    <h3 className="font-semibold text-apple-slate mb-2">Existing Issues</h3>
                    <p className="text-apple-gray bg-red-50 p-4 rounded-xl text-sm">{selectedRequest.existingIssue}</p>
                  </div>
                )}
                {selectedRequest.repairHistory && (
                  <div>
                    <h3 className="font-semibold text-apple-slate mb-2">Repair History</h3>
                    <p className="text-apple-gray bg-amber-50 p-4 rounded-xl text-sm">{selectedRequest.repairHistory}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="font-semibold text-apple-slate mb-2">Contact Information</h3>
              <pre className="whitespace-pre-wrap font-sans text-apple-gray bg-blue-50 p-4 rounded-xl text-sm">
                {selectedRequest.contacts}
              </pre>
            </div>

            {/* Admin Actions */}
            <div className="pt-6 border-t border-black/[0.04] flex flex-wrap gap-3">
              <button
                onClick={() => handleUpdateStatus(selectedRequest.id, 'REVIEWED')}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Mark Reviewed
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedRequest.id, 'REJECTED')}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedRequest.id, 'PENDING')}
                className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                Mark Pending
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-apple-slate">Sell Requests</h1>
          <p className="text-apple-gray mt-2">Manage customer trade-in and sell requests.</p>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="bg-white hover:bg-black/5 text-apple-slate border border-black/10 px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-black/[0.04] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/[0.04] bg-apple-bg/50 text-sm font-medium text-apple-gray uppercase tracking-wider">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-apple-gray">
                    No requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-apple-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        req.status === 'REVIEWED' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-apple-slate">
                      ₱{req.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-apple-gray">
                      {req.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-apple-gray">
                      {timeAgo(req.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-2 text-apple-blue hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
