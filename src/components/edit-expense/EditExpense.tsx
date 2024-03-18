import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import ExpenseForm from "../add-expense-form/ExpenseForm";
import { ExpenseData } from "../add-expense-form/expenseForm.type";
import { ExpenseService } from "../../services/expense.service";
import { useSnackbar } from "notistack";

interface EditExpensePropType {
  open: boolean;
  handleClose(): void;
  expenseData: any;
}

function EditExpense({ open, handleClose, expenseData }: EditExpensePropType) {
  const expense = new ExpenseService();
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdateExpense = (updatedExpense: ExpenseData) => {
    expense
      .updateExpense(updatedExpense, expenseData.id)
      .then(() => {
        enqueueSnackbar("Successfully updated expense", { variant: "success" });
        handleClose();
      })
      .catch((err) => enqueueSnackbar(err, { variant: "error" }));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit {expenseData.expenseName}</DialogTitle>
      <DialogContent>
        <ExpenseForm
          isEditForm={true}
          sendFormData={handleUpdateExpense}
          handleClose={handleClose}
          initialExpenseValue={expenseData}
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditExpense;
