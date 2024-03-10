import "./App.css";
import ExpenseForm from "./components/add-expense-form/ExpenseForm";
import Header from "./components/header/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="subpart">
        <ExpenseForm />
      </div>
    </div>
  );
}

export default App;
