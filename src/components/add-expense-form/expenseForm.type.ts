import { Dayjs } from "dayjs";

export interface ExpenseData {
  expenseName: string;
  price: number | null;
  category: string;
  description: string;
  date: Date | Dayjs | null;
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
