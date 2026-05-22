import { z } from 'zod';
import { ProductCategory, ProductAvailability } from '@prisma/client';

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  condition: z.string().min(1, 'Condition is required'),
  batteryHealth: z.string().optional(),
  storage: z.string().optional(),
  variant: z.string().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required').max(4, 'Maximum of 4 images allowed'),
  category: z.nativeEnum(ProductCategory),
  availability: z.nativeEnum(ProductAvailability).default('AVAILABLE'),
  isFeatured: z.boolean().default(false),
});

export const updateProductSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
