import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const menuStyle = {
    display: "flex",
    gap: "10px",
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    // const {user,logOut} = useUserAuth();
    // try{
    //   await logOut();
    // }catch(error){
    //   console.log(error);
    // }
  };

  const handleNavigation = (url: string) => {
    navigate(url);
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white" }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ color: "text.secondary", fontWeight: "600" }}
        >
          Expensify
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          color="primary"
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <AccountCircleIcon sx={{ height: "2.5rem", width: "2.5rem" }} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem sx={menuStyle} onClick={() => handleNavigation("/")}>
            <PostAddOutlinedIcon />
            Add Expense
          </MenuItem>
          <MenuItem
            sx={menuStyle}
            onClick={() => handleNavigation("/my-expense")}
          >
            <AssessmentOutlinedIcon />
            My Expenses
          </MenuItem>
          <MenuItem sx={menuStyle} onClick={handleClose}>
            <LogoutOutlinedIcon />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
