import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../firebase';
import { initializeDefaultTasks } from '../tasks';
import { initializeStoreListeners } from '../../store/useStore';

const ADMIN_EMAIL = 'jessegorter@outlook.com';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user exists in database
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (!snapshot.exists()) {
          // First time user, create profile
          await set(userRef, {
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email,
            avatar: '👤',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });

          // Initialize default tasks for first user
          const usersRef = ref(db, 'users');
          const usersSnapshot = await get(usersRef);
          if (!usersSnapshot.exists()) {
            await initializeDefaultTasks();
          }

          // Set up admin if this is the admin email
          if (user.email === ADMIN_EMAIL) {
            const adminRef = ref(db, `admins/${user.uid}`);
            await set(adminRef, true);
          }
        } else {
          // Update last login
          await set(userRef, {
            ...snapshot.val(),
            lastLogin: new Date().toISOString()
          });

          // Ensure admin status for admin email
          if (user.email === ADMIN_EMAIL) {
            const adminRef = ref(db, `admins/${user.uid}`);
            const adminSnapshot = await get(adminRef);
            if (!adminSnapshot.exists()) {
              await set(adminRef, true);
            }
          }
        }

        // Initialize store listeners
        initializeStoreListeners();
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setError(null);
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      setUser(result.user);
      setError(null);
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setError(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message);
    }
  };

  return { user, loading, error, signIn, signUp, signOut, setError };
}