import { useEffect, useState } from "react";
import { ExpenseService } from "../../services/expense.service";
import ExpenseCard from "../expense-card/ExpenseCard";
import "./MyExpense.css";
import Loader from "../loader/Loader";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import ExpenseOptions from "../expense-options/ExpenseOptions";

function MyExpense() {
  const [expenseData, setExpenseData] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const getExpense = async () => {
    setLoader(true);
    const expense = new ExpenseService();
    try {
      const querySnapShot = await expense.getAllExpense(user);
      const data = querySnapShot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));
      data.sort(
        (a, b) =>
          a.date.seconds - b.date.seconds ||
          a.date.nanoseconds - b.date.nanoseconds
      );
      setExpenseData(data);
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const handleDelete = (id: string) => {
    const filteredData = expenseData.filter(
      (item: { id: string }) => item.id !== id
    );
    setExpenseData(filteredData);
  };

  const handleUpdate = (updatedExpense: any) => {
    const updatedData = expenseData.map((item: { id: string }) => {
      if (item.id === updatedExpense.id) return updatedExpense;
      else return item;
    });
    setExpenseData(updatedData);
  };

  useEffect(() => {
    getExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {!loader && (
        <ExpenseOptions
          expenseData={expenseData}
          setExpenseData={(expenses: any) => setExpenseData(expenses)}
        />
      )}
      {loader ? (
        <Loader />
      ) : expenseData.length > 0 ? (
        <div className="my_expenses">
          {expenseData.map((expense: any) => (
            <ExpenseCard
              expense={expense}
              deleteExpense={handleDelete}
              updateExpense={handleUpdate}
            />
          ))}
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "85vh",
          }}
        >
          <Typography>Haven't added any expense yet</Typography>
          <Button variant="text" onClick={() => navigate("/add-expense")}>
            Add New Expense
          </Button>
        </Box>
      )}
    </div>
  );
}

export default MyExpense;
