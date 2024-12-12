import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, UserPlus, Trash2, RefreshCw } from 'lucide-react';
import { Expense } from '../../types';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../lib/auth/useAuth';
import { useAdmin } from '../../lib/admin/useAdmin';
import { markExpenseAsPaid, inviteToExpense, removeExpense } from '../../lib/expenses';

interface ExpenseCardProps {
  expense: Expense;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const { familyMembers } = useStore();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [loading, setLoading] = React.useState(false);

  const paidByMember = expense.paidBy ? 
    familyMembers.find(m => m.id === expense.paidBy) : null;

  const handleMarkPaid = async () => {
    if (!user || loading || expense.paidAt) return;
    setLoading(true);

    try {
      await markExpenseAsPaid(expense.id, user.uid);
    } catch (error) {
      console.error('Error marking expense as paid:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin || loading) return;
    if (!window.confirm('Are you sure you want to remove this expense?')) return;

    setLoading(true);
    try {
      await removeExpense(expense.id);
    } catch (error) {
      console.error('Error removing expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!user || loading) return;
    // Show user selection modal or dropdown
    // For now, let's just invite the first non-admin user
    const inviteeId = familyMembers.find(m => m.id !== user.uid)?.id;
    if (!inviteeId) return;

    setLoading(true);
    try {
      await inviteToExpense(expense.id, inviteeId, user.uid);
    } catch (error) {
      console.error('Error inviting to expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card ${
      expense.paidAt 
        ? 'bg-emerald-900/20' 
        : new Date(expense.dueDate) < new Date() 
          ? 'bg-red-900/20'
          : ''
    }`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{expense.title}</h3>
              {expense.isRecurring && (
                <RefreshCw className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            {expense.description && (
              <p className="text-sm text-gray-400 mt-0.5">{expense.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">€{expense.amount.toFixed(2)}</div>
            <div className="text-sm text-gray-400">
              Due {format(new Date(expense.dueDate), 'MMM d')}
            </div>
          </div>
        </div>

        {expense.paidAt ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">
                Paid by {paidByMember?.name} on {format(new Date(expense.paidAt), 'MMM d')}
              </span>
            </div>
            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/20"
                title="Remove Expense"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkPaid}
              disabled={loading}
              className="button button-primary flex-1 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark as Paid</span>
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={handleInvite}
                  disabled={loading}
                  className="button p-2"
                  title="Invite Others"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="button p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300"
                  title="Remove Expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}