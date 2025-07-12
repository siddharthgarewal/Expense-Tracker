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
import QuickExpenseEntry from "../quick-entry/QuickExpenseEntry";

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

  const handleExpenseAdded = () => {
    getExpense(); // Refresh the expense list
  };

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          padding: '32px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1,
          }}
        >
          My Expenses
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          Track and manage all your expenses in one place
        </Typography>
      </Box>

      <ExpenseOptions
        expenseData={originalData}
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
              key={expense.id}
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
            minHeight: "400px",
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '48px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 2,
            }}
          >
            No Expenses Found
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Start tracking your expenses to see them here
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/add-expense")}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Add Your First Expense
          </Button>
        </Box>
      )}
      
      {/* Quick Expense Entry */}
      <QuickExpenseEntry onExpenseAdded={handleExpenseAdded} />
    </Box>
  );
}

export default MyExpense;
