import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ExpenseService } from "../../services/expense.service";

interface DeleteExpensePropType {
  open: boolean;
  handleClose(): void;
  expenseData: any;
}

function DeleteExpense({
  open,
  handleClose,
  expenseData,
}: DeleteExpensePropType) {
  const { expenseName, id } = expenseData;

  const handleDelete = () => {
    const expense = new ExpenseService();
    expense
      .deleteExpense(id)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete {expenseName}</DialogTitle>
      <DialogContent>
        Are you sure you want to delete record for <b>{expenseName}</b>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete}>Yes</Button>
        <Button onClick={handleClose}>No</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteExpense;
