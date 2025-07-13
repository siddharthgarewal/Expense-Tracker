import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ExpenseForm from "../add-expense-form/ExpenseForm";
import { ExpenseService } from "../../services/expense.service";
import { useSnackbar } from "notistack";
import { useUserAuth } from "../context/UserAuthContext";
import { 
  CalendarToday, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Repeat as RepeatIcon,
  AttachMoney as MoneyIcon
} from "@mui/icons-material";
import dayjs from "dayjs";
import { currencies } from "../add-expense-form/expenseForm.type";

interface ExpenseCardProps {
  expense: any;
  deleteExpense: (id: string) => void;
  updateExpense: (expense: any) => void;
}

const ExpenseCard = ({ expense, deleteExpense, updateExpense }: ExpenseCardProps) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUserAuth();
  const expenseService = new ExpenseService();

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

  const formatDate = (date: any) => {
    const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    return dayjs(jsDate).format("MMM DD, YYYY");
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  };

  const formatAmount = (amount: number, currency: string = 'USD') => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="expense-card">
      {/* Currency indicator */}
      {expense.currency && expense.currency !== 'USD' && (
        <div className="currency-indicator">
          <MoneyIcon sx={{ fontSize: '0.75rem' }} />
          {expense.currency}
        </div>
      )}

      {/* Recurring indicator */}
      {expense.isRecurring && (
        <div className="recurring-indicator">
          <RepeatIcon sx={{ fontSize: '0.75rem' }} />
          {expense.frequency}
        </div>
      )}

      <div className="expense-header">
        <h3 className="expense-title">{expense.expenseName}</h3>
        <p className="expense-amount">
          {formatAmount(parseFloat(expense.price), expense.currency)}
        </p>
      </div>

      <span className="expense-category">{expense.category}</span>

      {expense.description && (
        <p className="expense-description">{expense.description}</p>
      )}

      <div className="expense-date">
        <CalendarToday sx={{ fontSize: '1rem' }} />
        {formatDate(expense.date)}
      </div>

      <div className="expense-actions">
        <Button
          className="action-button edit-button"
          startIcon={<EditIcon />}
          onClick={() => setOpen(true)}
        >
          Edit
        </Button>
        <Button
          className="action-button delete-button"
          startIcon={<DeleteIcon />}
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
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
        }}>
          Edit Expense
        </DialogTitle>
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
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          color: '#e53e3e',
          fontWeight: 700,
        }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <p style={{ 
            textAlign: 'center',
            color: '#4a5568',
            fontSize: '1rem',
            margin: '16px 0',
          }}>
            Are you sure you want to delete "{expense.expenseName}"?
            <br />
            <strong>This action cannot be undone.</strong>
          </p>
        </DialogContent>
        <DialogActions sx={{ 
          padding: '16px 24px 24px',
          justifyContent: 'center',
          gap: '12px',
        }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              padding: '8px 24px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '12px',
              padding: '8px 24px',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              boxShadow: '0 4px 12px rgba(245, 101, 101, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                boxShadow: '0 6px 16px rgba(245, 101, 101, 0.4)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpenseCard;
