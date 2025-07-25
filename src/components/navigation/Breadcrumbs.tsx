import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Link, Box } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon, Home as HomeIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

const routeConfig: Record<string, BreadcrumbItem> = {
  '/': { label: 'Home', path: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> },
  '/my-expense': { label: 'My Expenses', path: '/my-expense' },
  '/add-expense': { label: 'Add Expense', path: '/add-expense' },
  '/analytics': { label: 'Analytics', path: '/analytics' },
  '/budgets': { label: 'Budgets', path: '/budgets' },
  '/recurring': { label: 'Recurring Expenses', path: '/recurring' },
  '/goals': { label: 'Financial Goals', path: '/goals' },
  '/groups': { label: 'Groups', path: '/groups' },
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Don't show breadcrumbs on sign-in/sign-up pages
  if (location.pathname === '/' || location.pathname === '/signup') {
    return null;
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    routeConfig['/'], // Always include home
  ];

  // Build breadcrumb trail
  let currentPath = '';
  pathnames.forEach((pathname, index) => {
    currentPath += `/${pathname}`;
    const routeItem = routeConfig[currentPath];
    
    if (routeItem) {
      breadcrumbItems.push(routeItem);
    } else if (pathname.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      // Handle dynamic routes like group IDs
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
      const parentRoute = routeConfig[parentPath];
      if (parentRoute && parentRoute.label === 'Groups') {
        breadcrumbItems.push({
          label: 'Group Details',
          path: currentPath,
        });
      }
    }
  });

  // Remove duplicates and ensure we don't show single item breadcrumbs
  const uniqueBreadcrumbs = breadcrumbItems.filter((item, index, arr) => 
    arr.findIndex(t => t.path === item.path) === index
  );

  if (uniqueBreadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: 3,
        padding: '12px 20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-ol': {
            alignItems: 'center',
          },
        }}
      >
        {uniqueBreadcrumbs.map((item, index) => {
          const isLast = index === uniqueBreadcrumbs.length - 1;
          
          if (isLast) {
            return (
              <Typography
                key={item.path}
                color="rgba(255, 255, 255, 0.9)"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
                aria-current="page"
              >
                {item.icon}
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={item.path}
              component={RouterLink}
              to={item.path}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 1)',
                  textDecoration: 'underline',
                },
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
