'use server';

import { ProductService } from '@/services/product.service';
import { productSchema, updateProductSchema } from '@/schemas/product.schema';
import { verifySession } from '@/lib/session';
import { revalidatePath, revalidateTag } from 'next/cache';

async function requireAdmin() {
  const session = await verifySession();
  if (session?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function createProductAction(data: unknown) {
  await requireAdmin();
  
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.message };
  }

  try {
    await ProductService.createProduct(result.data);
    revalidatePath('/admin');
    revalidatePath('/');
    revalidateTag('products', 'max');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to create product' };
  }
}

export async function updateProductAction(id: string, data: unknown) {
  await requireAdmin();

  const result = updateProductSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    await ProductService.updateProduct(id, result.data);
    revalidatePath('/admin');
    revalidatePath('/');
    revalidateTag('products', 'max');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to update product' };
  }
}

export async function deleteProductAction(id: string) {
  await requireAdmin();

  try {
    await ProductService.softDeleteProduct(id);
    revalidatePath('/admin');
    revalidatePath('/');
    revalidateTag('products', 'max');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete product' };
  }
}
