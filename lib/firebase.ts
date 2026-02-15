import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../config';

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();

// Access Auth and Firestore after initialization
export const auth = getAuth(app);
export const db = getFirestore(app);