'use client';

import { useState } from 'react';
import { resetPasswordAction } from '@/controllers/auth.controller';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export function ResetPasswordForm({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('email', email);

    const result = await resetPasswordAction(formData);

    if (result?.error) {
      showToast(result.error, 'error');
      setLoading(false);
    }
    // If successful, resetPasswordAction will redirect, so this code won't be reached
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-[1.5rem] shadow-sm border border-black/[0.04]">
      <h2 className="text-2xl font-semibold tracking-tight text-center mb-6 text-apple-slate">Create New Password</h2>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <input
            type="text"
            name="token"
            maxLength={6}
            placeholder="000000"
            className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-center text-2xl font-mono tracking-[0.5em] text-apple-slate"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password (min 8 chars)"
            className="w-full bg-apple-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all text-apple-slate placeholder:text-apple-gray"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-apple-blue hover:bg-apple-blue-hover text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
