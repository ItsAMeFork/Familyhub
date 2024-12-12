import { create } from 'zustand';
import { ref, onValue, update, get, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { 
  Task, 
  FamilyMember, 
  MealOption, 
  CalendarEvent, 
  Notification,
  Expense,
  ExpenseInvite,
  BudgetTransaction,
  WeeklyBudget
} from '../types';

interface Store {
  // Data
  familyMembers: FamilyMember[];
  mealOptions: MealOption[];
  tasks: Task[];
  events: CalendarEvent[];
  notifications: Notification[];
  expenses: Expense[];
  expenseInvites: ExpenseInvite[];
  budgetTransactions: BudgetTransaction[];
  weeklyBudget: WeeklyBudget | null;
  loading: boolean;

  // Actions
  voteMeal: (mealId: string, userId: string) => Promise<void>;
  addMealOption: (meal: Omit<MealOption, 'id' | 'votes'>) => Promise<void>;
  assignTask: (taskId: string, memberId: string | null) => Promise<void>;
  updateTaskStatus: (taskId: string, status: 'todo' | 'doing' | 'done') => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  familyMembers: [],
  mealOptions: [],
  tasks: [],
  events: [],
  notifications: [],
  expenses: [],
  expenseInvites: [],
  budgetTransactions: [],
  weeklyBudget: null,
  loading: true,

  voteMeal: async (mealId, userId) => {
    try {
      const voteRef = ref(db, `meals/${mealId}/votes/${userId}`);
      const snapshot = await get(voteRef);
      await set(voteRef, snapshot.exists() ? null : true);
    } catch (error) {
      console.error('Error voting for meal:', error);
    }
  },

  addMealOption: async (meal) => {
    try {
      const mealRef = ref(db, 'meals');
      await set(mealRef, {
        ...meal,
        votes: {},
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  },

  assignTask: async (taskId, memberId) => {
    try {
      await update(ref(db, `tasks/${taskId}`), {
        assignedTo: memberId
      });
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const updates: any = { status };
      if (status === 'done') {
        updates.lastCompletedAt = new Date().toISOString();
      }
      await update(ref(db, `tasks/${taskId}`), updates);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }
}));

// Initialize database listeners
export function initializeStoreListeners() {
  // Users listener
  onValue(ref(db, 'users'), (snapshot) => {
    if (snapshot.exists()) {
      const users = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        ...data
      }));
      useStore.setState({ familyMembers: users });
    }
  });

  // Meals listener
  onValue(ref(db, 'meals'), (snapshot) => {
    if (snapshot.exists()) {
      const meals = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        ...data,
        votes: data.votes || {}
      }));
      useStore.setState({ mealOptions: meals });
    } else {
      useStore.setState({ mealOptions: [] });
    }
  });

  // Tasks listener
  onValue(ref(db, 'tasks'), (snapshot) => {
    if (snapshot.exists()) {
      const tasks = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        ...data
      }));
      useStore.setState({ tasks });
    } else {
      useStore.setState({ tasks: [] });
    }
  });

  // Events listener
  onValue(ref(db, 'events'), (snapshot) => {
    if (snapshot.exists()) {
      const events = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        ...data,
        attendees: data.attendees || {}
      }));
      useStore.setState({ events });
    } else {
      useStore.setState({ events: [] });
    }
  });

  // Expenses listener
  onValue(ref(db, 'expenses'), (snapshot) => {
    if (snapshot.exists()) {
      const expenses = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        ...data
      }));
      useStore.setState({ expenses });
    } else {
      useStore.setState({ expenses: [] });
    }
  });

  // Expense invites listener
  onValue(ref(db, 'expenseInvites'), (snapshot) => {
    if (snapshot.exists()) {
      const invites = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        ...data
      }));
      useStore.setState({ expenseInvites: invites });
    } else {
      useStore.setState({ expenseInvites: [] });
    }
  });

  // Budget transactions listener
  onValue(ref(db, 'budgetTransactions'), (snapshot) => {
    if (snapshot.exists()) {
      const transactions = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        ...data
      }));
      useStore.setState({ budgetTransactions: transactions });
    } else {
      useStore.setState({ budgetTransactions: [] });
    }
  });

  // Weekly budget listener
  onValue(ref(db, 'weeklyBudget'), (snapshot) => {
    if (snapshot.exists()) {
      useStore.setState({ weeklyBudget: snapshot.val() });
    } else {
      // Initialize with default budget
      set(ref(db, 'weeklyBudget'), {
        amount: 60,
        lastUpdated: new Date().toISOString()
      });
    }
  });

  // Set loading to false once all listeners are initialized
  useStore.setState({ loading: false });
}