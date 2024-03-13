import "./App.css";
import ExpenseForm from "./components/add-expense-form/ExpenseForm";
import Header from "./components/header/Header";
import Test from "./components/test/Test";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="subpart">
        <Test />
        {/* <ExpenseForm /> */}
      </div>
    </div>
  );
}

export default App;
