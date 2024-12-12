import { getAnalytics } from 'firebase/analytics';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from './config';
import { initializeDefaultAdmin } from '../admin';

export const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);

// Initialize database listeners
export const initializeDatabase = async (callback: (initialized: boolean) => void) => {
  const dbRef = ref(db);
  
  try {
    // Initialize default admin
    await initializeDefaultAdmin();
    
    onValue(dbRef, () => {
      console.log('Database connection established');
      callback(true);
    }, (error) => {
      console.error('Database connection error:', error);
      callback(false);
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    callback(false);
  }
};