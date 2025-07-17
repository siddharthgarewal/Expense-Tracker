import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Receipt as ReceiptIcon, LocalDining as FoodIcon, DirectionsCar as TransportIcon } from '@mui/icons-material';
import { ExpenseService } from '../../services/expense.service';
import { useUserAuth } from '../context/UserAuthContext';
import { useSnackbar } from 'notistack';
import { categories, currencies } from '../add-expense-form/expenseForm.type';
import dayjs from 'dayjs';

interface QuickExpenseEntryProps {
  onExpenseAdded?: () => void;
}

const QuickExpenseEntry: React.FC<QuickExpenseEntryProps> = ({ onExpenseAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    expenseName: '',
    price: '',
    category: '',
    currency: 'INR',
  });
  const [recentExpenses, setRecentExpenses] = useState<string[]>([]);
  const { user } = useUserAuth();
  const { enqueueSnackbar } = useSnackbar();
  const expenseService = useMemo(() => new ExpenseService(), []);

  // Smart suggestions based on expense name
  const getSmartSuggestions = (expenseName: string) => {
    const name = expenseName.toLowerCase();
    
    if (name.includes('food') || name.includes('meal') || name.includes('restaurant') || name.includes('dinner') || name.includes('lunch')) {
      return 'Food';
    }
    if (name.includes('uber') || name.includes('taxi') || name.includes('gas') || name.includes('fuel') || name.includes('transport')) {
      return 'Transportation';
    }
    if (name.includes('netflix') || name.includes('spotify') || name.includes('amazon') || name.includes('entertainment')) {
      return 'Entertainment';
    }
    if (name.includes('rent') || name.includes('mortgage') || name.includes('housing')) {
      return 'Rent';
    }
    if (name.includes('grocery') || name.includes('supermarket') || name.includes('market')) {
      return 'Groceries';
    }
    if (name.includes('electricity') || name.includes('water') || name.includes('gas') || name.includes('utility')) {
      return 'Home and utilities';
    }
    if (name.includes('insurance') || name.includes('health')) {
      return 'Insurance';
    }
    if (name.includes('bill') || name.includes('emi') || name.includes('payment')) {
      return 'Bills & emis';
    }
    if (name.includes('school') || name.includes('course') || name.includes('education')) {
      return 'Education';
    }
    if (name.includes('doctor') || name.includes('medicine') || name.includes('pharmacy')) {
      return 'Health and personal care';
    }
    if (name.includes('shopping') || name.includes('clothes') || name.includes('store')) {
      return 'Shopping';
    }
    if (name.includes('travel') || name.includes('trip') || name.includes('vacation')) {
      return 'Travel';
    }
    if (name.includes('gym') || name.includes('membership') || name.includes('subscription')) {
      return 'Memberships';
    }
    
    return '';
  };

  const loadRecentExpenses = useCallback(async () => {
    try {
      const snapshot = await expenseService.getAllExpense(user);
      const expenses = snapshot.docs.map(doc => doc.data().expenseName);
      const uniqueExpenses = Array.from(new Set(expenses)).slice(0, 5);
      setRecentExpenses(uniqueExpenses);
    } catch (error) {
      console.error('Failed to load recent expenses:', error);
    }
  }, [user, expenseService]);

  useEffect(() => {
    loadRecentExpenses();
  }, [loadRecentExpenses]);

  const handleSubmit = async () => {
    if (!formData.expenseName || !formData.price || !formData.category) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'error' });
      return;
    }

    try {
      const newExpense = {
        expenseName: formData.expenseName,
        price: parseFloat(formData.price),
        category: formData.category,
        description: '',
        date: dayjs().toDate(),
        currency: formData.currency, // ensure currency is saved
        user: user?.email,
      };

      await expenseService.addExpense(newExpense);
      enqueueSnackbar('Expense added successfully', { variant: 'success' });
      setOpen(false);
      resetForm();
      onExpenseAdded?.();
      loadRecentExpenses();
    } catch (error) {
      enqueueSnackbar('Failed to add expense', { variant: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      expenseName: '',
      price: '',
      category: '',
      currency: 'INR',
    });
  };

  const handleExpenseNameChange = (value: string) => {
    setFormData({ ...formData, expenseName: value });
    const suggestedCategory = getSmartSuggestions(value);
    if (suggestedCategory && !formData.category) {
      setFormData(prev => ({ ...prev, category: suggestedCategory }));
    }
  };

  const quickActions = [
    {
      icon: <FoodIcon />,
      name: 'Food',
      action: () => {
        setFormData(prev => ({ ...prev, category: 'Food' }));
        setOpen(true);
      },
    },
    {
      icon: <TransportIcon />,
      name: 'Transport',
      action: () => {
        setFormData(prev => ({ ...prev, category: 'Transportation' }));
        setOpen(true);
      },
    },
    {
      icon: <ReceiptIcon />,
      name: 'Quick Entry',
      action: () => setOpen(true),
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="Quick expense entry"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {quickActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Quick Expense Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Autocomplete
              freeSolo
              options={recentExpenses}
              value={formData.expenseName}
              onChange={(_, value) => handleExpenseNameChange(value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Expense Name"
                  fullWidth
                  margin="normal"
                  required
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Typography variant="body2">{option}</Typography>
                </Box>
              )}
            />

            <TextField
              label="Amount"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <Autocomplete
              options={categories}
              value={formData.category}
              onChange={(_, value) => setFormData({ ...formData, category: value || '' })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  fullWidth
                  margin="normal"
                  required
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Chip label={option} size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{option}</Typography>
                </Box>
              )}
            />

            <Autocomplete
              options={currencies}
              getOptionLabel={(option) => `${option.code} (${option.symbol})`}
              value={currencies.find(c => c.code === formData.currency) || null}
              onChange={(_, value) => setFormData({ ...formData, currency: value?.code || 'USD' })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Currency"
                  fullWidth
                  margin="normal"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuickExpenseEntry; 