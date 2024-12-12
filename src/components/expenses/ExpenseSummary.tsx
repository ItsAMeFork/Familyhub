import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useExpenseAccess } from '../../hooks/useExpenseAccess';

export function ExpenseSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const { familyMembers, expenses, expenseInvites } = useStore();
  const { hasAccess } = useExpenseAccess();

  // Only show members who have access to expenses
  const accessibleMembers = familyMembers.filter(member => 
    expenseInvites.some(invite => 
      invite.invitedUserId === member.id && 
      invite.status === 'accepted'
    )
  );

  const memberTotals = accessibleMembers.map(member => {
    const paidExpenses = expenses.filter(e => e.paidBy === member.id);
    const totalPaid = paidExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      ...member,
      totalPaid,
      expenseCount: paidExpenses.length
    };
  }).sort((a, b) => b.totalPaid - a.totalPaid);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = expenses.filter(e => e.paidBy).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="card bg-gray-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-baseline gap-2">
          <h3 className="font-medium">Payment Summary</h3>
          <span className="text-sm text-gray-400">
            €{totalPaid.toFixed(2)} of €{totalExpenses.toFixed(2)} paid
          </span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {memberTotals.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{member.avatar}</span>
                <span>{member.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">€{member.totalPaid.toFixed(2)}</div>
                <div className="text-sm text-gray-400">
                  {member.expenseCount} {member.expenseCount === 1 ? 'expense' : 'expenses'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}