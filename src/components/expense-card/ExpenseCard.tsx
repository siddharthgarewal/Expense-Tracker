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

function ExpenseCard({ expense }: { expense: any }) {
  console.log(expense);
  const { expenseName, price, category, description, date } = expense;
  const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
  const formattedDate = jsDate.toDateString();

  return (
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
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
        >
          Edit
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          startIcon={<DeleteOutlineOutlinedIcon />}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default ExpenseCard;
