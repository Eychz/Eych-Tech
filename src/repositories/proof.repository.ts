import prisma from '@/lib/db';
import { ProofInput } from '@/schemas/proof.schema';

export class ProofRepository {
  static async getAllProofs() {
    return prisma.proofOfTransaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createProof(data: ProofInput) {
    return prisma.proofOfTransaction.create({ data });
  }

  static async deleteProof(id: string) {
    return prisma.proofOfTransaction.delete({
      where: { id },
    });
  }
}
