import React from 'react';
import { useStore } from '../../store/useStore';
import { ExpenseCard } from './ExpenseCard';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseSummary } from './ExpenseSummary';
import { Plus } from 'lucide-react';

export function ExpenseList() {
  const { expenses = [], loading } = useStore();
  const [showForm, setShowForm] = React.useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const sortedExpenses = [...expenses].sort((a, b) => {
    // Sort by paid status first
    if (a.paidAt && !b.paidAt) return 1;
    if (!a.paidAt && b.paidAt) return -1;
    
    // Then by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg md:text-xl font-bold">Expenses</h2>
          <p className="text-gray-400 text-sm">Track and manage household expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="button button-primary p-2 rounded-full"
        >
          <Plus size={20} />
        </button>
      </div>

      <ExpenseSummary />

      {showForm && (
        <ExpenseForm onClose={() => setShowForm(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedExpenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
        {expenses.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400">
            No expenses yet. Add your first expense!
          </div>
        )}
      </div>
    </div>
  );
}