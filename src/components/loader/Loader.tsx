import { Backdrop, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

function Loader() {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          height: "90vh",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    </Backdrop>
  );
}

export default Loader;
