'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/controllers/auth.controller';
import { Loader2 } from 'lucide-react';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await logoutAction();
    showToast('Logged out successfully');
    router.refresh(); // Refresh to update server component state (Header)
    // We don't necessarily need to set loading to false since the header will re-render without this button,
    // but just in case:
    setLoading(false);
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="text-apple-slate hover:text-apple-blue transition-colors text-xs font-medium flex items-center gap-1 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Logging out...</span>
        </>
      ) : (
        'Logout'
      )}
    </button>
  );
}
