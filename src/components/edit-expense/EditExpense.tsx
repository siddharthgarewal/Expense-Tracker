import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import ExpenseForm from "../add-expense-form/ExpenseForm";
import { ExpenseData } from "../add-expense-form/expenseForm.type";
import { ExpenseService } from "../../services/expense.service";

interface EditExpensePropType {
  open: boolean;
  handleClose(): void;
  expenseData: any;
}

function EditExpense({ open, handleClose, expenseData }: EditExpensePropType) {
  const handleUpdateExpense = (updatedExpense: ExpenseData) => {
    const expense = new ExpenseService();
    expense
      .updateExpense(updatedExpense, expenseData.id)
      .then((data) => console.log("successfully updated", data))
      .catch((err) => console.log(err));
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
