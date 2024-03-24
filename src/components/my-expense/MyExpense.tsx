import { useEffect, useState } from "react";
import { ExpenseService } from "../../services/expense.service";
import ExpenseCard from "../expense-card/ExpenseCard";
import "./MyExpense.css";
import Loader from "../loader/Loader";

function MyExpense() {
  const [expenseData, setExpenseData] = useState<any>([]);
  const [loader, setLoader] = useState(false);

  const getExpense = async () => {
    setLoader(true);
    const expense = new ExpenseService();
    try {
      const querySnapShot = await expense.getAllExpense();
      const data = querySnapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setExpenseData(data);
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getExpense();
  }, []);

  return (
    <div className="my_expenses">
      {loader ? (
        <Loader />
      ) : (
        expenseData.map((expense: any) => <ExpenseCard expense={expense} />)
      )}
    </div>
  );
}

export default MyExpense;
