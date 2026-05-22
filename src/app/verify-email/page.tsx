import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-black/[0.04] p-8 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-apple-slate mb-2">
            Verify your email
          </h2>
          <p className="text-apple-gray">
            Please enter the verification code to activate your account.
          </p>
        </div>
        
        <Suspense fallback={<div className="text-center py-4 text-apple-gray">Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
