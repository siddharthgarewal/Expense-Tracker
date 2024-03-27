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
  updateExpense: (updatedExpense: any) => void;
}

function EditExpense({
  open,
  handleClose,
  expenseData,
  updateExpense,
}: EditExpensePropType) {
  const expense = new ExpenseService();
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);

  const handleUpdateExpense = (updatedExpense: ExpenseData) => {
    setLoader(true);
    expense
      .updateExpense(updatedExpense, expenseData.id)
      .then(() => {
        enqueueSnackbar("Successfully updated expense", { variant: "success" });
        const { date }: { date: any } = updatedExpense;
        // Parse the date string to obtain a Date object
        const dateObj = new Date(date);

        // Extract seconds and milliseconds from the Date object
        const seconds = Math.floor(dateObj.getTime() / 1000); // Convert milliseconds to seconds
        const milliseconds = date.getMilliseconds();

        // Adjust the nanoseconds to match the required format (9 digits)
        const nanoseconds = milliseconds * 1000000;

        // Create the object in the required format
        const timestampObject = {
          seconds: seconds,
          nanoseconds: nanoseconds,
        };

        updateExpense({
          ...updatedExpense,
          id: expenseData.id,
          date: timestampObject,
        });
        setLoader(false);
        handleClose();
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
