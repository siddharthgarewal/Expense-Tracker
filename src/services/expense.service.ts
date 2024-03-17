import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import { ExpenseData } from "../components/add-expense-form/expenseForm.type";

export class ExpenseService {
  private expenseRef;

  constructor() {
    this.expenseRef = collection(db, "allExpenses");
  }

  addExpense(newExpense: ExpenseData) {
    return addDoc(this.expenseRef, newExpense);
  }

  getAllExpense() {
    return getDocs(this.expenseRef);
  }

  updateExpense(updatedExpense: any, id: string) {
    const expenseDoc = doc(db, "allExpenses", id);
    return updateDoc(expenseDoc, updatedExpense);
  }

  deleteExpense(id: string) {
    const expenseDoc = doc(db, "allExpenses", id);
    return deleteDoc(expenseDoc);
  }
}
