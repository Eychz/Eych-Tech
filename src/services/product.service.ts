import { ProductRepository } from '@/repositories/product.repository';
import { ProductInput, UpdateProductInput } from '@/schemas/product.schema';
import { ProductCategory } from '@prisma/client';

export class ProductService {
  static async getStoreProducts(category?: ProductCategory, searchQuery?: string, availableOnly = true) {
    return ProductRepository.getAllActiveProducts(category, searchQuery, availableOnly);
  }

  static async getAdminProducts(searchQuery?: string) {
    return ProductRepository.getAllProductsAdmin(searchQuery);
  }

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
