import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { ExpenseService } from '../../services/expense.service';
import { useUserAuth } from '../context/UserAuthContext';
import { useSnackbar } from 'notistack';
import { query, where, getDocs, collection } from '@firebase/firestore';
import { db } from '../../firebase';
import { 
  TrendingUp, 
  AccountBalance, 
  Assessment, 
  Category,
  CalendarToday,
  MonetizationOn
} from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Set default chart options for better compatibility
ChartJS.defaults.color = '#4a5568';
ChartJS.defaults.font.family = "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif";

const AnalyticsDashboard: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const { enqueueSnackbar } = useSnackbar();
  const expenseService = new ExpenseService();
  const theme = useTheme();

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [selectedYear, selectedMonth, user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      console.log('Loading analytics for user:', user?.email, 'Year:', selectedYear, 'Month:', selectedMonth);
      
      // First, let's test if we can get any expenses at all
      if (user?.email) {
        const allExpensesQuery = query(collection(db, "allExpenses"), where("user", "==", user.email));
        const allExpensesSnapshot = await getDocs(allExpensesQuery);
        const allExpenses = allExpensesSnapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
        console.log('All expenses for user:', allExpenses);
      }
      
      const [monthlySummary, categoryBreakdown] = await Promise.all([
        expenseService.getMonthlySummary(user, selectedYear, selectedMonth),
        expenseService.getCategoryBreakdown(user)
      ]);

      console.log('Monthly summary:', monthlySummary);
      console.log('Category breakdown:', categoryBreakdown);

      setMonthlyData(monthlySummary);
      setCategoryData(categoryBreakdown);
    } catch (error) {
      console.error('Analytics error:', error);
      enqueueSnackbar('Failed to load analytics data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const categoryChartData = {
    labels: Object.keys(categoryData || {}),
    datasets: [
      {
        data: Object.values(categoryData || {}),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
          '#36A2EB', '#FFCE56', '#9966FF'
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Check if we have data to display
  const hasMonthlyData = monthlyData && monthlyData.categoryBreakdown && Object.keys(monthlyData.categoryBreakdown).length > 0;
  const hasCategoryData = categoryData && Object.keys(categoryData).length > 0;

  const monthlyChartData = {
    labels: Object.keys(monthlyData?.categoryBreakdown || {}),
    datasets: [
      {
        label: 'Amount Spent',
        data: Object.values(monthlyData?.categoryBreakdown || {}),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box className="loading-container">
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          Please sign in to view analytics
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      {/* Page Header */}
      <Box className="page-header">
        <Typography className="page-title">
          Analytics Dashboard
        </Typography>
        <Typography className="page-subtitle" sx={{ color: theme.palette.text.secondary }}>
          Track your spending patterns and financial insights
        </Typography>
      </Box>

      {/* Filters */}
      <Paper className="modern-container">
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <CalendarToday sx={{ color: theme.palette.text.secondary }} />
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
            Filter Period
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: theme.palette.text.secondary }}>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value as number)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(255, 255, 255, 0.95)',
                    },
                  },
                  '& .MuiSelect-icon': {
                    color: theme.palette.text.secondary,
                  },
                }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: theme.palette.text.secondary }}>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value as number)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(255, 255, 255, 0.95)',
                    },
                  },
                  '& .MuiSelect-icon': {
                    color: theme.palette.text.secondary,
                  },
                }}
              >
                {months.map((month, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              onClick={loadAnalytics}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                padding: '12px 24px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                },
              }}
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} className="modern-grid">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="modern-card">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <MonetizationOn sx={{ 
                  fontSize: '2rem', 
                  color: '#667eea',
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                }} />
                <Box>
                  <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                    Total Spent This Month
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    ${monthlyData?.totalAmount?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="modern-card">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Assessment sx={{ 
                  fontSize: '2rem', 
                  color: '#48bb78',
                  background: 'rgba(72, 187, 120, 0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                }} />
                <Box>
                  <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                    Number of Expenses
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#48bb78' }}>
                    {monthlyData?.expenseCount || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="modern-card">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TrendingUp sx={{ 
                  fontSize: '2rem', 
                  color: '#f59e0b',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                }} />
                <Box>
                  <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                    Average per Expense
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    ${monthlyData?.expenseCount > 0 
                      ? (monthlyData.totalAmount / monthlyData.expenseCount).toFixed(2) 
                      : '0.00'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="modern-card">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Category sx={{ 
                  fontSize: '2rem', 
                  color: '#e53e3e',
                  background: 'rgba(229, 62, 62, 0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                }} />
                <Box>
                  <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                    Categories Used
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#e53e3e' }}>
                    {Object.keys(monthlyData?.categoryBreakdown || {}).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* No Data Message */}
      {(!monthlyData || monthlyData.expenseCount === 0) && (
        <Paper className="modern-container">
          <Box textAlign="center" py={4}>
            <MonetizationOn sx={{ 
              fontSize: '4rem', 
              color: theme.palette.text.disabled, 
              mb: 2 
            }} />
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: theme.palette.text.primary, 
              mb: 2 
            }}>
              No Expenses Found for {months[selectedMonth - 1]} {selectedYear}
            </Typography>
            <Typography sx={{ 
              color: theme.palette.text.secondary, 
              mb: 3,
              maxWidth: '600px',
              mx: 'auto'
            }}>
              Start tracking your expenses to see detailed analytics and insights. 
              Add your first expense to begin building your financial overview.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/add-expense'}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Add Your First Expense
            </Button>
          </Box>
        </Paper>
      )}

      {/* Charts */}
      {(!monthlyData || monthlyData.expenseCount === 0) ? (
        <Paper className="modern-container">
          <Box textAlign="center" py={4}>
            <Assessment sx={{ 
              fontSize: '4rem', 
              color: theme.palette.text.disabled, 
              mb: 2 
            }} />
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: theme.palette.text.primary, 
              mb: 2 
            }}>
              Charts Will Appear Here
            </Typography>
            <Typography sx={{ 
              color: theme.palette.text.secondary, 
              mb: 3,
              maxWidth: '600px',
              mx: 'auto'
            }}>
              Once you add expenses, you'll see beautiful charts showing your spending patterns, 
              category distribution, and financial insights.
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3} className="modern-grid">
          <Grid item xs={12} md={6}>
            <Card className="modern-card">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <AccountBalance sx={{ color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Monthly Spending by Category
                  </Typography>
                </Box>
                <Box sx={{ height: 350 }}>
                  {hasMonthlyData ? (
                    <Bar
                      data={monthlyChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(30, 41, 59, 0.95)' 
                              : 'rgba(255, 255, 255, 0.95)',
                            titleColor: theme.palette.text.primary,
                            bodyColor: theme.palette.text.secondary,
                            borderColor: 'rgba(102, 126, 234, 0.2)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.1)',
                            },
                            ticks: {
                              color: theme.palette.text.secondary,
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                            ticks: {
                              color: theme.palette.text.secondary,
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        No data available for this month
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="modern-card">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Assessment sx={{ color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Overall Category Distribution
                  </Typography>
                </Box>
                <Box sx={{ height: 350 }}>
                  {hasCategoryData ? (
                    <Doughnut
                      data={categoryChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              usePointStyle: true,
                              color: theme.palette.text.secondary,
                            },
                          },
                          tooltip: {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(30, 41, 59, 0.95)' 
                              : 'rgba(255, 255, 255, 0.95)',
                            titleColor: theme.palette.text.primary,
                            bodyColor: theme.palette.text.secondary,
                            borderColor: 'rgba(102, 126, 234, 0.2)',
                            borderWidth: 1,
                            cornerRadius: 8,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        No category data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Debug Information */}
      <Paper className="modern-container">
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
          Debug Information
        </Typography>
        <Box sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            User: {user?.email}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Selected Year: {selectedYear}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Selected Month: {selectedMonth}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Monthly Data: {JSON.stringify(monthlyData, null, 2)}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Category Data: {JSON.stringify(categoryData, null, 2)}
          </Typography>
        </Box>
      </Paper>

      {/* Category Breakdown */}
      {categoryData && Object.keys(categoryData).length > 0 ? (
        <Paper className="modern-container">
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
            Category Breakdown
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(categoryData).map(([category, amount]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category}>
                <Chip
                  label={`${category}: $${(amount as number).toFixed(2)}`}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : (
        <Paper className="modern-container">
          <Box textAlign="center" py={3}>
            <Category sx={{ 
              fontSize: '3rem', 
              color: theme.palette.text.disabled, 
              mb: 2 
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: theme.palette.text.primary, 
              mb: 2 
            }}>
              No Categories Found
            </Typography>
            <Typography sx={{ 
              color: theme.palette.text.secondary, 
              mb: 2
            }}>
              Categories will appear here once you add expenses with different categories.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/add-expense'}
              sx={{
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.3)' 
                  : 'rgba(0, 0, 0, 0.3)',
                color: theme.palette.text.primary,
                borderRadius: '12px',
                padding: '8px 16px',
                '&:hover': {
                  borderColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.5)' 
                    : 'rgba(0, 0, 0, 0.5)',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              Add Expense
            </Button>
          </Box>
        </Paper>
      )}

      {/* No Expenses at All */}
      {categoryData && Object.keys(categoryData).length === 0 && (
        <Paper className="modern-container">
          <Box textAlign="center" py={6}>
            <MonetizationOn sx={{ 
              fontSize: '5rem', 
              color: theme.palette.text.disabled, 
              mb: 3 
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: theme.palette.text.primary, 
              mb: 3 
            }}>
              Welcome to Your Analytics Dashboard!
            </Typography>
            <Typography sx={{ 
              color: theme.palette.text.secondary, 
              mb: 4,
              maxWidth: '700px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}>
              This is where you'll see powerful insights about your spending habits. 
              Track your expenses to unlock detailed analytics, spending patterns, 
              and financial insights that will help you make better financial decisions.
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                onClick={() => window.location.href = '/add-expense'}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Add Your First Expense
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/my-expense'}
                sx={{
                  borderColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(0, 0, 0, 0.3)',
                  color: theme.palette.text.primary,
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.5)' 
                      : 'rgba(0, 0, 0, 0.5)',
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                View All Expenses
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AnalyticsDashboard; 