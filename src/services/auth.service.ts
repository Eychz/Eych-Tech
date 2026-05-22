import { AuthRepository } from '@/repositories/auth.repository';
import { Resend } from 'resend';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';

const resend = new Resend(process.env.RESEND_API_KEY);

export class AuthService {
  static async register(email: string, passwordPlain: string) {
    const existingUser = await AuthRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    await AuthRepository.createUser(email, passwordHash, 'CUSTOMER');

    // Generate and send verification OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    await AuthRepository.saveOtp(email, otp, 'VERIFY_EMAIL');

    const { error } = await resend.emails.send({
      from: '"eych.tech@business" <onboarding@resend.dev>',
      to: email,
      subject: `Verify your email: ${otp}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; text-align: center; background-color: #f5f5f7;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <h1 style="color: #1d1d1f; font-size: 24px; font-weight: 600; margin-bottom: 8px;">Welcome to Eych Tech</h1>
            <p style="color: #86868b; font-size: 15px; margin-bottom: 32px;">Please use this code to verify your email address.</p>
            <div style="background-color: #f5f5f7; border-radius: 8px; padding: 16px; font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #1d1d1f;">
              ${otp}
            </div>
          </div>
        </div>
      `,
    });

    if (error) throw new Error(error.message);

    return { success: true };
  }

  static async verifyEmail(email: string, token: string) {
    const otpRecord = await AuthRepository.findOtp(email, token, 'VERIFY_EMAIL');
    if (!otpRecord) throw new Error('Invalid or expired verification code.');

    await AuthRepository.verifyUser(email);
    await AuthRepository.deleteOtp(otpRecord.id);

    // Auto-login after verification
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) throw new Error('User not found.');

    await createSession(user.id, user.email, user.role);
    return { success: true, role: user.role };
  }

  static async login(email: string, passwordPlain: string) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(passwordPlain, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    if (!user.verified) {
      // Generate and send a new verification OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      await AuthRepository.saveOtp(email, otp, 'VERIFY_EMAIL');

      const { error } = await resend.emails.send({
        from: '"eych.tech@business" <onboarding@resend.dev>',
        to: email,
        subject: `Verify your email: ${otp}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; text-align: center; background-color: #f5f5f7;">
            <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <h1 style="color: #1d1d1f; font-size: 24px; font-weight: 600; margin-bottom: 8px;">Welcome to Eych Tech</h1>
              <p style="color: #86868b; font-size: 15px; margin-bottom: 32px;">Please use this code to verify your email address.</p>
              <div style="background-color: #f5f5f7; border-radius: 8px; padding: 16px; font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #1d1d1f;">
                ${otp}
              </div>
            </div>
          </div>
        `,
      });

      if (error) throw new Error(error.message);

      return { requiresVerification: true, email: user.email };
    }

    await createSession(user.id, user.email, user.role);
    return { success: true, role: user.role };
  }

  static async forgotPassword(email: string) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      // For security, don't reveal if user exists or not
      return { success: true };
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    await AuthRepository.saveOtp(email, otp, 'RESET_PASSWORD');

    const { error } = await resend.emails.send({
      from: '"eych.tech@business" <onboarding@resend.dev>',
      to: email,
      subject: `Password Reset Code: ${otp}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; text-align: center; background-color: #f5f5f7;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <h1 style="color: #1d1d1f; font-size: 24px; font-weight: 600; margin-bottom: 8px;">Eych Tech</h1>
            <p style="color: #86868b; font-size: 15px; margin-bottom: 32px;">Use the following code to reset your password.</p>
            <div style="background-color: #f5f5f7; border-radius: 8px; padding: 16px; font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #1d1d1f;">
              ${otp}
            </div>
            <p style="color: #86868b; font-size: 13px; margin-top: 32px;">This code will expire in 15 minutes.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }

  static async resetPassword(email: string, token: string, newPasswordPlain: string) {
    const otpRecord = await AuthRepository.findOtp(email, token, 'RESET_PASSWORD');

    if (!otpRecord) {
      throw new Error('Invalid or expired reset code.');
    }

    const passwordHash = await bcrypt.hash(newPasswordPlain, 10);
    await AuthRepository.updatePassword(email, passwordHash);
    await AuthRepository.deleteOtp(otpRecord.id);

    return { success: true };
  }
}
