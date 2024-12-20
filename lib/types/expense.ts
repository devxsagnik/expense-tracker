export interface DailyExpense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  recurringDays: number[]; // 0-6 representing Sunday-Saturday
  createdAt: string;
}

export interface DailyExpenseFormData {
  description: string;
  amount: string;
  recurringDays: number[];
  category: string;
}