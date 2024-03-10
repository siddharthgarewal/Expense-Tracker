export interface FormData {
  expenseName: string;
  price: number;
  category: string;
  description: string;
  date: Date | null;
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
