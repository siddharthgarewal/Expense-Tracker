import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ExpenseForm from "../add-expense-form/ExpenseForm";
import { ExpenseService } from "../../services/expense.service";
import { useSnackbar } from "notistack";
import { getCurrencySymbol } from '../add-expense-form/expenseForm.type';
import DebtSummary from '../split-expense/DebtSummary';
import { useUserAuth } from "../context/UserAuthContext";

interface ExpenseCardProps {
  expense: any;
  deleteExpense: (id: string) => void;
  updateExpense: (expense: any) => void;
}

const ExpenseCard = ({ expense, deleteExpense, updateExpense }: ExpenseCardProps) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const expenseService = new ExpenseService();
  const { user } = useUserAuth();
  const currentUserId = user?.uid || (user?.email || undefined);

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (updatedExpense: any) => {
    expenseService
      .updateExpense(updatedExpense, expense.id)
      .then(() => {
        updateExpense({ ...updatedExpense, id: expense.id });
        enqueueSnackbar("Expense updated successfully", { variant: "success" });
        handleClose();
      })
      .catch((err) => enqueueSnackbar(err, { variant: "error" }));
  };

  const handleDelete = () => {
    expenseService
      .deleteExpense(expense.id)
      .then(() => {
        deleteExpense(expense.id);
        enqueueSnackbar("Expense deleted successfully", { variant: "success" });
        setDeleteDialogOpen(false);
      })
      .catch((err) => enqueueSnackbar(err, { variant: "error" }));
  };

  const handleSettleDebt = async (debt: any) => {
    try {
      await expenseService.settleDebt(expense.id, debt.from, debt.to);
      enqueueSnackbar('Debt settled!', { variant: 'success' });
      // Optionally, trigger a refresh or update the UI
      // For now, just update the local expense object
      if (expense.split && expense.split.debts) {
        const updatedDebts = expense.split.debts.map((d: any) =>
          d.from === debt.from && d.to === debt.to ? { ...d, settled: true } : d
        );
        updateExpense({ ...expense, split: { ...expense.split, debts: updatedDebts } });
      }
    } catch (err) {
      enqueueSnackbar('Failed to settle debt', { variant: 'error' });
    }
  };

  return (
    <div className="expense-card">
      <div className="expense-header">
        <h3 className="expense-title">{expense.expenseName}</h3>
        <p className="expense-amount">{getCurrencySymbol(expense.currency || 'INR')}{expense.price}</p>
      </div>
      {expense.isSplit && expense.split && (
        <div style={{margin: '12px 0', padding: '12px', background: 'rgba(102,126,234,0.05)', borderRadius: '12px'}}>
          <strong>Split Details:</strong>
          <div>Participants: {expense.split.participants?.map((p: any) => p.name).join(', ')}</div>
          <div>Payer: {expense.split.payerId}</div>
          <div>Split Method: {expense.split.splitMethod}</div>
          <DebtSummary
            participants={expense.split.participants || []}
            splitDetails={expense.split.splitDetails || []}
            payerId={expense.split.payerId}
            currency={expense.currency || 'INR'}
            debtsFromBackend={expense.split.debts || []}
            onSettle={handleSettleDebt}
            currentUserId={currentUserId}
          />
        </div>
      )}

      <span className="expense-category">{expense.category}</span>

      {expense.description && (
        <p className="expense-description">{expense.description}</p>
      )}

      <div className="expense-date">
        {new Date(expense.date.seconds * 1000).toLocaleDateString()}
      </div>

      <div className="expense-actions">
        <Button
          className="action-button edit-button"
          onClick={() => setOpen(true)}
        >
          Edit
        </Button>
        <Button
          className="action-button delete-button"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <ExpenseForm
            isEditForm={true}
            sendFormData={handleEdit}
            handleClose={handleClose}
            initialExpenseValue={expense}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete "{expense.expenseName}"?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpenseCard;
