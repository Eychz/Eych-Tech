import prisma from '@/lib/db';
import { ProductInput, UpdateProductInput } from '@/schemas/product.schema';
import { ProductCategory } from '@prisma/client';

export class ProductRepository {
  static async getAllActiveProducts(
    category?: ProductCategory, 
    searchQuery?: string, 
    availableOnly = false,
    page?: number,
    limit?: number
  ) {
    const where = {
      deletedAt: null,
      ...(availableOnly ? { availability: 'AVAILABLE' as const } : {}),
      ...(category ? { category } : {}),
      ...(searchQuery ? {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' as const } },
          { description: { contains: searchQuery, mode: 'insensitive' as const } },
          { condition: { contains: searchQuery, mode: 'insensitive' as const } }
        ]
      } : {})
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { availability: 'asc' },
        { createdAt: 'desc' }
      ],
      ...(page && limit ? { skip: (page - 1) * limit, take: limit } : {})
    });

    const total = page && limit ? await prisma.product.count({ where }) : products.length;

    return { products, total };
  }

  static async getAllProductsAdmin(
    searchQuery?: string,
    page?: number,
    limit?: number
  ) {
    const where = { 
      deletedAt: null,
      ...(searchQuery ? {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' as const } },
          { description: { contains: searchQuery, mode: 'insensitive' as const } }
        ]
      } : {})
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { availability: 'asc' },
        { createdAt: 'desc' }
      ],
      ...(page && limit ? { skip: (page - 1) * limit, take: limit } : {})
    });

    const total = page && limit ? await prisma.product.count({ where }) : products.length;

    return { products, total };
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
