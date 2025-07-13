import { Dayjs } from "dayjs";

export interface ExpenseData {
  expenseName: string;
  price: number | null;
  category: string;
  description: string;
  date: Date | Dayjs | null;
  // New fields for enhanced features
  isRecurring?: boolean;
  frequency?: 'weekly' | 'monthly' | 'yearly';
  currency?: string;
  receiptUrl?: string;
  sharedWith?: string[];
  budgetId?: string;
}

export interface BudgetData {
  id?: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  currency: string;
  userId: string;
  createdAt: Date;
}

export interface FinancialGoal {
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  type: 'savings' | 'debt-reduction' | 'spending-limit';
  currency: string;
  userId: string;
  createdAt: Date;
}

export interface RecurringExpense {
  id?: string;
  expenseName: string;
  price: number;
  category: string;
  description: string;
  frequency: 'weekly' | 'monthly' | 'yearly';
  nextDueDate: Date;
  isActive: boolean;
  userId: string;
  createdAt: Date;
}

export const categories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Rent",
  "Groceries",
  "Home and utilities",
  "Insurance",
  "Bills & emis",
  "Education",
  "Health and personal care",
  "Shopping",
  "Travel",
  "Memberships",
];

export const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

export const frequencyOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];
