import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { DailyExpense, DailyExpenseFormData } from '@/lib/types/expense';

export const addDailyExpense = async (userId: string, data: DailyExpenseFormData) => {
  const expenseData: Omit<DailyExpense, 'id'> = {
    userId,
    description: data.description,
    category: data.category,
    amount: parseFloat(data.amount),
    recurringDays: data.recurringDays,
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'daily_expenses'), expenseData);
  return { id: docRef.id, ...expenseData };
};

export const getDailyExpenses = async (userId: string): Promise<DailyExpense[]> => {
  const q = query(collection(db, 'daily_expenses'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as DailyExpense));
};

export const deleteDailyExpense = async (expenseId: string) => {
  await deleteDoc(doc(db, 'daily_expenses', expenseId));
};

export const editDailyExpense = async (expenseId: string, data: any) => {
  const expenseRef = doc(db, 'daily_expenses', expenseId);
  await updateDoc(expenseRef, {
    description: data.description,
    amount: parseFloat(data.amount),
    recurringDays: data.recurringDays
  });
};

export const calculateMonthlyTotal = (expenses: DailyExpense[]): number => {
  return expenses.reduce((total, expense) => {
    // Calculate how many times this expense occurs in a month
    const daysPerMonth = 30; // Average month length
    const occurrencesPerMonth = (expense.recurringDays.length * daysPerMonth) / 7;
    return total + (expense.amount * occurrencesPerMonth);
  }, 0);
};

export function calculateRemainingBudget(monthlyBudget: number, expenses: DailyExpense[]): number {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  let totalDeductions = 0;
  
  for (let day = 1; day <= lastDayOfMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    
    expenses.forEach(expense => {
      if (expense.recurringDays.includes(dayOfWeek)) {
        if (day <= today.getDate()) {
          // Past or current day - deduct expense
          totalDeductions += expense.amount;
        }
      }
    });
  }
  
  return monthlyBudget - totalDeductions;
}