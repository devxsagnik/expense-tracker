import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '@/lib/types/user';

export const getUserData = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
  return null;
};