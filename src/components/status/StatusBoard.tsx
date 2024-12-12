import React from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../lib/auth/useAuth';
import { MealVote } from '../meals/MealVote';
import { MealBudget } from '../meals/MealBudget';

export function StatusBoard() {
  const { familyMembers, mealOptions, loading } = useStore();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const getVoteStatus = (memberId: string) => {
    return mealOptions.some(meal => meal.votes && meal.votes[memberId]);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="card">
        <h2 className="text-lg md:text-xl font-bold mb-4">Family Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member) => {
            const hasVoted = getVoteStatus(member.id);
            return (
              <div
                key={member.id}
                className={`card bg-gray-700/50 flex items-center gap-3 ${
                  member.id === user?.uid ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                <div className="text-3xl">{member.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{member.name}</h3>
                  <p className={`text-sm ${hasVoted ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {hasVoted ? '✓ Has voted' : '○ No vote yet'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="mb-6">
          <MealBudget />
        </div>
        <MealVote />
      </div>
    </div>
  );
}