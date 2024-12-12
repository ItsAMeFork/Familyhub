import React from 'react';
import { Trash2 } from 'lucide-react';
import { MealOption } from '../../types';
import { useStore } from '../../store/useStore';
import { useAdmin } from '../../lib/admin/useAdmin';
import { removeMeal } from '../../lib/meals';

interface MealCardProps {
  meal: MealOption;
  hasVoted: boolean;
  onVote: () => void;
  colorClass: string;
}

export function MealCard({ meal, hasVoted, onVote, colorClass }: MealCardProps) {
  const { familyMembers } = useStore();
  const { isAdmin } = useAdmin();
  const voteCount = Object.keys(meal.votes || {}).length;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent vote trigger
    if (!window.confirm('Are you sure you want to remove this meal?')) return;
    
    try {
      await removeMeal(meal.id);
    } catch (error) {
      console.error('Error removing meal:', error);
    }
  };

  return (
    <div
      onClick={onVote}
      className={`card text-left transition-all cursor-pointer ${colorClass} ${
        hasVoted ? 'ring-2 ring-emerald-500' : ''
      }`}
    >
      {meal.imageUrl && (
        <div className="h-32 -mx-3 -mt-3 md:-mx-4 md:-mt-4 mb-3 rounded-t-xl overflow-hidden">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{meal.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium bg-gray-900/50 px-2 py-1 rounded-full">
                {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
              </span>
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/20"
                  title="Remove Meal"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          {meal.description && (
            <p className="text-gray-300 text-sm mt-1">{meal.description}</p>
          )}
        </div>
        <div className="flex -space-x-2">
          {Object.keys(meal.votes || {}).map((voterId) => {
            const voter = familyMembers.find((m) => m.id === voterId);
            return voter ? (
              <div
                key={voterId}
                className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center ring-2 ring-white"
                title={voter.name}
              >
                <span>{voter.avatar}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}