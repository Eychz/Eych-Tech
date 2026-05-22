import prisma from '@/lib/db';
import { TokenType, Role } from '@prisma/client';

export class AuthRepository {
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async createUser(email: string, passwordHash: string, role: Role = 'CUSTOMER') {
    return prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role,
        verified: false,
      },
    });
  }

  static async verifyUser(email: string) {
    return prisma.user.update({
      where: { email },
      data: { verified: true },
    });
  }

  static async updatePassword(email: string, passwordHash: string) {
    return prisma.user.update({
      where: { email },
      data: { password: passwordHash },
    });
  }

  static async saveOtp(email: string, token: string, type: TokenType) {
    await prisma.otpToken.deleteMany({
      where: { email },
    });

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes for reset

    return prisma.otpToken.create({
      data: {
        email,
        token,
        type,
        expiresAt,
      },
    });
  }

  static async findOtp(email: string, token: string, type: TokenType) {
    return prisma.otpToken.findFirst({
      where: {
        email,
        token,
        type,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  static async deleteOtp(id: string) {
    return prisma.otpToken.delete({
      where: { id },
    });
  }
}
