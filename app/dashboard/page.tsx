"use client"

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { getUserData } from '@/lib/services/user.service';
import { getTransactions } from '@/lib/services/transaction.service';
import { User } from '@/lib/types/user';
import { Transaction } from '@/lib/types/transaction';
import { BudgetCard } from '@/components/dashboard/budget-card';
import { ExpensesCard } from '@/components/dashboard/expenses-card';
import { MonthlyReportCard } from '@/components/dashboard/monthly-report-card';
import { TransactionsTable } from '@/components/dashboard/transaction-table';

export default function DashboardPage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoading(true);
        const [data, userTransactions] = await Promise.all([
          getUserData(user.uid),
          getTransactions(user.uid)
        ]);
        
        if (data) {
          setUserData(data);
          setTransactions(userTransactions);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading || !userData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {userData.name}!</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BudgetCard amount={userData.monthlyBudget} />
        <ExpensesCard />
        <MonthlyReportCard monthlyBudget={userData.monthlyBudget} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}