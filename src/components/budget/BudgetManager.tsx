import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ExpenseService } from '../../services/expense.service';
import { useUserAuth } from '../context/UserAuthContext';
import { useSnackbar } from 'notistack';
import { BudgetData, categories, currencies } from '../add-expense-form/expenseForm.type';

const BudgetManager: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetData | null>(null);
  const [budgetSpending, setBudgetSpending] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const { enqueueSnackbar } = useSnackbar();
  const expenseService = new ExpenseService();

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'yearly',
    currency: 'USD',
  });

  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const snapshot = await expenseService.getBudgets(user);
      const budgetsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as BudgetData[];
      
      setBudgets(budgetsData);
      
      // Load spending data for each budget
      const spendingData: Record<string, number> = {};
      for (const budget of budgetsData) {
        const currentDate = new Date();
        const startDate = budget.period === 'monthly' 
          ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          : new Date(currentDate.getFullYear(), 0, 1);
        
        const expensesSnapshot = await expenseService.getExpensesByDateRange(
          user, 
          startDate, 
          currentDate
        );
        
        const categoryExpenses = expensesSnapshot.docs
          .map(doc => doc.data())
          .filter(expense => expense.category === budget.category)
          .reduce((sum, expense) => sum + (expense.price || 0), 0);
        
        spendingData[budget.id!] = categoryExpenses;
      }
      setBudgetSpending(spendingData);
    } catch (error) {
      enqueueSnackbar('Failed to load budgets', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleSubmit = async () => {
    try {
      const budgetData: BudgetData = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        period: formData.period,
        currency: formData.currency,
        userId: user?.email ?? '',
        createdAt: new Date(),
      };
      if (editingBudget) {
        await expenseService.updateBudget(budgetData, editingBudget.id!);
        enqueueSnackbar('Budget updated successfully', { variant: 'success' });
      } else {
        await expenseService.addBudget(budgetData);
        enqueueSnackbar('Budget added successfully', { variant: 'success' });
      }

      setOpenDialog(false);
      setEditingBudget(null);
      resetForm();
      loadBudgets();
    } catch (error) {
      enqueueSnackbar('Failed to save budget', { variant: 'error' });
    }
  };

  const handleEdit = (budget: BudgetData) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
      currency: budget.currency,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (budgetId: string) => {
    try {
      await expenseService.deleteBudget(budgetId);
      enqueueSnackbar('Budget deleted successfully', { variant: 'success' });
      loadBudgets();
    } catch (error) {
      enqueueSnackbar('Failed to delete budget', { variant: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      period: 'monthly',
      currency: 'USD',
    });
  };

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Budget Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Budget
        </Button>
      </Box>

      <Grid container spacing={3}>
        {budgets.map((budget) => {
          const spent = budgetSpending[budget.id!] || 0;
          const remaining = budget.amount - spent;
          const percentage = (spent / budget.amount) * 100;

          return (
            <Grid item xs={12} md={6} lg={4} key={budget.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">{budget.category}</Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(budget)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(budget.id!)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary">
                      Budget: {getCurrencySymbol(budget.currency)}{budget.amount.toFixed(2)} ({budget.period})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Spent: {getCurrencySymbol(budget.currency)}{spent.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Remaining: {getCurrencySymbol(budget.currency)}{remaining.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentage, 100)}
                      color={getProgressColor(spent, budget.amount) as any}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {percentage.toFixed(1)}% used
                    </Typography>
                  </Box>

                  <Chip
                    label={`${budget.period} budget`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {budgets.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No budgets set up yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Create your first budget to start tracking your spending
          </Typography>
        </Box>
      )}

      {/* Add/Edit Budget Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBudget ? 'Edit Budget' : 'Add New Budget'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={formData.period}
                  label="Period"
                  onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'yearly' })}
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  label="Currency"
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBudget ? 'Update' : 'Add'} Budget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetManager; 