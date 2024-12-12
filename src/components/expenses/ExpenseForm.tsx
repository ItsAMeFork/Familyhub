import React from 'react';
import { useAuth } from '../../lib/auth/useAuth';
import { addExpense } from '../../lib/expenses';

interface ExpenseFormProps {
  onClose: () => void;
}

export function ExpenseForm({ onClose }: ExpenseFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [expense, setExpense] = React.useState({
    title: '',
    amount: '',
    dueDate: '',
    description: '',
    category: '',
    recurringType: 'one-time' as 'monthly' | 'one-time'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;

    const amount = parseFloat(expense.amount);
    if (isNaN(amount) || amount <= 0) return;

    setLoading(true);
    try {
      await addExpense({
        title: expense.title,
        amount,
        dueDate: expense.dueDate,
        description: expense.description,
        category: expense.category,
        addedBy: user.uid,
        createdAt: new Date().toISOString(),
        isRecurring: expense.recurringType === 'monthly',
        recurringType: expense.recurringType
      });
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={expense.title}
          onChange={(e) => setExpense({ ...expense, title: e.target.value })}
          className="input w-full"
          placeholder="e.g., Electricity Bill"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Amount (€)
          </label>
          <input
            type="number"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            className="input w-full"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={expense.dueDate}
            onChange={(e) => setExpense({ ...expense, dueDate: e.target.value })}
            className="input w-full"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Recurring Type
        </label>
        <select
          value={expense.recurringType}
          onChange={(e) => setExpense({ ...expense, recurringType: e.target.value as 'monthly' | 'one-time' })}
          className="input w-full"
          required
        >
          <option value="one-time">One-time</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description (optional)
        </label>
        <textarea
          value={expense.description}
          onChange={(e) => setExpense({ ...expense, description: e.target.value })}
          className="input w-full"
          rows={2}
          placeholder="Add any additional details..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Category (optional)
        </label>
        <select
          value={expense.category}
          onChange={(e) => setExpense({ ...expense, category: e.target.value })}
          className="input w-full"
        >
          <option value="">Select a category</option>
          <option value="utilities">Utilities</option>
          <option value="groceries">Groceries</option>
          <option value="rent">Rent</option>
          <option value="maintenance">Maintenance</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="button button-primary flex-1"
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="button"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}