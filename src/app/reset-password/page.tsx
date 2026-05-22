import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const sp = await searchParams;
  const email = sp.email || '';

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-apple-bg px-4 py-12">
      <ResetPasswordForm email={email} />
    </div>
  );
}
