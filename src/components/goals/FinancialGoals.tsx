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
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Flag as FlagIcon } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { ExpenseService } from '../../services/expense.service';
import { useUserAuth } from '../context/UserAuthContext';
import { useSnackbar } from 'notistack';
import { FinancialGoal, currencies } from '../add-expense-form/expenseForm.type';

const FinancialGoals: React.FC = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const { enqueueSnackbar } = useSnackbar();
  const expenseService = new ExpenseService();

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: dayjs().add(1, 'year') as Dayjs,
    type: 'savings' as 'savings' | 'debt-reduction' | 'spending-limit',
    currency: 'USD',
  });

  const goalTypes = [
    { value: 'savings', label: 'Savings Goal', color: 'success' },
    { value: 'debt-reduction', label: 'Debt Reduction', color: 'error' },
    { value: 'spending-limit', label: 'Spending Limit', color: 'warning' },
  ];

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      const snapshot = await expenseService.getGoals(user);
      const goalsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        targetDate: doc.data().targetDate?.toDate() || new Date(),
      })) as FinancialGoal[];
      
      setGoals(goalsData);
    } catch (error) {
      enqueueSnackbar('Failed to load financial goals', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user, expenseService, enqueueSnackbar]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleSubmit = async () => {
    try {
      const goalData: FinancialGoal = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        targetDate: formData.targetDate.toDate(),
        type: formData.type,
        currency: formData.currency,
        userId: user?.email ?? '',
        createdAt: new Date(),
      };

      if (editingGoal) {
        await expenseService.updateGoal(goalData, editingGoal.id!);
        enqueueSnackbar('Financial goal updated successfully', { variant: 'success' });
      } else {
        await expenseService.addGoal(goalData);
        enqueueSnackbar('Financial goal added successfully', { variant: 'success' });
      }

      setOpenDialog(false);
      setEditingGoal(null);
      resetForm();
      loadGoals();
    } catch (error) {
      enqueueSnackbar('Failed to save financial goal', { variant: 'error' });
    }
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: dayjs(goal.targetDate),
      type: goal.type,
      currency: goal.currency,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (goalId: string) => {
    try {
      await expenseService.deleteGoal(goalId);
      enqueueSnackbar('Financial goal deleted successfully', { variant: 'success' });
      loadGoals();
    } catch (error) {
      enqueueSnackbar('Failed to delete financial goal', { variant: 'error' });
    }
  };

  const handleUpdateProgress = async (goal: FinancialGoal, newAmount: number) => {
    try {
      const updatedGoal = { ...goal, currentAmount: newAmount };
      await expenseService.updateGoal(updatedGoal, goal.id!);
      enqueueSnackbar('Goal progress updated successfully', { variant: 'success' });
      loadGoals();
    } catch (error) {
      enqueueSnackbar('Failed to update goal progress', { variant: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: dayjs().add(1, 'year'),
      type: 'savings',
      currency: 'USD',
    });
  };

  const getProgressPercentage = (goal: FinancialGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getProgressColor = (goal: FinancialGoal) => {
    const percentage = getProgressPercentage(goal);
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  const getDaysRemaining = (goal: FinancialGoal) => {
    const targetDate = dayjs(goal.targetDate);
    const now = dayjs();
    const daysDiff = targetDate.diff(now, 'day');
    return Math.max(0, daysDiff);
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  };

  const getGoalTypeColor = (type: string) => {
    const goalType = goalTypes.find(gt => gt.value === type);
    return goalType?.color || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Financial Goals</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Goal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.map((goal) => {
          const progressPercentage = getProgressPercentage(goal);
          const daysRemaining = getDaysRemaining(goal);
          const isCompleted = progressPercentage >= 100;
          const isOverdue = daysRemaining === 0 && !isCompleted;

          return (
            <Grid item xs={12} md={6} lg={4} key={goal.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">{goal.name}</Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(goal)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(goal.id!)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary">
                      Target: {getCurrencySymbol(goal.currency)}{goal.targetAmount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Current: {getCurrencySymbol(goal.currency)}{goal.currentAmount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Remaining: {getCurrencySymbol(goal.currency)}{(goal.targetAmount - goal.currentAmount).toFixed(2)}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      color={getProgressColor(goal) as any}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {progressPercentage.toFixed(1)}% complete
                    </Typography>
                  </Box>

                  {isOverdue && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Goal deadline has passed
                    </Alert>
                  )}

                  {isCompleted && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Goal completed! 🎉
                    </Alert>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Chip
                      label={goalTypes.find(gt => gt.value === goal.type)?.label}
                      size="small"
                      color={getGoalTypeColor(goal.type) as any}
                      variant="outlined"
                    />
                    <Typography variant="caption" color="textSecondary">
                      {daysRemaining} days remaining
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const newAmount = Math.min(goal.currentAmount + 100, goal.targetAmount);
                        handleUpdateProgress(goal, newAmount);
                      }}
                    >
                      +{getCurrencySymbol(goal.currency)}100
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const newAmount = Math.min(goal.currentAmount + 500, goal.targetAmount);
                        handleUpdateProgress(goal, newAmount);
                      }}
                    >
                      +{getCurrencySymbol(goal.currency)}500
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {goals.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <FlagIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No financial goals set yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Set your first financial goal to start tracking your progress
          </Typography>
        </Box>
      )}

      {/* Add/Edit Goal Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Edit Financial Goal' : 'Add Financial Goal'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Goal Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Amount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Amount"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Goal Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Goal Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  required
                >
                  {goalTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Target Date"
                  value={formData.targetDate}
                  onChange={(date) => setFormData({ ...formData, targetDate: date || dayjs() })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingGoal ? 'Update' : 'Add'} Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinancialGoals; 