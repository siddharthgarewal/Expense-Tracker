import { Route, Routes } from "react-router-dom";
import "./App.css";
import ExpenseForm from "./components/add-expense-form/ExpenseForm";
import Header from "./components/header/Header";
import MyExpense from "./components/my-expense/MyExpense";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="subpart">
        <Routes>
          <Route path="/" element={<ExpenseForm />} />
          <Route path="/my-expense" element={<MyExpense />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
