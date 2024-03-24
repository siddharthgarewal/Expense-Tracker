import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ExpenseService } from "../../services/expense.service";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Loader from "../loader/Loader";

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
  const expense = new ExpenseService();
  const { expenseName, id } = expenseData;
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);

  const handleDelete = () => {
    setLoader(true);
    expense
      .deleteExpense(id)
      .then(() => {
        enqueueSnackbar(`Successfully deleted ${expenseName}`, {
          variant: "success",
        });
        handleClose();
        setLoader(false);
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: "error" });
        setLoader(false);
      });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        {loader ? (
          <Loader />
        ) : (
          <>
            <DialogTitle>Delete {expenseName}</DialogTitle>
            <DialogContent>
              Are you sure you want to delete record for <b>{expenseName}</b>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDelete}>Yes</Button>
              <Button onClick={handleClose}>No</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

export default DeleteExpense;
