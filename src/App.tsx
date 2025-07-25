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
import { UserAuthContextProvider } from "./components/context/UserAuthContext";
import { CustomThemeProvider } from "./components/context/ThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import BudgetManager from "./components/budget/BudgetManager";
import RecurringExpenseManager from "./components/recurring/RecurringExpenseManager";
import FinancialGoals from "./components/goals/FinancialGoals";
import GroupList from './components/groups/GroupList';
import GroupDetails from './components/groups/GroupDetails';
import Breadcrumbs from './components/navigation/Breadcrumbs';
import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';

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
    <AccessibilityProvider>
      <CustomThemeProvider>
        <div className="App">
          <UserAuthContextProvider>
          <Header />
          <div className="subpart">
            <Breadcrumbs />
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
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budgets"
                element={
                  <ProtectedRoute>
                    <BudgetManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recurring"
                element={
                  <ProtectedRoute>
                    <RecurringExpenseManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <FinancialGoals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups"
                element={
                  <ProtectedRoute>
                    <GroupList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups/:groupId"
                element={
                  <ProtectedRoute>
                    <GroupDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          </UserAuthContextProvider>
        </div>
      </CustomThemeProvider>
    </AccessibilityProvider>
  );
}

export default App;
