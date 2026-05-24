import { AuthRepository } from '@/repositories/auth.repository';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';

export class AuthService {
  static async login(email: string, passwordPlain: string) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(passwordPlain, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    await createSession(user.id, user.email, user.role);
    return { success: true, role: user.role };
  }
}
