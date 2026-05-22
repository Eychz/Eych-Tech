'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmailAction } from '@/controllers/auth.controller';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export function VerifyEmailForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { showToast } = useToast();

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('email', email);
    
    const result = await verifyEmailAction(formData);

    if (result?.error) {
      showToast(result.error, 'error');
      setLoading(false);
    } else if (result?.success) {
      showToast('Email verified successfully! You are now logged in.', 'success');
      window.location.href = result.redirectUrl;
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <div className="mb-6">
        <label htmlFor="token" className="block text-sm font-medium text-apple-slate mb-2">
          Verification Code
        </label>
        <input
          id="token"
          name="token"
          type="text"
          maxLength={6}
          placeholder="123456"
          required
          className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-center tracking-[0.5em] font-mono text-lg"
        />
        <p className="text-xs text-apple-gray mt-2 text-center">
          Enter the 6-digit code sent to {email}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full bg-apple-blue hover:bg-apple-blue-hover text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Email'}
      </button>
    </form>
  );
}
