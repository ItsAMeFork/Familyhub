import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus } from 'lucide-react';
import { MealOption } from '../../types';
import { useAuth } from '../../lib/auth/useAuth';

export function ShoppingList() {
  const { mealOptions, addMealOption, voteMeal, familyMembers, loading } = useStore();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newMeal, setNewMeal] = useState<Omit<MealOption, 'id' | 'votes'>>({
    name: '',
    description: '',
    addedBy: user?.uid || '',
    imageUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeal.name) return;

    addMealOption({
      ...newMeal,
      addedBy: user?.uid || '',
    });

    setNewMeal({
      name: '',
      description: '',
      addedBy: user?.uid || '',
      imageUrl: '',
    });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold">Weekly Meal Vote</h2>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">Vote for your favorite meals this week</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="button button-primary p-1.5 md:p-2 rounded-full"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
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
              <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
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
              <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
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
                Add Meal Option
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 pb-24">
        {mealOptions.map((meal) => {
          const hasVoted = meal.votes.includes(user?.uid || '');
          return (
            <button
              key={meal.id}
              onClick={() => voteMeal(meal.id, user?.uid || '')}
              className={`card overflow-hidden text-left transition-all duration-200 ${
                hasVoted ? 'ring-2 ring-emerald-500 bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              {meal.imageUrl && (
                <div className="h-32 md:h-40 -mx-3 -mt-3 md:-mx-4 md:-mt-4 mb-3">
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-2 md:space-y-3">
                <div>
                  <h3 className="text-base md:text-lg font-bold">{meal.name}</h3>
                  <p className="text-gray-300 text-xs md:text-sm mt-0.5">{meal.description}</p>
                </div>
                <div className="flex -space-x-1.5">
                  {meal.votes.map((voterId) => {
                    const voter = familyMembers.find((m) => m.id === voterId);
                    return (
                      <div
                        key={voterId}
                        className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-gray-800"
                        title={voter?.name}
                      >
                        <span>{voter?.avatar}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}