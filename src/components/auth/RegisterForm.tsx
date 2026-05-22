'use client';

import { useState } from 'react';
import { registerAction } from '@/controllers/auth.controller';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (result?.error) {
      showToast(result.error, 'error');
      setLoading(false);
    } else if (result?.success) {
      showToast('Please check your email for the verification code.', 'success');
      window.location.href = result.redirectUrl;
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-[1.5rem] shadow-sm border border-black/[0.04]">
      <h2 className="text-2xl font-semibold tracking-tight text-center mb-6 text-apple-slate">Create Account</h2>

      <form onSubmit={handleRegister} className="space-y-4">
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
            placeholder="Password (min 8 characters)"
            className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-apple-slate placeholder:text-apple-gray"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-apple-slate placeholder:text-apple-gray"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-apple-slate hover:bg-black text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-apple-gray">
        Already have an account?{' '}
        <Link href="/login" className="text-apple-blue hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
