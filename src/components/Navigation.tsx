import React from 'react';
import { UtensilsCrossed, Calendar, ClipboardList, Receipt } from 'lucide-react';
import { NavButton } from './ui/NavButton';
import { useExpenseAccess } from '../hooks/useExpenseAccess';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const { hasAccess } = useExpenseAccess();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-t-2xl md:rounded-t-4xl bg-gray-900">
            <div className="px-3 md:px-4 py-2 md:py-3">
              <div className="flex justify-around items-center">
                <NavButton
                  icon={<UtensilsCrossed size={20} className="md:w-6 md:h-6" />}
                  label="Status"
                  isActive={activeTab === 'status'}
                  onClick={() => setActiveTab('status')}
                />
                <NavButton
                  icon={<Calendar size={20} className="md:w-6 md:h-6" />}
                  label="Calendar"
                  isActive={activeTab === 'calendar'}
                  onClick={() => setActiveTab('calendar')}
                />
                <NavButton
                  icon={<ClipboardList size={20} className="md:w-6 md:h-6" />}
                  label="Tasks"
                  isActive={activeTab === 'tasks'}
                  onClick={() => setActiveTab('tasks')}
                />
                {hasAccess && (
                  <NavButton
                    icon={<Receipt size={20} className="md:w-6 md:h-6" />}
                    label="Expenses"
                    isActive={activeTab === 'expenses'}
                    onClick={() => setActiveTab('expenses')}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}