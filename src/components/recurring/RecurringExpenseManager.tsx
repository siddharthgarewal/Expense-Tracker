import React, { useState, useEffect } from 'react';
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
  Switch,
  FormControlLabel,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CalendarToday } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { ExpenseService } from '../../services/expense.service';
import { useUserAuth } from '../context/UserAuthContext';
import { useSnackbar } from 'notistack';
import { RecurringExpense, categories, frequencyOptions } from '../add-expense-form/expenseForm.type';

const RecurringExpenseManager: React.FC = () => {
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const { enqueueSnackbar } = useSnackbar();
  const expenseService = new ExpenseService();

  const [formData, setFormData] = useState({
    expenseName: '',
    price: '',
    category: '',
    description: '',
    frequency: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    nextDueDate: dayjs() as Dayjs,
    isActive: true,
  });

  useEffect(() => {
    loadRecurringExpenses();
  }, []);

  const loadRecurringExpenses = async () => {
    try {
      setLoading(true);
      const snapshot = await expenseService.getRecurringExpenses(user);
      const expenses = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        nextDueDate: doc.data().nextDueDate?.toDate() || new Date(),
      })) as RecurringExpense[];
      
      setRecurringExpenses(expenses);
    } catch (error) {
      enqueueSnackbar('Failed to load recurring expenses', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const recurringExpenseData: RecurringExpense = {
        expenseName: formData.expenseName,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        frequency: formData.frequency,
        nextDueDate: formData.nextDueDate.toDate(),
        isActive: formData.isActive,
        userId: user?.email ?? '',
        createdAt: new Date(),
      };

      if (editingExpense) {
        await expenseService.updateRecurringExpense(recurringExpenseData, editingExpense.id!);
        enqueueSnackbar('Recurring expense updated successfully', { variant: 'success' });
      } else {
        await expenseService.addRecurringExpense(recurringExpenseData);
        enqueueSnackbar('Recurring expense added successfully', { variant: 'success' });
      }

      setOpenDialog(false);
      setEditingExpense(null);
      resetForm();
      loadRecurringExpenses();
    } catch (error) {
      enqueueSnackbar('Failed to save recurring expense', { variant: 'error' });
    }
  };

  const handleEdit = (expense: RecurringExpense) => {
    setEditingExpense(expense);
    setFormData({
      expenseName: expense.expenseName,
      price: expense.price.toString(),
      category: expense.category,
      description: expense.description,
      frequency: expense.frequency,
      nextDueDate: dayjs(expense.nextDueDate),
      isActive: expense.isActive,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (expenseId: string) => {
    try {
      await expenseService.deleteRecurringExpense(expenseId);
      enqueueSnackbar('Recurring expense deleted successfully', { variant: 'success' });
      loadRecurringExpenses();
    } catch (error) {
      enqueueSnackbar('Failed to delete recurring expense', { variant: 'error' });
    }
  };

  const handleToggleActive = async (expense: RecurringExpense) => {
    try {
      const updatedExpense = { ...expense, isActive: !expense.isActive };
      await expenseService.updateRecurringExpense(updatedExpense, expense.id!);
      enqueueSnackbar(
        `Recurring expense ${updatedExpense.isActive ? 'activated' : 'deactivated'} successfully`,
        { variant: 'success' }
      );
      loadRecurringExpenses();
    } catch (error) {
      enqueueSnackbar('Failed to update recurring expense', { variant: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      expenseName: '',
      price: '',
      category: '',
      description: '',
      frequency: 'monthly',
      nextDueDate: dayjs(),
      isActive: true,
    });
  };

  const getNextDueDate = (expense: RecurringExpense) => {
    const dueDate = dayjs(expense.nextDueDate);
    const now = dayjs();
    
    if (dueDate.isBefore(now)) {
      return 'Overdue';
    }
    
    return dueDate.format('MMM DD, YYYY');
  };

  const getDaysUntilDue = (expense: RecurringExpense) => {
    const dueDate = dayjs(expense.nextDueDate);
    const now = dayjs();
    const daysDiff = dueDate.diff(now, 'day');
    
    if (daysDiff < 0) return Math.abs(daysDiff);
    return daysDiff;
  };

  const getDueStatusColor = (expense: RecurringExpense) => {
    const daysUntilDue = getDaysUntilDue(expense);
    if (daysUntilDue === 0) return 'error';
    if (daysUntilDue <= 7) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Recurring Expenses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Recurring Expense
        </Button>
      </Box>

      <Grid container spacing={3}>
        {recurringExpenses.map((expense) => {
          const daysUntilDue = getDaysUntilDue(expense);
          const isOverdue = daysUntilDue > 0 && dayjs(expense.nextDueDate).isBefore(dayjs());

          return (
            <Grid item xs={12} md={6} lg={4} key={expense.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">{expense.expenseName}</Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(expense)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(expense.id!)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    ${expense.price.toFixed(2)} - {expense.category}
                  </Typography>

                  {expense.description && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {expense.description}
                    </Typography>
                  )}

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary">
                      Next due: {getNextDueDate(expense)}
                    </Typography>
                  </Box>

                  {isOverdue && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      Overdue by {daysUntilDue} days
                    </Alert>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={expense.frequency}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={expense.isActive}
                          onChange={() => handleToggleActive(expense)}
                          size="small"
                        />
                      }
                      label={expense.isActive ? 'Active' : 'Inactive'}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {recurringExpenses.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No recurring expenses set up yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Add recurring expenses like subscriptions, rent, or utility bills
          </Typography>
        </Box>
      )}

      {/* Add/Edit Recurring Expense Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingExpense ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expense Name"
                value={formData.expenseName}
                onChange={(e) => setFormData({ ...formData, expenseName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
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
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  label="Frequency"
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'weekly' | 'monthly' | 'yearly' })}
                  required
                >
                  {frequencyOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Next Due Date"
                  value={formData.nextDueDate}
                  onChange={(date) => setFormData({ ...formData, nextDueDate: date || dayjs() })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingExpense ? 'Update' : 'Add'} Recurring Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecurringExpenseManager; 