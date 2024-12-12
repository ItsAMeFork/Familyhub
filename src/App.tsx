import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Calendar } from './components/calendar/Calendar';
import { TaskBoard } from './components/tasks/TaskBoard';
import { NotificationsDropdown } from './components/header/NotificationsDropdown';
import { AccountDropdown } from './components/header/AccountDropdown';
import { AuthGuard } from './components/auth/AuthGuard';
import { StatusBoard } from './components/status/StatusBoard';
import { ExpenseList } from './components/expenses/ExpenseList';
import { useExpenseAccess } from './hooks/useExpenseAccess';

export default function App() {
  const [activeTab, setActiveTab] = useState('status');
  const { hasAccess } = useExpenseAccess();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-5xl mx-auto px-3 md:px-4 pb-24">
          <header className="py-3 md:py-4 mb-3 md:mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold text-gray-100">Family Hub</h1>
              <div className="flex items-center gap-2 md:gap-3">
                <NotificationsDropdown />
                <AccountDropdown />
              </div>
            </div>
          </header>

          <main className="space-y-3 md:space-y-4">
            {activeTab === 'status' && <StatusBoard />}
            {activeTab === 'calendar' && <Calendar />}
            {activeTab === 'tasks' && <TaskBoard />}
            {activeTab === 'expenses' && hasAccess && <ExpenseList />}
          </main>
        </div>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </AuthGuard>
  );
}