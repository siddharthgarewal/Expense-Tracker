import { Route, Routes } from "react-router-dom";
import "./App.css";
import ExpenseForm from "./components/add-expense-form/ExpenseForm";
import Header from "./components/header/Header";
import MyExpense from "./components/my-expense/MyExpense";
import { ExpenseData } from "./components/add-expense-form/expenseForm.type";
import { ExpenseService } from "./services/expense.service";
import { useSnackbar } from "notistack";

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
      <Header />
      <div className="subpart">
        <Routes>
          <Route
            path="/"
            element={<ExpenseForm sendFormData={handleExpenseSubmit} />}
          />
          <Route path="/my-expense" element={<MyExpense />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
