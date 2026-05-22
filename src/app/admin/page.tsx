import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ProductService } from '@/services/product.service';

export default async function AdminPage() {
  const products = await ProductService.getAdminProducts();

  // Convert Decimal to number for Next.js Client Component serialization
  const serializedProducts = products.map(p => ({
    ...p,
    price: Number(p.price)
  }));

  return (
    <div className="pt-8">
      <AdminDashboard products={serializedProducts} />
    </div>
  );
}
