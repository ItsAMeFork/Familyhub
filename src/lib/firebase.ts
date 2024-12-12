import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDUc4C6jU5NdoFtwtSJmUMKdYVmagphgMA",
  authDomain: "huisapp-a6724.firebaseapp.com",
  projectId: "huisapp-a6724",
  storageBucket: "huisapp-a6724.firebasestorage.app",
  messagingSenderId: "467400512199",
  appId: "1:467400512199:web:68588baf56b529392c64e2",
  measurementId: "G-5R120KXDKT",
  databaseURL: "https://huisapp-a6724-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);