import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
} from "@mui/material";
import { SetStateAction, useState } from "react";

interface ExpenseOptionsPropType {
  expenseData: any;
  setExpenseData: (value: any) => void;
}

function ExpenseOptions({
  expenseData,
  setExpenseData,
}: ExpenseOptionsPropType) {
  const [sortBy, setSortBy] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const sortByDate = (
    a: { date: { seconds: number; nanoseconds: number } },
    b: { date: { seconds: number; nanoseconds: number } }
  ) => {
    return (
      a.date.seconds - b.date.seconds || a.date.nanoseconds - b.date.nanoseconds
    );
  };

  const sortByPrice = (a: { price: any }, b: { price: any }) => {
    return Number(b.price) - Number(a.price);
  };

  const sortByAlphabetical = (
    a: { [x: string]: string },
    b: { [x: string]: string },
    key: string
  ) => {
    const nameA = a[key].toUpperCase(); // ignore upper and lowercase
    const nameB = b[key].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  };

  const handleSortChange = (event: { target: { value: any } }) => {
    const { value } = event.target;
    setSortBy(value);
    let sortedData = [...expenseData]; // Clone the original array

    switch (value) {
      case "new_date":
        sortedData.sort(sortByDate);
        break;
      case "old_date":
        sortedData.sort((a, b) => sortByDate(b, a)); // Reverse sorting order
        break;
      case "high_price":
        sortedData.sort(sortByPrice);
        break;
      case "low_price":
        sortedData.sort((a, b) => sortByPrice(b, a)); // Reverse sorting order
        break;
      case "expense_name":
        sortedData.sort((a, b) => sortByAlphabetical(a, b, "expenseName"));
        break;
      case "category":
        sortedData.sort((a, b) => sortByAlphabetical(a, b, "category"));
        break;
      default:
        break;
    }
    setExpenseData(sortedData);
  };

  const handleFilterChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFilterValue(event.target.value);
    // Add filtering logic here
  };

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      mb={3}
    >
      <Grid item>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="sort-by-label" style={{ width: "100%" }}>
              Sort By
            </InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="expense_name">Expense Name</MenuItem>
              <MenuItem value="low_price">Low to High Price</MenuItem>
              <MenuItem value="high_price">High to Low Price</MenuItem>
              <MenuItem value="new_date">Newest to Oldest Date</MenuItem>
              <MenuItem value="old_date">Oldest to Newest Date</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item>
        <Box sx={{ minWidth: 120 }}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="filter-by-label">Filter</InputLabel>
            <Select
              labelId="filter-by-label"
              id="filter-by"
              value={filterValue}
              onChange={handleFilterChange}
              label="Filter"
            >
              <MenuItem value="food">Food</MenuItem>
              <MenuItem value="entertainment">Entertainment</MenuItem>
              {/* Add more options if needed */}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          fullWidth
          placeholder="Search expenses by name"
          // Add search functionality
        />
      </Grid>
      <Grid item>
        <Button variant="text" color="primary">
          Apply
        </Button>
      </Grid>
    </Grid>
  );
}

export default ExpenseOptions;
