'use server';

import { verifySession } from '@/lib/session';
import { ProofService } from '@/services/proof.service';
import { proofSchema } from '@/schemas/proof.schema';
import { revalidatePath } from 'next/cache';

export async function createProofAction(formData: FormData) {
  const session = await verifySession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
  };

  const validation = proofSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const proof = await ProofService.createProof(validation.data);
    revalidatePath('/proofs');
    revalidatePath('/admin/proofs');
    return { success: true, proof };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteProofAction(id: string) {
  const session = await verifySession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  try {
    await ProofService.deleteProof(id);
    revalidatePath('/proofs');
    revalidatePath('/admin/proofs');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
