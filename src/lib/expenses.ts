import { ref, push, update, get, set } from 'firebase/database';
import { db } from './firebase';
import { Expense } from '../types';
import { createNotification } from './notifications';
import { addMonths, isSameMonth, startOfMonth } from 'date-fns';

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
    const expenseSnapshot = await get(expenseRef);
    const expense = expenseSnapshot.val() as Expense;

    // Mark as paid
    await update(expenseRef, {
      paidBy: userId,
      paidAt: new Date().toISOString()
    });

    // Add to user's total paid amount
    const userExpensesRef = ref(db, `userExpenses/${userId}`);
    const snapshot = await get(userExpensesRef);
    const currentTotal = snapshot.exists() ? snapshot.val().totalPaid || 0 : 0;
    
    await update(ref(db, `userExpenses/${userId}`), {
      totalPaid: currentTotal + expense.amount,
      lastUpdated: new Date().toISOString()
    });

    // If this is a monthly expense and it's been paid, check if we need to create next month's expense
    if (expense.isRecurring && expense.recurringType === 'monthly') {
      const nextMonth = addMonths(new Date(expense.dueDate), 1);
      
      // Only create next month's expense if it doesn't exist yet
      const existingExpensesRef = ref(db, 'expenses');
      const existingExpensesSnapshot = await get(existingExpensesRef);
      const existingExpenses = existingExpensesSnapshot.val() || {};
      
      const hasNextMonthExpense = Object.values(existingExpenses).some((e: any) => 
        e.title === expense.title && 
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
    }

    return true;
  } catch (error) {
    console.error('Error marking expense as paid:', error);
    throw error;
  }
}

export async function inviteToExpense(expenseId: string, invitedUserId: string, invitedBy: string) {
  try {
    // Create invite
    const inviteRef = push(ref(db, 'expenseInvites'));
    await update(inviteRef, {
      id: inviteRef.key,
      expenseId,
      invitedBy,
      invitedUserId,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Get expense details for notification
    const expenseRef = ref(db, `expenses/${expenseId}`);
    const expenseSnapshot = await get(expenseRef);
    const expense = expenseSnapshot.val();

    // Create notification
    await createNotification(invitedUserId, {
      title: 'New Expense Invite',
      message: `You've been invited to view expense: ${expense.title}`,
      type: 'expense_invite',
      expenseId
    });

    return true;
  } catch (error) {
    console.error('Error inviting to expense:', error);
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