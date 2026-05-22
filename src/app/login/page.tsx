import { LoginForm } from '@/components/auth/LoginForm';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await verifySession();
  
  if (session) {
    if (session.role === 'ADMIN') {
      redirect('/admin');
    } else {
      redirect('/');
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-apple-bg px-4 py-12">
      <LoginForm />
    </div>
  );
}
