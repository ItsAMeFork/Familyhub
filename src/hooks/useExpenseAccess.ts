import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { useAdmin } from '../lib/admin/useAdmin';

export function useExpenseAccess() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (!user) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    // Admins always have access
    if (isAdmin) {
      setHasAccess(true);
      setLoading(false);
      return;
    }

    // Check for expense invites
    const invitesRef = ref(db, 'expenseInvites');
    const unsubscribe = onValue(invitesRef, (snapshot) => {
      if (snapshot.exists()) {
        const invites = Object.values(snapshot.val());
        const hasInvite = invites.some((invite: any) => 
          invite.invitedUserId === user.uid && 
          invite.status === 'accepted'
        );
        setHasAccess(hasInvite);
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  return { hasAccess, loading };
}