'use server';

import { AuthService } from '@/services/auth.service';
import { loginSchema } from '@/schemas/auth.schema';
import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';

export async function logoutAction() {
  await deleteSession();
  redirect('/');
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) return { error: result.error?.issues[0]?.message || 'Invalid input.' };

  try {
    const response = await AuthService.login(result.data.email, result.data.password);
    if (response.role === 'ADMIN') return { success: true, redirectUrl: '/admin' };
    return { error: 'Access denied.' };
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === 'Invalid email or password.') return { error: msg };
    console.error('[Auth Error]', error);
    return { error: 'An unexpected error occurred during login.' };
  }
}
