import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAdmin } from '../../lib/admin/useAdmin';
import { useAuth } from '../../lib/auth/useAuth';
import { addBudgetTransaction } from '../../lib/budget';

export function MealBudget() {
  const { weeklyBudget, budgetTransactions } = useStore();
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');

  const currentBudget = weeklyBudget?.amount || 60;
  const totalSpent = budgetTransactions?.reduce((acc, transaction) => 
    acc + (transaction.type === 'remove' ? transaction.amount : -transaction.amount), 0) || 0;
  const remainingBudget = currentBudget - totalSpent;

  const handleSubmit = async (e: React.FormEvent, type: 'add' | 'remove') => {
    e.preventDefault();
    if (!user || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (type === 'remove' && numAmount > remainingBudget) {
      alert('Not enough budget remaining!');
      return;
    }

    try {
      await addBudgetTransaction({
        amount: numAmount,
        type,
        userId: user.uid,
        timestamp: new Date().toISOString()
      });
      setAmount('');
      setShowForm(false);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-emerald-400">€{remainingBudget.toFixed(2)}</span>
        <span className="text-sm text-gray-400">remaining</span>
      </div>
      
      {showForm ? (
        <form onSubmit={(e) => handleSubmit(e, 'add')} className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input w-24"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
          <div className="flex gap-1">
            <button
              type="submit"
              className="button button-primary p-1.5"
              title="Add Money"
            >
              <PlusCircle size={16} />
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'remove')}
                className="button p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300"
                title="Remove Money"
              >
                <MinusCircle size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="button p-1.5"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="button button-primary p-1.5"
          title={isAdmin ? 'Add/Remove Money' : 'Add Money'}
        >
          <PlusCircle size={16} />
        </button>
      )}
    </div>
  );
}