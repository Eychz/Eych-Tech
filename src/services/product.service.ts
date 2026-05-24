import { ProductRepository } from '@/repositories/product.repository';
import { ProductInput, UpdateProductInput } from '@/schemas/product.schema';
import { ProductCategory } from '@prisma/client';
import { unstable_cache } from 'next/cache';

export class ProductService {
  static getStoreProducts = unstable_cache(
    async (category?: ProductCategory, searchQuery?: string, availableOnly = true, page?: number, limit?: number) => {
      return ProductRepository.getAllActiveProducts(category, searchQuery, availableOnly, page, limit);
    },
    ['store-products'],
    { tags: ['products'] }
  );

  static getAdminProducts = unstable_cache(
    async (searchQuery?: string, page?: number, limit?: number) => {
      return ProductRepository.getAllProductsAdmin(searchQuery, page, limit);
    },
    ['admin-products'],
    { tags: ['products'] }
  );

  static async getProductById(id: string) {
    return ProductRepository.getProductById(id);
  }

  static async createProduct(data: ProductInput) {
    return ProductRepository.createProduct(data);
  }

  static async updateProduct(id: string, data: UpdateProductInput) {
    return ProductRepository.updateProduct(id, data);
  }

  static async softDeleteProduct(id: string) {
    return ProductRepository.softDeleteProduct(id);
  }

  static async cleanupOldProducts() {
    return ProductRepository.hardDeleteOldProducts();
  }
}
