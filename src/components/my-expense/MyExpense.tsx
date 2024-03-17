import { useEffect, useState } from "react";
import { ExpenseService } from "../../services/expense.service";
import ExpenseCard from "../expense-card/ExpenseCard";
import "./MyExpense.css";

function MyExpense() {
  const [expenseData, setExpenseData] = useState<any>([]);
  console.log(expenseData);

  const getExpense = async () => {
    const expense = new ExpenseService();
    try {
      const querySnapShot = await expense.getAllExpense();
      const data = querySnapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setExpenseData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExpense();
  }, []);

  return (
    <div className="my_expenses">
      {expenseData.map((expense: any) => (
        <ExpenseCard expense={expense} />
      ))}
    </div>
  );
}

export default MyExpense;
