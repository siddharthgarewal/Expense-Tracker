import { Backdrop, CircularProgress, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";

interface LoaderProps {
  message?: string;
  size?: number;
  backdrop?: boolean;
  fullHeight?: boolean;
}

function Loader({ 
  message = "Loading...", 
  size = 40, 
  backdrop = true,
  fullHeight = true
}: LoaderProps) {
  const theme = useTheme();
  
  const LoaderContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
        height: fullHeight ? "90vh" : "400px",
        alignItems: "center",
        background: backdrop ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: backdrop ? 'none' : 'blur(10px)',
        border: backdrop ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: backdrop ? '0' : '20px',
        margin: backdrop ? '0' : '16px 0',
        boxShadow: backdrop ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <CircularProgress 
        size={size} 
        sx={{
          color: theme.palette.primary.main,
          mb: 2,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: backdrop ? 'white' : 'rgba(255, 255, 255, 0.9)',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>
      {/* Screen reader announcement */}
      <span className="sr-only">{message}</span>
    </Box>
  );
  
  if (backdrop) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        {LoaderContent}
      </Backdrop>
    );
  }
  
  return LoaderContent;
}

export default Loader;
