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
  const [originalData, setOriginalData] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [searchValue, setSearchValue] = useState("");
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
          b.date.seconds - a.date.seconds ||
          b.date.nanoseconds - a.date.nanoseconds
      );
      setExpenseData(data);
      setOriginalData(data); // Set original data
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
    setOriginalData(filteredData); // Update original data
  };

  const handleUpdate = (updatedExpense: any) => {
    const updatedData = expenseData.map((item: { id: string }) => {
      if (item.id === updatedExpense.id) return updatedExpense;
      else return item;
    });
    setExpenseData(updatedData);
    setOriginalData(updatedData); // Update original data
  };

  useEffect(() => {
    getExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (searchValue.trim() === "") {
      // If search value is empty, reset to original data
      setExpenseData(originalData);
      return;
    }

    const filteredExpense = originalData.filter(
      (expense: { expenseName: any }) =>
        expense.expenseName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setExpenseData(filteredExpense);
  };

  return (
    <div>
      <ExpenseOptions
        expenseData={originalData} // Pass original data for search filtering
        setExpenseData={(expenses: any) => setExpenseData(expenses)}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
      />
      {loader ? (
        <Loader />
      ) : expenseData.length > 0 ? (
        <div className="my_expenses">
          {expenseData.map((expense: any) => (
            <ExpenseCard
              expense={expense}
              deleteExpense={handleDelete}
              updateExpense={handleUpdate}
              key={expense.id} // Add key prop for unique identification
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
