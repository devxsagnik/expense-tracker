import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4G5O1-OwE7EIizyonJnk2jAuMwJbtYNQ",
  authDomain: "expense-tracker-b9807.firebaseapp.com",
  projectId: "expense-tracker-b9807",
  storageBucket: "expense-tracker-b9807.firebasestorage.app",
  messagingSenderId: "147930303616",
  appId: "1:147930303616:web:43128a988f09fe9189ea65
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
