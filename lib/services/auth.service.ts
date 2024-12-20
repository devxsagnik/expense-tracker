import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
  updateProfile as updateFirebaseProfile,
  updateEmail,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { UserFormData } from '@/lib/types/user';

export const signIn = async (email: string, password: string) => {
  await setPersistence(auth, browserLocalPersistence);
  return firebaseSignIn(auth, email, password);
};

export const register = async (formData: UserFormData) => {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    formData.email,
    formData.password
  );

  await setDoc(doc(db, 'users', userCredential.user.uid), {
    name: formData.name,
    age: parseInt(formData.age),
    email: formData.email,
    monthlyBudget: parseFloat(formData.budget),
    createdAt: new Date().toISOString()
  });

  return userCredential;
};

export const signOut = async () => {
  return firebaseSignOut(auth);
};

export async function updateProfile(userData: {
  name?: string;
  email?: string;
  monthlyBudget?: number;
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No user logged in');

    if (userData.name) {
      await updateFirebaseProfile(currentUser, { displayName: userData.name });
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: userData.name,
      });
    }

    if (userData.monthlyBudget) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        monthlyBudget: userData.monthlyBudget,
      });
    }

    if (userData.email) {
      await updateEmail(currentUser, userData.email);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        email: userData.email,
      });
    }

    if (userData.newPassword) {
      await updatePassword(currentUser, userData.newPassword);
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}