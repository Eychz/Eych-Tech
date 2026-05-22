import { z } from 'zod';

export const proofSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  imageUrl: z.string().min(1, 'Image is required'),
});

export type ProofInput = z.infer<typeof proofSchema>;
