'use client';

import { useState } from 'react';
import { forgotPasswordAction } from '@/controllers/auth.controller';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);

    if (result?.error) {
      showToast(result.error, 'error');
      setLoading(false);
    } else if (result?.success) {
      showToast('If an account exists, a reset link has been sent.', 'success');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-[1.5rem] shadow-sm border border-black/[0.04]">
      <div className="mb-6 flex justify-center relative">
        <Link href="/login" className="absolute left-0 top-1 text-apple-gray hover:text-apple-slate transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-semibold tracking-tight text-center text-apple-slate">Reset Password</h2>
      </div>
      
      <p className="text-sm text-apple-gray text-center mb-6">
        Enter your email address and we'll send you a code to reset your password.
      </p>

      <form onSubmit={handleForgot} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-apple-slate placeholder:text-apple-gray"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-apple-slate hover:bg-black text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Code'}
        </button>
      </form>
    </div>
  );
}
