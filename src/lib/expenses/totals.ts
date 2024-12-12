import { ref, get, update } from 'firebase/database';
import { db } from '../firebase';

export async function updateUserExpenseTotal(userId: string, amount: number) {
  try {
    const userExpensesRef = ref(db, `userExpenses/${userId}`);
    const snapshot = await get(userExpensesRef);
    const currentTotal = snapshot.exists() ? snapshot.val().totalPaid || 0 : 0;
    
    await update(userExpensesRef, {
      totalPaid: currentTotal + amount,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user expense total:', error);
    throw error;
  }
}