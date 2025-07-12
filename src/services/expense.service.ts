import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  limit,
  Timestamp
} from "@firebase/firestore";
import { db } from "../firebase";
import { ExpenseData, BudgetData, FinancialGoal, RecurringExpense } from "../components/add-expense-form/expenseForm.type";

export class ExpenseService {
  private expenseRef;
  private budgetRef;
  private goalRef;
  private recurringExpenseRef;

  constructor() {
    this.expenseRef = collection(db, "allExpenses");
    this.budgetRef = collection(db, "budgets");
    this.goalRef = collection(db, "financialGoals");
    this.recurringExpenseRef = collection(db, "recurringExpenses");
  }

  // Existing expense methods
  addExpense(newExpense: ExpenseData) {
    return addDoc(this.expenseRef, newExpense);
  }

  getAllExpense(user: any) {
    const queryRef = query(this.expenseRef, where("user", "==", user.email));
    return getDocs(queryRef);
  }

  updateExpense(updatedExpense: any, id: string) {
    const expenseDoc = doc(db, "allExpenses", id);
    return updateDoc(expenseDoc, updatedExpense);
  }

  deleteExpense(id: string) {
    const expenseDoc = doc(db, "allExpenses", id);
    return deleteDoc(expenseDoc);
  }

  // New analytics methods
  async getMonthlySummary(user: any, year: number, month: number) {
    console.log('Querying for month:', month, 'year:', year);
    
    // Fetch all expenses for the user first
    const queryRef = query(this.expenseRef, where("user", "==", user.email));
    const snapshot = await getDocs(queryRef);
    const allExpenses = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    
    console.log('Total expenses found:', allExpenses.length);
    
    // Filter expenses for the specific month and year
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    
    console.log('Start of month:', startOfMonth);
    console.log('End of month:', endOfMonth);
    
    const expenses = allExpenses.filter(expense => {
      const expenseDate = new Date((expense as any).date.seconds * 1000);
      console.log('Checking expense date:', expenseDate, 'Amount:', (expense as any).price);
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    });
    
    console.log('Found expenses for this month:', expenses.length);
    expenses.forEach(expense => {
      const expenseDate = new Date((expense as any).date.seconds * 1000);
      console.log('Expense date:', expenseDate, 'Amount:', (expense as any).price);
    });
    
    const totalAmount = expenses.reduce((sum, expense) => {
      const price = typeof (expense as any).price === 'string' 
        ? parseFloat((expense as any).price) 
        : (expense as any).price || 0;
      return sum + price;
    }, 0);

    const categoryBreakdown = expenses.reduce((acc, expense) => {
      const category = (expense as any).category;
      const price = typeof (expense as any).price === 'string' 
        ? parseFloat((expense as any).price) 
        : (expense as any).price || 0;
      if (category) {
        acc[category] = (acc[category] || 0) + price;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalAmount,
      categoryBreakdown,
      expenseCount: expenses.length,
      expenses
    };
  }

  async getCategoryBreakdown(user: any) {
    const queryRef = query(this.expenseRef, where("user", "==", user.email));
    const snapshot = await getDocs(queryRef);
    const expenses = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    
    return expenses.reduce((acc, expense) => {
      const category = (expense as any).category;
      const price = typeof (expense as any).price === 'string' 
        ? parseFloat((expense as any).price) 
        : (expense as any).price || 0;
      if (category) {
        acc[category] = (acc[category] || 0) + price;
      }
      return acc;
    }, {} as Record<string, number>);
  }

  async getRecentExpenses(user: any, limitCount: number = 5) {
    const queryRef = query(
      this.expenseRef,
      where("user", "==", user.email),
      orderBy("date", "desc"),
      limit(limitCount)
    );
    return getDocs(queryRef);
  }

  // Budget methods
  async addBudget(budget: BudgetData) {
    return addDoc(this.budgetRef, budget);
  }

  async getBudgets(user: any) {
    const queryRef = query(this.budgetRef, where("userId", "==", user.email));
    return getDocs(queryRef);
  }

  async updateBudget(budget: Partial<BudgetData>, id: string) {
    const budgetDoc = doc(db, "budgets", id);
    // Only update fields that are defined (Firestore does not allow undefined fields)
    const updateData: Partial<BudgetData> = {};
    Object.entries(budget).forEach(([key, value]) => {
      if (value !== undefined) {
        (updateData as any)[key] = value;
      }
    });
    return updateDoc(budgetDoc, updateData);
  }

  async deleteBudget(id: string) {
    const budgetDoc = doc(db, "budgets", id);
    return deleteDoc(budgetDoc);
  }

  // Financial goals methods
  async addGoal(goal: FinancialGoal) {
    return addDoc(this.goalRef, goal);
  }

  async getGoals(user: any) {
    const queryRef = query(this.goalRef, where("userId", "==", user.email));
    return getDocs(queryRef);
  }

  async updateGoal(goal: Partial<FinancialGoal>, id: string) {
    const goalDoc = doc(db, "financialGoals", id);
    // Only update fields that are defined (Firestore does not allow undefined fields)
    const updateData: Partial<FinancialGoal> = {};
    Object.entries(goal).forEach(([key, value]) => {
      if (value !== undefined) {
        (updateData as any)[key] = value;
      }
    });
    return updateDoc(goalDoc, updateData);
  }

  async deleteGoal(id: string) {
    const goalDoc = doc(db, "financialGoals", id);
    return deleteDoc(goalDoc);
  }

  // Recurring expenses methods
  async addRecurringExpense(recurringExpense: RecurringExpense) {
    return addDoc(this.recurringExpenseRef, recurringExpense);
  }

  async getRecurringExpenses(user: any) {
    const queryRef = query(
      this.recurringExpenseRef,
      where("userId", "==", user.email),
      where("isActive", "==", true)
    );
    return getDocs(queryRef);
  }

  async updateRecurringExpense(recurringExpense: Partial<RecurringExpense>, id: string) {
    const recurringExpenseDoc = doc(db, "recurringExpenses", id);
    // Only update fields that are defined (Firestore does not allow undefined fields)
    const updateData: Partial<RecurringExpense> = {};
    Object.entries(recurringExpense).forEach(([key, value]) => {
      if (value !== undefined) {
        (updateData as any)[key] = value;
      }
    });
    return updateDoc(recurringExpenseDoc, updateData);
  }

  async deleteRecurringExpense(id: string) {
    const recurringExpenseDoc = doc(db, "recurringExpenses", id);
    return deleteDoc(recurringExpenseDoc);
  }

  // Search and filter methods
  async searchExpenses(user: any, searchTerm: string) {
    const queryRef = query(this.expenseRef, where("user", "==", user.email));
    const snapshot = await getDocs(queryRef);
    const expenses = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return expenses.filter(expense => 
      ('expenseName' in expense && typeof (expense as any).expenseName === 'string' && (expense as any).expenseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ('description' in expense && typeof (expense as any).description === 'string' && (expense as any).description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  async getExpensesByDateRange(user: any, startDate: Date, endDate: Date) {
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    const queryRef = query(
      this.expenseRef,
      where("user", "==", user.email),
      where("date", ">=", startTimestamp),
      where("date", "<=", endTimestamp)
    );
    return getDocs(queryRef);
  }

  async getExpensesByCategory(user: any, category: string) {
    const queryRef = query(
      this.expenseRef,
      where("user", "==", user.email),
      where("category", "==", category)
    );
    return getDocs(queryRef);
  }
}
