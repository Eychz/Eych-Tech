import { AdminProofsDashboard } from '@/components/admin/AdminProofsDashboard';
import { ProofService } from '@/services/proof.service';

export default async function AdminProofsPage() {
  const proofs = await ProofService.getAllProofs();

  return (
    <div className="pt-8">
      <AdminProofsDashboard proofs={proofs} />
    </div>
  );
}
