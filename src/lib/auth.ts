import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signInWithRedirect,
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from './firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set persistence to LOCAL (survives browser restart)
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Check for redirect result
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setUser(result.user);
      }
    }).catch((error) => {
      if (error.code !== 'auth/redirect-cancelled-by-user') {
        console.error('Redirect error:', error);
        setError('An error occurred during sign in. Please try again.');
      }
    }).finally(() => {
      setSigningIn(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (useRedirect = false) => {
    setError(null);
    setSigningIn(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, provider);
        // Don't reset signingIn here as we're redirecting
      } else {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
        setSigningIn(false);
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      if (error.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, provider);
          // Don't reset signingIn here as we're redirecting
        } catch (redirectError) {
          setError('Unable to sign in. Please check your popup blocker settings or try using redirect sign-in.');
          setSigningIn(false);
        }
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError(null); // User cancelled, no need for error
        setSigningIn(false);
      } else {
        setError('An error occurred while signing in. Please try again.');
        setSigningIn(false);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('An error occurred while signing out. Please try again.');
    }
  };

  return { user, loading, signingIn, error, signIn, signOut };
}