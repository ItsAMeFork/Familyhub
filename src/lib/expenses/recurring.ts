import { addMonths, isSameMonth } from 'date-fns';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import { Expense } from '../../types';
import { addExpense } from './core';

export async function handleRecurringExpense(expense: Expense) {
  if (!expense.isRecurring || expense.recurringType !== 'monthly') return;

  try {
    const nextMonth = addMonths(new Date(expense.dueDate), 1);
    
    // Check if next month's expense already exists
    const existingExpensesRef = ref(db, 'expenses');
    const snapshot = await get(existingExpensesRef);
    const existingExpenses = snapshot.val() || {};
    
    const hasNextMonthExpense = Object.values(existingExpenses).some((e: any) => 
      e.title === expense.title && 
      e.addedBy === expense.addedBy &&
      isSameMonth(new Date(e.dueDate), nextMonth)
    );

    if (!hasNextMonthExpense) {
      await addExpense({
        ...expense,
        dueDate: nextMonth.toISOString().split('T')[0],
        paidBy: undefined,
        paidAt: undefined,
        createdAt: new Date().toISOString(),
        lastRecurringReset: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error handling recurring expense:', error);
    throw error;
  }
}