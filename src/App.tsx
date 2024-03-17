import { Route, Routes } from "react-router-dom";
import "./App.css";
import ExpenseForm from "./components/add-expense-form/ExpenseForm";
import Header from "./components/header/Header";
import MyExpense from "./components/my-expense/MyExpense";
import { ExpenseData } from "./components/add-expense-form/expenseForm.type";
import { ExpenseService } from "./services/expense.service";

function App() {
  const handleExpenseSubmit = (newExpense: ExpenseData) => {
    const expense = new ExpenseService();
    expense
      .addExpense(newExpense)
      .then((data) => {
        console.log("Successful submission!", data);
      })
      .catch((err) => console.error(err));
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
