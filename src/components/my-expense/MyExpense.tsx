import { useEffect, useState } from "react";
import { ExpenseService } from "../../services/expense.service";
import ExpenseCard from "../expense-card/ExpenseCard";
import "./MyExpense.css";
import Loader from "../loader/Loader";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { useNavigate } from "react-router";

function MyExpense() {
  const [expenseData, setExpenseData] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

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
      ) : expenseData.length > 0 ? (
        expenseData.map((expense: any) => <ExpenseCard expense={expense} />)
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
