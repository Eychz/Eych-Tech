'use server';

import { AuthService } from '@/services/auth.service';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } from '@/schemas/auth.schema';
import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';

export async function logoutAction() {
  await deleteSession();
  redirect('/');
}

function getSafeError(error: any, defaultMsg: string) {
  const msg = error instanceof Error ? error.message : String(error);
  // Only return known, user-friendly messages thrown from our service.
  // Otherwise, return a generic message to prevent DB errors from leaking into the UI.
  const safeMessages = [
    'An account with this email already exists.',
    'Invalid email or password.',
    'Invalid or expired reset code.'
  ];
  
  if (safeMessages.includes(msg)) {
    return msg;
  }
  
  console.error('[Auth Error]', error);
  return defaultMsg;
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) return { error: result.error?.message || 'Invalid input.' };

  let userRole;
  try {
    const response = await AuthService.login(result.data.email, result.data.password);
    if (response.requiresVerification) {
      return { requiresVerification: true, redirectUrl: `/verify-email?email=${encodeURIComponent(response.email!)}` };
    }
    userRole = response.role;
  } catch (error: any) {
    return { error: getSafeError(error, 'An unexpected error occurred during login.') };
  }

  if (userRole === 'ADMIN') return { success: true, redirectUrl: '/admin' };
  else return { success: true, redirectUrl: '/' };
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const result = registerSchema.safeParse({ email, password, confirmPassword });
  if (!result.success) return { error: result.error?.message || 'Invalid input.' };

  try {
    await AuthService.register(result.data.email, result.data.password);
    return { success: true, redirectUrl: `/verify-email?email=${encodeURIComponent(result.data.email)}` };
  } catch (error: any) {
    return { error: getSafeError(error, 'An unexpected error occurred during registration. Please try again.') };
  }
}

export async function verifyEmailAction(formData: FormData) {
  const email = formData.get('email') as string;
  const token = formData.get('token') as string;

  const result = verifyEmailSchema.safeParse({ email, token });
  if (!result.success) return { error: result.error?.message || 'Invalid input.' };

  let userRole;
  try {
    const { role } = await AuthService.verifyEmail(result.data.email, result.data.token);
    userRole = role;
  } catch (error: any) {
    return { error: getSafeError(error, 'Invalid or expired verification code.') };
  }

  if (userRole === 'ADMIN') return { success: true, redirectUrl: '/admin' };
  else return { success: true, redirectUrl: '/' };
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;
  const result = forgotPasswordSchema.safeParse({ email });
  if (!result.success) return { error: result.error?.message || 'Invalid email.' };

  try {
    await AuthService.forgotPassword(result.data.email);
    return { success: true, email: result.data.email };
  } catch (error: any) {
    return { error: getSafeError(error, 'Failed to process request.') };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;
  const token = formData.get('token') as string;
  const newPassword = formData.get('newPassword') as string;

  const result = resetPasswordSchema.safeParse({ email, token, newPassword });
  if (!result.success) return { error: result.error?.message || 'Invalid input.' };

  try {
    await AuthService.resetPassword(result.data.email, result.data.token, result.data.newPassword);
  } catch (error: any) {
    return { error: getSafeError(error, 'Failed to reset password. Please try again.') };
  }
  
  redirect('/login');
}
