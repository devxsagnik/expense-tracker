export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  monthlyBudget: number;
  createdAt: string;
}

export interface UserFormData {
  name: string;
  age: string;
  email: string;
  password: string;
  budget: string;
}