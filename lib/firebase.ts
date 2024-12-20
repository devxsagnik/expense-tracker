import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLWKiUjUqTgKzn4i-KBLbSNrtfHzDNpi8",
  authDomain: "expensetracker-c09de.firebaseapp.com",
  projectId: "expensetracker-c09de",
  storageBucket: "expensetracker-c09de.firebasestorage.app",
  messagingSenderId: "262444873384",
  appId: "1:262444873384:web:123fc9a57312588d9ef49d",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };