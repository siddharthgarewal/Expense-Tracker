import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormData, categories } from "./expenseForm.type";
import "./ExpenseForm.css";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import dayjs from "dayjs";

const ExpenseForm = () => {
  const [formData, setFormData] = useState<FormData>({
    expenseName: "",
    price: null,
    category: "",
    description: "",
    date: null,
  });

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log("Form Submitted:", formData);
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

  return (
    <form className="formContainer" onSubmit={handleSubmit}>
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
        value={formData.price}
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
      <Button type="submit" variant="contained" color="primary" size="large">
        Add Expense
      </Button>
    </form>
  );
};

export default ExpenseForm;
