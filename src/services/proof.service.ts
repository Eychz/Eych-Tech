import { ProofRepository } from '@/repositories/proof.repository';
import { ProofInput } from '@/schemas/proof.schema';

export class ProofService {
  static async getAllProofs() {
    return ProofRepository.getAllProofs();
  }

  static async createProof(data: ProofInput) {
    return ProofRepository.createProof(data);
  }

  static async deleteProof(id: string) {
    return ProofRepository.deleteProof(id);
  }
}
