import React, { useState } from 'react';
import { X, Shield, Trash2, Calendar, Receipt } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../lib/auth/useAuth';
import { removeMeal } from '../../lib/meals';
import { removeEvent } from '../../lib/events';
import { removeExpense } from '../../lib/expenses';
import { UserExpenseAccess } from './UserExpenseAccess';
import { AdminIndicator } from './AdminIndicator';
import { useAdminList } from '../../hooks/useAdminList';
import { format } from 'date-fns';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('users');
  const { familyMembers, mealOptions, events, expenses, expenseInvites } = useStore();
  const { adminUsers } = useAdminList();
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleRemoveMeal = async (mealId: string) => {
    try {
      await removeMeal(mealId);
    } catch (error) {
      console.error('Error removing meal:', error);
    }
  };

  const handleRemoveEvent = async (eventId: string) => {
    try {
      await removeEvent(eventId);
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  const handleRemoveExpense = async (expenseId: string) => {
    try {
      await removeExpense(expenseId);
    } catch (error) {
      console.error('Error removing expense:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Admin Settings</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:text-gray-400 transition-colors rounded-lg hover:bg-gray-700/50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'users' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'meals' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400'
            }`}
          >
            Meals
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'calendar' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'expenses' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400'
            }`}
          >
            Expenses
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'users' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Manage Users</h3>
              </div>
              {familyMembers.map((member) => {
                const hasAccess = expenseInvites.some(invite => 
                  invite.invitedUserId === member.id && 
                  invite.status === 'accepted'
                );
                const isUserAdmin = adminUsers.includes(member.id);
                
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{member.avatar}</span>
                      <div>
                        <span>{member.name}</span>
                        {hasAccess && (
                          <span className="ml-2 text-xs text-emerald-400">Has expense access</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserExpenseAccess
                        userId={member.id}
                        hasAccess={hasAccess}
                        onUpdate={() => {}} // State updates automatically through Firebase listeners
                      />
                      <AdminIndicator
                        userId={member.id}
                        email={member.email}
                        isUserAdmin={isUserAdmin}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'meals' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Manage Meals</h3>
              </div>
              {mealOptions.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="font-medium">{meal.name}</span>
                      <span className="ml-2 text-sm text-gray-400">
                        {Object.keys(meal.votes || {}).length} votes
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMeal(meal.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-500/20 text-red-300"
                    title="Remove Meal"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Manage Calendar Events</h3>
              </div>
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{event.title}</span>
                      <span className="text-sm text-gray-400">
                        {format(new Date(event.start), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-400 truncate">{event.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveEvent(event.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-500/20 text-red-300 ml-2"
                    title="Remove Event"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  No calendar events found
                </div>
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Manage Expenses</h3>
              </div>
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{expense.title}</span>
                      <span className="text-emerald-400 font-medium">
                        €{expense.amount.toFixed(2)}
                      </span>
                      {expense.isRecurring && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                          Monthly
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      Due {format(new Date(expense.dueDate), 'MMM d')}
                      {expense.paidAt && ` • Paid on ${format(new Date(expense.paidAt), 'MMM d')}`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveExpense(expense.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-500/20 text-red-300 ml-2"
                    title="Remove Expense"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  No expenses found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}