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
  Typography,
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
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.9)',
          mb: 2,
          textAlign: 'center',
        }}
      >
        Filter & Search Expenses
      </Typography>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel 
              id="sort-by-label"
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Sort By
            </InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.8)',
                },
              }}
            >
              <MenuItem value="new_date">Newest to Oldest Date</MenuItem>
              <MenuItem value="old_date">Oldest to Newest Date</MenuItem>
              <MenuItem value="high_price">High to Low Price</MenuItem>
              <MenuItem value="low_price">Low to High Price</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            fullWidth
            placeholder="Search expenses by name"
            onChange={handleSearchInputChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                },
                '&.Mui-focused': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.8)',
              },
              '& .MuiInputBase-input': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button 
            variant="contained" 
            onClick={handleSearch}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: 600,
              textTransform: 'none',
              width: '100%',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExpenseOptions;
