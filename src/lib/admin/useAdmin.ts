import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../auth/useAuth';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const adminRef = ref(db, `admins/${user.uid}`);
    const unsubscribe = onValue(adminRef, (snapshot) => {
      setIsAdmin(snapshot.exists() && snapshot.val() === true);
      setLoading(false);
    }, (error) => {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { isAdmin, loading };
}