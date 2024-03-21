import { Route, Routes } from "react-router-dom";
import "./App.css";
import ExpenseForm from "./components/add-expense-form/ExpenseForm";
import Header from "./components/header/Header";
import MyExpense from "./components/my-expense/MyExpense";
import { ExpenseData } from "./components/add-expense-form/expenseForm.type";
import { ExpenseService } from "./services/expense.service";
import { useSnackbar } from "notistack";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import Home from "./components/auth/Home";
import { UserAuthContextProvider } from "./components/context/UserAuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const expense = new ExpenseService();
  const { enqueueSnackbar } = useSnackbar();

  const handleExpenseSubmit = (newExpense: ExpenseData) => {
    expense
      .addExpense(newExpense)
      .then(() =>
        enqueueSnackbar("Expense added successfully", { variant: "success" })
      )
      .catch((err) => enqueueSnackbar(err, { variant: "error" }));
  };

  return (
    <div className="App">
      <UserAuthContextProvider>
        <Header />
        <div className="subpart">
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/add-expense"
              element={
                <ProtectedRoute>
                  <ExpenseForm sendFormData={handleExpenseSubmit} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-expense"
              element={
                <ProtectedRoute>
                  <MyExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
