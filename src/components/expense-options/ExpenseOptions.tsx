import React, { useState } from "react";
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

interface ExpenseOptionsPropType {
  expenseData: any;
  setExpenseData: (value: any) => void;
  setSearchValue: (value: string) => void; // Add setSearchValue prop
  handleSearch: () => void; // Add handleSearch prop
}

function ExpenseOptions({
  expenseData,
  setExpenseData,
  setSearchValue,
  handleSearch,
}: ExpenseOptionsPropType) {
  const [sortBy, setSortBy] = useState("new_date");

  const handleSortChange = (event: { target: { value: string } }) => {
    const value = event.target.value as string;
    setSortBy(value);
    let sortedData = [...expenseData];

    // Sorting logic based on value
    switch (value) {
      case "new_date":
        sortedData.sort(
          (a: any, b: any) =>
            b.date.seconds - a.date.seconds ||
            b.date.nanoseconds - a.date.nanoseconds
        );
        break;
      case "old_date":
        sortedData.sort(
          (a: any, b: any) =>
            a.date.seconds - b.date.seconds ||
            a.date.nanoseconds - b.date.nanoseconds
        );
        break;
      case "high_price":
        sortedData.sort((a: any, b: any) => b.price - a.price);
        break;
      case "low_price":
        sortedData.sort((a: any, b: any) => a.price - b.price);
        break;
      default:
        break;
    }

    setExpenseData(sortedData);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(event.target.value);
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
              <MenuItem value="new_date">Newest to Oldest Date</MenuItem>
              <MenuItem value="old_date">Oldest to Newest Date</MenuItem>
              <MenuItem value="high_price">High to Low Price</MenuItem>
              <MenuItem value="low_price">Low to High Price</MenuItem>
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
          onChange={handleSearchInputChange}
        />
      </Grid>
      <Grid item>
        <Button variant="text" color="primary" onClick={handleSearch}>
          Apply
        </Button>
      </Grid>
    </Grid>
  );
}

export default ExpenseOptions;
