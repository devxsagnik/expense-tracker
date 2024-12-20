export interface Transaction {
  [x: string]: any;
  id?: string;
  userId: string;
  expenseId: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  category: string;
  date: string;
}

export interface MonthlyReport {
  totalSpent: number;
  remainingBudget: number;
  categoryBreakdown: {
    [key: string]: number;
  };
  transactions: Transaction[];
}