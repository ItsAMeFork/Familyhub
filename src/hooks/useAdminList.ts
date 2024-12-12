import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';

export function useAdminList() {
  const [adminUsers, setAdminUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminsRef = ref(db, 'admins');
    const unsubscribe = onValue(adminsRef, (snapshot) => {
      if (snapshot.exists()) {
        const admins = Object.entries(snapshot.val())
          .filter(([_, value]) => value === true)
          .map(([key]) => key);
        setAdminUsers(admins);
      } else {
        setAdminUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { adminUsers, loading };
}