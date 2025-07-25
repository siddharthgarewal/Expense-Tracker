import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ExpenseData, categories, currencies, frequencyOptions } from "./expenseForm.type";
import "./ExpenseForm.css";
import { Checkbox, FormControlLabel, FormGroup, Grid, Switch, Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useUserAuth } from "../context/UserAuthContext";
import { useTheme } from "@mui/material/styles";
import SplitExpenseForm from "../split-expense/SplitExpenseForm";

interface ExpenseFormPropType {
  isEditForm?: boolean;
  sendFormData: (value: any) => void;
  handleClose?: () => void;
  initialExpenseValue?: any;
}

// Utility to remove undefined fields deeply from an object or array
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [k, v]) => {
      if (v !== undefined) acc[k] = removeUndefined(v);
      return acc;
    }, {} as any);
  }
  return obj;
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
    isRecurring: false,
    frequency: "monthly",
    currency: "INR",
  });
  const [isSplit, setIsSplit] = useState(false);
  const [splitData, setSplitData] = useState<any>(null);
  const { user } = useUserAuth();
  const theme = useTheme();

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Ensure date is valid before saving
    let dateToSave = formData.date;
    if (!dateToSave || (typeof dateToSave === 'object' && Object.keys(dateToSave).length === 0)) {
      dateToSave = new Date();
    } else if (typeof dateToSave === 'object' && 'isValid' in dateToSave && typeof dateToSave.isValid === 'function' && !dateToSave.isValid()) {
      dateToSave = new Date();
    }
    const newExpense = {
      ...formData,
      date: dayjs(dateToSave).toDate(),
      user: user?.email,
      ...(isSplit && splitData ? { isSplit: true, split: splitData } : {}),
    };
    const cleanedExpense = removeUndefined(newExpense);
    sendFormData(cleanedExpense);
    setFormData({
      expenseName: "",
      price: null,
      category: "",
      description: "",
      date: null,
      isRecurring: false,
      frequency: "monthly",
      currency: "INR",
    });
    setSplitData(null);
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

  const handleRecurringToggle = (event: any) => {
    setFormData({ ...formData, isRecurring: event.target.checked });
  };

  useEffect(() => {
    if (initialExpenseValue) {
      const { expenseName, price, category, description, date, isRecurring, frequency, currency } =
        initialExpenseValue;
      console.log("initialExpenseValue", initialExpenseValue);
        let jsDate = null;
      if (date && typeof date === 'object' && Object.keys(date).length === 0) {
        jsDate = null;
      } else if (date) {
        if (typeof date === 'object') {
          if ('toDate' in date && typeof date.toDate === 'function') {
            jsDate = date.toDate();
          } else if ('seconds' in date && typeof date.seconds === 'number') {
            jsDate = new Date(date.seconds * 1000);
          } else if (date instanceof Date) {
            jsDate = date;
          }
        } else if (typeof date === 'string') {
          jsDate = new Date(date);
        }
      }
      const formattedDate = jsDate && !isNaN(new Date(jsDate).getTime()) ? dayjs(jsDate) : null;
      setFormData({
        expenseName,
        price,
        category,
        description,
        date: formattedDate,
        isRecurring: isRecurring || false,
        frequency: frequency || "monthly",
        currency: currency || "INR",
      });
    }
  }, [initialExpenseValue]);

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: isEditForm ? '100%' : '800px',
        margin: '0 auto',
        padding: isEditForm ? '0' : '24px',
      }}
    >
      {!isEditForm && (
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1,
            }}
          >
            Add New Expense
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Track your spending to gain better financial insights
          </Typography>
        </Box>
      )}
      
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          background: isEditForm ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: isEditForm ? 'none' : 'blur(10px)',
          border: isEditForm ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: isEditForm ? '0' : '20px',
          padding: isEditForm ? '0' : '32px',
          boxShadow: isEditForm ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
              <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Expense Name"
            name="expenseName"
            value={formData.expenseName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
                '&:hover': {
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,1)',
                },
                '&.Mui-focused': {
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,1)',
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
                background: 'transparent',
                fontWeight: 500,
                zIndex: 2,
                padding: '0 4px',
                transition: 'color 0.2s',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.palette.primary.main,
                background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.9)',
                borderRadius: '4px',
                padding: '0 4px',
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
              '& .MuiFormHelperText-root': {
                color: theme.palette.text.secondary,
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label={`Price (${getCurrencySymbol(formData.currency || 'USD')})`}
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            required
            inputProps={{ min: 0, step: 0.01 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
                '&:hover': {
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,1)',
                },
                '&.Mui-focused': {
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,1)',
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
                background: 'transparent',
                fontWeight: 500,
                zIndex: 2,
                padding: '0 4px',
                transition: 'color 0.2s',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.palette.primary.main,
                background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.9)',
                borderRadius: '4px',
                padding: '0 4px',
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
              '& .MuiFormHelperText-root': {
                color: theme.palette.text.secondary,
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" sx={{
            '& .MuiInputLabel-root': {
              color: theme.palette.text.primary,
              background: 'transparent',
              fontWeight: 500,
              zIndex: 2,
              padding: '0 4px',
              transition: 'color 0.2s',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: theme.palette.primary.main,
              background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.9)',
              borderRadius: '4px',
              padding: '0 4px',
            },
            '& .MuiSelect-select': {
              color: theme.palette.text.primary,
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
              borderRadius: '12px',
              padding: '16.5px 14px',
              fontSize: '1rem',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0,0,0,0.23)',
            },
          }}>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
              labelId="currency-label"
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              label="Currency"
              sx={{
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
                color: theme.palette.text.primary,
              }}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth sx={{
            '& .MuiInputLabel-root': {
              color: theme.palette.text.primary,
              background: 'transparent',
              fontWeight: 500,
              zIndex: 2,
              padding: '0 4px',
              transition: 'color 0.2s',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: theme.palette.primary.main,
              background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.9)',
              borderRadius: '4px',
              padding: '0 4px',
            },
            '& .MuiSelect-select': {
              color: theme.palette.text.primary,
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
              borderRadius: '12px',
              padding: '16.5px 14px',
              fontSize: '1rem',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0,0,0,0.23)',
            },
          }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              required
              sx={{
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
                color: theme.palette.text.primary,
              }}
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
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
                '&:hover': {
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,1)',
                },
                '&.Mui-focused': {
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,1)',
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
                background: 'transparent',
                fontWeight: 500,
                zIndex: 2,
                padding: '0 4px',
                transition: 'color 0.2s',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.palette.primary.main,
                background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.9)',
                borderRadius: '4px',
                padding: '0 4px',
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
              '& .MuiFormHelperText-root': {
                color: theme.palette.text.secondary,
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              slotProps={{
                textField: {
                  helperText: "MM/DD/YYYY",
                  fullWidth: true,
                  margin: "normal",
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                      borderRadius: '12px',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,1)',
                      },
                      '&.Mui-focused': {
                        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.text.primary,
                      background: 'transparent',
                      fontWeight: 500,
                      zIndex: 2,
                      padding: '0 4px',
                      transition: 'color 0.2s',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                      background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.9)',
                      borderRadius: '4px',
                      padding: '0 4px',
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.text.primary,
                    },
                    '& .MuiFormHelperText-root': {
                      color: theme.palette.text.secondary,
                    },
                  },
                },
              }}
              value={formData.date}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox onClick={handleTodaysDate} />}
              label="Today's date"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isRecurring || false}
                  onChange={handleRecurringToggle}
                />
              }
              label="Recurring Expense"
            />
          </FormGroup>
        </Grid>

        {/* Frequency field for recurring expenses */}
        {formData.isRecurring && (
          <Grid item xs={12}>
            <FormControl fullWidth sx={{
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
                background: 'transparent',
                fontWeight: 500,
                zIndex: 2,
                padding: '0 4px',
                transition: 'color 0.2s',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.palette.primary.main,
                background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.9)',
                borderRadius: '4px',
                padding: '0 4px',
              },
              '& .MuiSelect-select': {
                color: theme.palette.text.primary,
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
                padding: '16.5px 14px',
                fontSize: '1rem',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0,0,0,0.23)',
              },
            }}>
              <InputLabel id="frequency-label">Frequency</InputLabel>
              <Select
                labelId="frequency-label"
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                label="Frequency"
                sx={{
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                  borderRadius: '12px',
                  color: theme.palette.text.primary,
                }}
              >
                {frequencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={isSplit} onChange={(_, checked) => setIsSplit(checked)} />}
            label="Split Expense"
          />
        </Grid>
        {isSplit && (
          <Grid item xs={12}>
            <SplitExpenseForm
              totalAmount={Number(formData.price) || 0}
              onChange={setSplitData}
            />
          </Grid>
        )}
      </Grid>

      {isEditForm ? (
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            type="reset"
            variant="outlined"
            color="info"
            size="medium"
            onClick={handleClose}
            sx={{
              borderRadius: '12px',
              padding: '10px 24px',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: theme.palette.mode === 'dark' ?'rgba(255, 255, 255, 0.3)' : '#667eea',
              '&:hover': {
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            size="medium"
            sx={{
              borderRadius: '12px',
              padding: '10px 24px',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Apply
          </Button>
        </Box>
      ) : (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            mt: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '12px 32px',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Add Expense
        </Button>
      )}
      </Box>
    </Box>
  );
};

export default ExpenseForm;
