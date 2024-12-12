import React from 'react';
import { Shield } from 'lucide-react';
import { useAdmin } from '../../lib/admin/useAdmin';
import { addAdminUser, removeAdminUser } from '../../lib/admin';

interface AdminIndicatorProps {
  userId: string;
  email: string;
  isUserAdmin: boolean;
}

export function AdminIndicator({ userId, email, isUserAdmin }: AdminIndicatorProps) {
  const [loading, setLoading] = React.useState(false);
  const { isAdmin } = useAdmin();

  if (!isAdmin) return null;

  const handleToggleAdmin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isUserAdmin) {
        await removeAdminUser(userId);
      } else {
        await addAdminUser(email);
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleAdmin}
      disabled={loading}
      className={`p-1.5 rounded-lg transition-colors ${
        isUserAdmin 
          ? 'text-purple-300 hover:bg-purple-500/20' 
          : 'text-gray-400 hover:bg-gray-700'
      }`}
      title={isUserAdmin ? 'Remove Admin' : 'Make Admin'}
    >
      <Shield size={18} className={loading ? 'animate-pulse' : ''} />
    </button>
  );
}