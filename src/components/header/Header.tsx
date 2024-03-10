import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "white" }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ color: "text.secondary", fontWeight: "600" }}
        >
          Expense Tracker
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {/* <IconButton color="inherit">Your Search Icon</IconButton> */}
        <IconButton color="primary">
          <AccountCircleIcon sx={{ height: "2.5rem", width: "2.5rem" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
