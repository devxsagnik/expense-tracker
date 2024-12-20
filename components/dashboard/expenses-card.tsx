"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Trash2 } from 'lucide-react';
import { AddExpenseDialog } from './add-expense-dialog';
import { EditExpenseDialog } from './edit-expense-dialog';
import { DailyExpense } from '@/lib/types/expense';
import { addDailyExpense, getDailyExpenses, deleteDailyExpense, editDailyExpense, calculateMonthlyTotal, calculateRemainingBudget } from '@/lib/services/expense.service';
import { processRecurringExpenses } from '@/lib/services/transaction.service';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ExpensesCard() {
  const [expenses, setExpenses] = useState<DailyExpense[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  const loadExpenses = async () => {
    const user = auth.currentUser;
    if (user) {
      const userExpenses = await getDailyExpenses(user.uid);
      setExpenses(userExpenses);
      const total = calculateMonthlyTotal(userExpenses);
      setMonthlyTotal(total);
    }
  };

  const processTransactions = async () => {
    const user = auth.currentUser;
    if (user) {
      await processRecurringExpenses(user.uid, expenses);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      processTransactions();
      
      // Set up daily check at midnight
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();

      const midnightTimeout = setTimeout(() => {
        processTransactions();
      }, timeUntilMidnight);

      return () => clearTimeout(midnightTimeout);
    }
  }, [expenses]);

  const handleAddExpense = async (formData: any) => {
    const user = auth.currentUser;
    if (user) {
      await addDailyExpense(user.uid, formData);
      await loadExpenses();
    }
  };

  const handleEditExpense = async (expenseId: string, formData: any) => {
    await editDailyExpense(expenseId, formData);
    await loadExpenses();
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteDailyExpense(expenseId);
    await loadExpenses();
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Daily Expenses
        </CardTitle>
        <AddExpenseDialog onSubmit={handleAddExpense} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-lg font-semibold">
              Estimated Monthly Total: ₹ {monthlyTotal.toFixed(2)}
            </div>
          </div>
          
          {expenses.length === 0 ? (
            <p className="text-muted-foreground">No daily expenses recorded yet</p>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-muted-foreground">
                    ₹ {expense.amount.toFixed(2)} on {expense.recurringDays.map(day => DAYS[day]).join(', ')}
                    </div>
                  </div>
                    <div className="flex items-center gap-2">
                    <EditExpenseDialog 
                      expense={expense} 
                      onSubmit={(data) => handleEditExpense(expense.id, data)} 
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}