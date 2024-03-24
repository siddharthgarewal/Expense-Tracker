import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import ExpenseForm from "../add-expense-form/ExpenseForm";
import { ExpenseData } from "../add-expense-form/expenseForm.type";
import { ExpenseService } from "../../services/expense.service";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Loader from "../loader/Loader";

interface EditExpensePropType {
  open: boolean;
  handleClose(): void;
  expenseData: any;
}

function EditExpense({ open, handleClose, expenseData }: EditExpensePropType) {
  const expense = new ExpenseService();
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);

  const handleUpdateExpense = (updatedExpense: ExpenseData) => {
    setLoader(true);
    expense
      .updateExpense(updatedExpense, expenseData.id)
      .then(() => {
        enqueueSnackbar("Successfully updated expense", { variant: "success" });
        handleClose();
        setLoader(false);
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: "error" });
        setLoader(false);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit {expenseData.expenseName}</DialogTitle>
      <DialogContent>
        {loader && <Loader />}
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
