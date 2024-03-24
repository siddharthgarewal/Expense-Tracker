import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ExpenseData, categories } from "./expenseForm.type";
import "./ExpenseForm.css";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import dayjs from "dayjs";
import { useUserAuth } from "../context/UserAuthContext";

interface ExpenseFormPropType {
  isEditForm?: boolean;
  sendFormData: (value: any) => void;
  handleClose?: () => void;
  initialExpenseValue?: any;
}

const ExpenseForm = ({
  isEditForm = false,
  sendFormData,
  handleClose,
  initialExpenseValue,
}: ExpenseFormPropType) => {
  const [formData, setFormData] = useState<ExpenseData>({
    expenseName: "",
    price: null,
    category: "",
    description: "",
    date: null,
  });
  const { user } = useUserAuth();

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const newExpense = {
      ...formData,
      date: dayjs(formData.date).toDate(),
      user: user?.email,
    };
    sendFormData(newExpense);
    setFormData({
      expenseName: "",
      price: null,
      category: "",
      description: "",
      date: null,
    });
  };

  const handleChange = (event: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleDateChange = (date: any) => {
    setFormData({ ...formData, date });
  };

  const handleTodaysDate = (event: any) => {
    if (event.target.checked) {
      setFormData({ ...formData, date: dayjs() });
    } else {
      setFormData({ ...formData, date: null });
    }
  };

  useEffect(() => {
    if (initialExpenseValue) {
      const { expenseName, price, category, description, date } =
        initialExpenseValue;
      const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
      const formattedDate = dayjs(jsDate);
      setFormData({
        expenseName,
        price,
        category,
        description,
        date: formattedDate,
      });
    }
  }, [initialExpenseValue]);

  return (
    <form
      className={`${isEditForm ? "" : "formContainer"}`}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Expense Name"
        name="expenseName"
        value={formData.expenseName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Price"
        name="price"
        value={formData.price || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        required
      />
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          label="Category"
          required
        >
          {categories.map((category: string) => {
            return (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date"
          slotProps={{
            textField: {
              helperText: "MM/DD/YYYY",
            },
          }}
          value={formData.date}
          onChange={handleDateChange}
          sx={{ width: "100%" }}
        />
      </LocalizationProvider>
      <FormGroup sx={{ width: "100%" }}>
        <FormControlLabel
          control={<Checkbox onClick={handleTodaysDate} />}
          label="Today's date"
        />
      </FormGroup>
      {isEditForm ? (
        <div className="edit-buttons">
          <Button
            type="reset"
            variant="outlined"
            color="info"
            size="medium"
            sx={{ mt: 4 }}
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            size="medium"
            sx={{ mt: 4 }}
          >
            Apply
          </Button>
        </div>
      ) : (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4 }}
        >
          Add Expense
        </Button>
      )}
    </form>
  );
};

export default ExpenseForm;
