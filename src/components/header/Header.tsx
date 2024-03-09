import { AppBar, Toolbar, Typography, Box } from "@mui/material";

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
        {/* <IconButton color="inherit">Your Account Icon</IconButton> */}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
