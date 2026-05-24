import prisma from '@/lib/db';
import { ProductInput, UpdateProductInput } from '@/schemas/product.schema';
import { ProductCategory } from '@prisma/client';

export class ProductRepository {
  static async getAllActiveProducts(category?: ProductCategory, searchQuery?: string, availableOnly = false) {
    return prisma.product.findMany({
      where: {
        deletedAt: null,
        ...(availableOnly ? { availability: 'AVAILABLE' } : {}),
        ...(category ? { category } : {}),
        ...(searchQuery ? {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { condition: { contains: searchQuery, mode: 'insensitive' } }
          ]
        } : {})
      },
      orderBy: [
        { availability: 'asc' },
        { createdAt: 'desc' }
      ],
    });
  }

  static async getAllProductsAdmin(searchQuery?: string) {
    return prisma.product.findMany({
      where: { 
        deletedAt: null,
        ...(searchQuery ? {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } }
          ]
        } : {})
      },
      orderBy: [
        { availability: 'asc' },
        { createdAt: 'desc' }
      ],
    });
  }

  static async getProductById(id: string) {
    return prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
  }

  static async createProduct(data: ProductInput) {
    return prisma.product.create({ data });
  }

  static async updateProduct(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async softDeleteProduct(id: string) {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async hardDeleteOldProducts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return prisma.product.deleteMany({
      where: {
        deletedAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }
}
