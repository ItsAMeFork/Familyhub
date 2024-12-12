import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/auth';

export function useUserAvatar() {
  const [userAvatar, setUserAvatar] = useState('👤');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserAvatar(userData.avatar || '👤');
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  return { userAvatar };
}