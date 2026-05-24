import { getSellRequestsAction } from '@/controllers/sell.controller';
import { SellRequestsDashboard } from '@/components/admin/SellRequestsDashboard';
import { redirect } from 'next/navigation';

export default async function AdminSellRequestsPage() {
  const { requests, error } = await getSellRequestsAction();

  if (error || !requests) {
    redirect('/admin');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SellRequestsDashboard initialRequests={requests} />
    </div>
  );
}
