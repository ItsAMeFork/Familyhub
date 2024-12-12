import { ref, get, set, remove } from 'firebase/database';
import { db } from '../firebase';

export async function addAdminUser(email: string) {
  try {
    // First, find the user by email
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      throw new Error('No users found');
    }

    let userId: string | null = null;
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      if (userData.email === email) {
        userId = childSnapshot.key;
      }
    });

    if (!userId) {
      throw new Error('User not found');
    }

    // Add the user to admins
    const adminRef = ref(db, `admins/${userId}`);
    await set(adminRef, true);

    return true;
  } catch (error) {
    console.error('Error adding admin user:', error);
    throw error;
  }
}

export async function removeAdminUser(userId: string) {
  try {
    const adminRef = ref(db, `admins/${userId}`);
    await remove(adminRef);
    return true;
  } catch (error) {
    console.error('Error removing admin user:', error);
    throw error;
  }
}

// Initialize default admin
export async function initializeDefaultAdmin() {
  try {
    await addAdminUser('jessegorter@outlook.com');
    console.log('Default admin initialized successfully');
  } catch (error) {
    console.error('Error initializing default admin:', error);
  }
}