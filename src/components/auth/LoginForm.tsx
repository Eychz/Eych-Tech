'use client';

import { useState } from 'react';
import { loginAction } from '@/controllers/auth.controller';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      showToast(result.error, 'error');
      setLoading(false);
    } else if (result?.requiresVerification) {
      showToast('Please verify your email to log in.', 'success');
      window.location.href = result.redirectUrl;
    } else if (result?.success) {
      showToast('Logged in successfully', 'success');
      window.location.href = result.redirectUrl;
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-[1.5rem] shadow-sm border border-black/[0.04]">
      <h2 className="text-2xl font-semibold tracking-tight text-center mb-6 text-apple-slate">Sign In</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-apple-slate placeholder:text-apple-gray"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-apple-slate placeholder:text-apple-gray"
            required
          />
        </div>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-apple-blue hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-apple-slate hover:bg-black text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-apple-gray">
        Don't have an account?{' '}
        <Link href="/register" className="text-apple-blue hover:underline">
          Register now
        </Link>
      </p>
    </div>
  );
}
