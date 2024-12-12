import { ref, push, update, get } from 'firebase/database';
import { db } from '../firebase';
import { createNotification } from '../notifications';

export async function inviteToExpense(userId: string, invitedBy: string) {
  try {
    // Create invite
    const inviteRef = push(ref(db, 'expenseInvites'));
    await update(inviteRef, {
      id: inviteRef.key,
      invitedBy,
      invitedUserId: userId,
      status: 'accepted', // Auto-accept for now
      createdAt: new Date().toISOString()
    });

    // Get user details for notification
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    // Create notification
    await createNotification(userId, {
      title: 'Expense Access Granted',
      message: 'You now have access to view and manage expenses',
      type: 'expense_invite'
    });

    return true;
  } catch (error) {
    console.error('Error inviting to expenses:', error);
    throw error;
  }
}

export async function removeExpenseAccess(userId: string) {
  try {
    // Find and remove all invites for this user
    const invitesRef = ref(db, 'expenseInvites');
    const snapshot = await get(invitesRef);
    
    if (snapshot.exists()) {
      const updates: Record<string, null> = {};
      
      snapshot.forEach((child) => {
        const invite = child.val();
        if (invite.invitedUserId === userId) {
          updates[child.key!] = null;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(invitesRef, updates);
      }
    }

    return true;
  } catch (error) {
    console.error('Error removing expense access:', error);
    throw error;
  }
}