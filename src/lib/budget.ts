import { ref, push, set } from 'firebase/database';
import { db } from './firebase';

interface BudgetTransaction {
  amount: number;
  type: 'add' | 'remove';
  userId: string;
  timestamp: string;
}

export async function addBudgetTransaction(transaction: BudgetTransaction) {
  try {
    const transactionRef = push(ref(db, 'budgetTransactions'));
    await set(transactionRef, transaction);
    return true;
  } catch (error) {
    console.error('Error adding budget transaction:', error);
    throw error;
  }
}