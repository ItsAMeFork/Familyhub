import { ref, push, update, get, set } from 'firebase/database';
import { db } from '../firebase';
import { Expense } from '../../types';
import { handleRecurringExpense } from './recurring';
import { updateUserExpenseTotal } from './totals';

export async function addExpense(expense: Omit<Expense, 'id'>) {
  try {
    const expenseRef = push(ref(db, 'expenses'));
    await update(expenseRef, {
      ...expense,
      id: expenseRef.key
    });
    return expenseRef.key;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

export async function markExpenseAsPaid(expenseId: string, userId: string) {
  try {
    const expenseRef = ref(db, `expenses/${expenseId}`);
    const snapshot = await get(expenseRef);
    const expense = snapshot.val() as Expense;

    // Mark as paid
    await update(expenseRef, {
      paidBy: userId,
      paidAt: new Date().toISOString()
    });

    // Update user's total and handle recurring logic
    await Promise.all([
      updateUserExpenseTotal(userId, expense.amount),
      handleRecurringExpense(expense)
    ]);

    return true;
  } catch (error) {
    console.error('Error marking expense as paid:', error);
    throw error;
  }
}

export async function removeExpense(expenseId: string) {
  try {
    await set(ref(db, `expenses/${expenseId}`), null);
    return true;
  } catch (error) {
    console.error('Error removing expense:', error);
    throw error;
  }
}