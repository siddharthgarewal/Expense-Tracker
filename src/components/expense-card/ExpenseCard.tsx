import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CardActions,
  Button,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useState } from "react";
import EditExpense from "../edit-expense/EditExpense";
import DeleteExpense from "../delete-expense/DeleteExpense";

interface ExpenseCardPropType {
  expense: any;
  deleteExpense: (id: string) => void;
  updateExpense: (updatedExpense: any) => void;
}

function ExpenseCard({
  expense,
  deleteExpense,
  updateExpense,
}: ExpenseCardPropType) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { expenseName, price, category, description, date } = expense;
  const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
  const formattedDate = jsDate.toDateString();

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 275 }} elevation={10}>
        <CardContent>
          <Typography
            sx={{ fontSize: 18, fontWeight: "600" }}
            color="text.primary"
            gutterBottom
          >
            {expenseName}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {formattedDate}
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
          >
            <Chip label={`Rs. ${price}`} variant="filled" size="small" />
            <Chip label={category} variant="outlined" size="small" />
          </Box>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            size="small"
            color="info"
            startIcon={<EditOutlinedIcon />}
            onClick={handleEditOpen}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={handleDeleteOpen}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
      <EditExpense
        open={editOpen}
        handleClose={handleEditClose}
        expenseData={expense}
        updateExpense={updateExpense}
      />
      <DeleteExpense
        open={deleteOpen}
        handleClose={handleDeleteClose}
        expenseData={expense}
        deleteExpense={deleteExpense}
      />
    </>
  );
}

export default ExpenseCard;
