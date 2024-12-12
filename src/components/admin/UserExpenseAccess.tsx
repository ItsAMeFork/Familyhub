import React from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { inviteToExpense, removeExpenseAccess } from '../../lib/expenses/invites';
import { useAuth } from '../../lib/auth';

interface UserExpenseAccessProps {
  userId: string;
  hasAccess: boolean;
  onUpdate: () => void;
}

export function UserExpenseAccess({ userId, hasAccess, onUpdate }: UserExpenseAccessProps) {
  const [loading, setLoading] = React.useState(false);
  const { user } = useAuth();

  const handleToggleAccess = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      if (hasAccess) {
        await removeExpenseAccess(userId);
      } else {
        await inviteToExpense(userId, user.uid);
      }
      onUpdate();
    } catch (error) {
      console.error('Error updating expense access:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleAccess}
      disabled={loading}
      className={`p-1.5 rounded-lg transition-colors ${
        hasAccess
          ? 'hover:bg-red-500/20 text-red-300'
          : 'hover:bg-emerald-500/20 text-emerald-300'
      }`}
      title={hasAccess ? 'Remove Expense Access' : 'Grant Expense Access'}
    >
      {hasAccess ? <UserMinus size={18} /> : <UserPlus size={18} />}
    </button>
  );
}