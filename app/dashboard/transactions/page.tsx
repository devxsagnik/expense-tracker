"use client"

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Transaction } from '@/lib/types/transaction';
import { getTransactions, deleteTransaction } from '@/lib/services/transaction.service';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog';
import { Trash2 } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = async () => {
    const user = auth.currentUser;
    if (user) {
      const userTransactions = await getTransactions(user.uid);
      setTransactions(userTransactions);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleAddTransaction = async () => {
    await loadTransactions();
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    await deleteTransaction(transactionId);
    await loadTransactions();
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <AddTransactionDialog onSuccess={handleAddTransaction} remainingBudget={0} />
      </div>

      <div className="bg-card rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="px-6 py-4">
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">{transaction.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-sm">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => transaction.id && handleDeleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                    No transactions recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}