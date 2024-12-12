import { ref, remove } from 'firebase/database';
import { db } from './firebase';

export async function removeMeal(mealId: string) {
  try {
    await remove(ref(db, `meals/${mealId}`));
    return true;
  } catch (error) {
    console.error('Error removing meal:', error);
    throw error;
  }
}