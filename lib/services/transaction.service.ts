import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  deleteDoc,
  orderBy,
  startAt,
  endAt,
  Timestamp 
} from 'firebase/firestore';
import { Transaction, TransactionFormData, MonthlyReport } from '@/lib/types/transaction';
import { startOfMonth, endOfMonth } from 'date-fns';
import { DailyExpense } from '@/lib/types/expense';

export const addTransaction = async (userId: string, data: TransactionFormData) => {
  const transactionData: Omit<Transaction, 'id'> = {
    userId,
    description: data.description,
    amount: parseFloat(data.amount),
    category: data.category,
    date: data.date,
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'transactions'), transactionData);
  return { id: docRef.id, ...transactionData };
};

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  // Simple query without date ordering to avoid index requirement
  const q = query(
    collection(db, 'transactions'), 
    where('userId', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const transactions = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Transaction));

  // Sort in memory for now
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const deleteTransaction = async (transactionId: string) => {
  await deleteDoc(doc(db, 'transactions', transactionId));
};

export const getMonthlyReport = async (
  userId: string, 
  monthDate: Date,
  monthlyBudget: number
): Promise<MonthlyReport> => {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);

  // Simple query without complex ordering
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    where('date', '>=', start.toISOString()),
    where('date', '<=', end.toISOString())
  );

  const querySnapshot = await getDocs(q);
  const transactions = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Transaction));

  const categoryBreakdown: { [key: string]: number } = {};
  let totalSpent = 0;

  transactions.forEach(transaction => {
    totalSpent += transaction.amount;
    categoryBreakdown[transaction.category] = (categoryBreakdown[transaction.category] || 0) + transaction.amount;
  });

  return {
    totalSpent,
    remainingBudget: monthlyBudget - totalSpent > 0 ? monthlyBudget - totalSpent : 0,
    categoryBreakdown,
    transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  };
};

export const createTransaction = async (
  userId: string, 
  expense: DailyExpense,
  date: Date
) => {
  const transactionData: Omit<Transaction, 'id'> = {
    userId,
    expenseId: expense.id,
    description: expense.description,
    amount: expense.amount,
    date: date.toISOString(),
    category: expense.category,
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'transactions'), transactionData);
  return { id: docRef.id, ...transactionData };
};

export const getTransactionsForDay = async (userId: string, date: Date): Promise<Transaction[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    where('date', '>=', startOfDay.toISOString()),
    where('date', '<=', endOfDay.toISOString())
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Transaction));
};

export const processRecurringExpenses = async (userId: string, expenses: DailyExpense[]) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Get today's transactions to avoid duplicates
  const existingTransactions = await getTransactionsForDay(userId, today);
  
  for (const expense of expenses) {
    if (expense.recurringDays.includes(dayOfWeek)) {
      // Check if transaction already exists for this expense today
      const hasTransaction = existingTransactions.some(t => t.expenseId === expense.id);
      if (!hasTransaction) {
        await createTransaction(userId, expense, today);
      }
    }
  }
};

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  try {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as Transaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}