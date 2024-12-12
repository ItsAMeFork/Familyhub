import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ref, push, set } from 'firebase/database';
import { db } from '../../lib/firebase';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../lib/auth/useAuth';
import { MealCard } from './MealCard';

const CARD_COLORS = [
  'bg-[#F7F754]/20 hover:bg-[#F7F754]/30 shadow-lg shadow-[#F7F754]/20',
  'bg-[#B4F4F7]/20 hover:bg-[#B4F4F7]/30 shadow-lg shadow-[#B4F4F7]/20',
  'bg-[#B6F7B3]/20 hover:bg-[#B6F7B3]/30 shadow-lg shadow-[#B6F7B3]/20'
];

export function MealVote() {
  const { mealOptions = [], loading } = useStore();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const sortedMeals = React.useMemo(() => {
    return [...(mealOptions || [])].sort((a, b) => {
      const aVotes = Object.keys(a.votes || {}).length;
      const bVotes = Object.keys(b.votes || {}).length;
      return bVotes - aVotes;
    });
  }, [mealOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMeal.name.trim()) return;

    try {
      const mealsRef = ref(db, 'meals');
      await push(mealsRef, {
        ...newMeal,
        addedBy: user.uid,
        votes: {},
        createdAt: new Date().toISOString()
      });

      setNewMeal({
        name: '',
        description: '',
        imageUrl: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const handleVote = async (mealId: string) => {
    if (!user) return;

    try {
      const voteRef = ref(db, `meals/${mealId}/votes/${user.uid}`);
      const hasVoted = mealOptions.find(m => m.id === mealId)?.votes?.[user.uid];
      await set(voteRef, hasVoted ? null : true);
    } catch (error) {
      console.error('Error voting for meal:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h2 className="text-lg md:text-xl font-bold">Weekly Meal Vote</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="button button-primary p-2 rounded-full"
        >
          <Plus size={20} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Meal Name
            </label>
            <input
              type="text"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              className="input w-full"
              placeholder="e.g., Spaghetti Bolognese"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newMeal.description}
              onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
              className="input w-full"
              rows={2}
              placeholder="Brief description of the meal..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={newMeal.imageUrl}
              onChange={(e) => setNewMeal({ ...newMeal, imageUrl: e.target.value })}
              className="input w-full"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="button button-primary flex-1">
              Add Meal
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedMeals.map((meal, index) => {
          const hasVoted = meal.votes?.[user?.uid || ''] === true;
          const colorIndex = index % CARD_COLORS.length;
          
          return (
            <MealCard
              key={meal.id}
              meal={meal}
              hasVoted={hasVoted}
              onVote={() => handleVote(meal.id)}
              colorClass={CARD_COLORS[colorIndex]}
            />
          );
        })}
      </div>
    </div>
  );
}