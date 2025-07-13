import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Avatar,
  useTheme as useMuiTheme,
} from "@mui/material";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useTheme } from "../context/ThemeContext";

function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, logOut } = useUserAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const menuStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: muiTheme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.04)',
    },
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
  };

  const handleNavigation = (url: string) => {
    navigate(url);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        background: muiTheme.palette.mode === 'dark' 
          ? 'rgba(30, 41, 59, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: muiTheme.palette.mode === 'dark' 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{ 
            fontWeight: "700",
            cursor: "pointer",
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: { xs: '1.5rem', md: '1.75rem' },
          }}
          onClick={() => navigate("/my-expense")}
        >
          Expensify
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Theme Toggle */}
            <IconButton 
              onClick={toggleTheme} 
              sx={{
                color: muiTheme.palette.text.primary,
                backgroundColor: muiTheme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: muiTheme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Navigation Buttons */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 1 }}>
              <Button
                color="inherit"
                startIcon={<PostAddOutlinedIcon />}
                onClick={() => navigate("/add-expense")}
                sx={{
                  color: muiTheme.palette.text.primary,
                  backgroundColor: muiTheme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Add Expense
              </Button>
              
              <Button
                color="inherit"
                startIcon={<AssessmentOutlinedIcon />}
                onClick={() => navigate("/my-expense")}
                sx={{
                  color: muiTheme.palette.text.primary,
                  backgroundColor: muiTheme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Expenses
              </Button>

              <Button
                color="inherit"
                startIcon={<AnalyticsOutlinedIcon />}
                onClick={() => navigate("/analytics")}
                sx={{
                  color: muiTheme.palette.text.primary,
                  backgroundColor: muiTheme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Analytics
              </Button>

              <Button
                color="inherit"
                startIcon={<AccountBalanceWalletOutlinedIcon />}
                onClick={() => navigate("/budgets")}
                sx={{
                  color: muiTheme.palette.text.primary,
                  backgroundColor: muiTheme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Budgets
              </Button>

              <Button
                color="inherit"
                startIcon={<RepeatOutlinedIcon />}
                onClick={() => navigate("/recurring")}
                sx={{
                  color: muiTheme.palette.text.primary,
                  backgroundColor: muiTheme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Recurring
              </Button>

              <Button
                color="inherit"
                startIcon={<FlagOutlinedIcon />}
                onClick={() => navigate("/goals")}
                sx={{
                  color: muiTheme.palette.text.primary,
                  backgroundColor: muiTheme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Goals
              </Button>
            </Box>

            {/* User Menu */}
            <IconButton
              color="inherit"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                marginLeft: 1,
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {getInitials(user?.displayName || user?.email || 'U')}
              </Avatar>
            </IconButton>
          </Box>
        )}

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{
            sx: {
              background: muiTheme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: muiTheme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              minWidth: '200px',
            }
          }}
        >
          <MenuItem
            sx={{
              ...menuStyle,
              borderBottom: muiTheme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              margin: '8px',
              borderRadius: '12px',
            }}
            onClick={() => handleNavigation("/my-expense")}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {getInitials(user?.displayName || user?.email || 'U')}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} color={muiTheme.palette.text.primary}>
                {user?.displayName || 'User'}
              </Typography>
              <Typography variant="caption" color={muiTheme.palette.text.secondary}>
                {user?.email}
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem
            sx={menuStyle}
            onClick={() => handleNavigation("/add-expense")}
          >
            <PostAddOutlinedIcon color="primary" />
            <Typography color={muiTheme.palette.text.primary}>Add Expense</Typography>
          </MenuItem>
          
          <MenuItem
            sx={menuStyle}
            onClick={() => handleNavigation("/my-expense")}
          >
            <AssessmentOutlinedIcon color="primary" />
            <Typography color={muiTheme.palette.text.primary}>My Expenses</Typography>
          </MenuItem>

          <MenuItem
            sx={menuStyle}
            onClick={() => handleNavigation("/analytics")}
          >
            <AnalyticsOutlinedIcon color="primary" />
            <Typography color={muiTheme.palette.text.primary}>Analytics</Typography>
          </MenuItem>

          <MenuItem
            sx={menuStyle}
            onClick={() => handleNavigation("/budgets")}
          >
            <AccountBalanceWalletOutlinedIcon color="primary" />
            <Typography color={muiTheme.palette.text.primary}>Budgets</Typography>
          </MenuItem>

          <MenuItem
            sx={menuStyle}
            onClick={() => handleNavigation("/recurring")}
          >
            <RepeatOutlinedIcon color="primary" />
            <Typography color={muiTheme.palette.text.primary}>Recurring Expenses</Typography>
          </MenuItem>

          <MenuItem
            sx={menuStyle}
            onClick={() => handleNavigation("/goals")}
          >
            <FlagOutlinedIcon color="primary" />
            <Typography color={muiTheme.palette.text.primary}>Financial Goals</Typography>
          </MenuItem>

          <MenuItem 
            sx={{
              ...menuStyle,
              borderTop: muiTheme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              margin: '8px',
              borderRadius: '12px',
              color: 'error.main',
            }} 
            onClick={handleLogout}
          >
            <LogoutOutlinedIcon color="error" />
            <Typography color="error">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
