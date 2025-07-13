import * as React from "react";
import { useState, MouseEventHandler } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Alert, 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  Grid 
} from "@mui/material";
import GoogleButton from "react-google-button";
import Loader from "../loader/Loader";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const { signIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoader(true);
    setError("");
    try {
      await signIn(email, password);
      navigate("/my-expense");
      setLoader(false);
    } catch (err: any) {
      setError(err.message);
      console.log(err);
      setLoader(false);
    }
  };

  const handleGoogleSignIn: MouseEventHandler<HTMLDivElement> = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    setLoader(true);
    try {
      await googleSignIn();
      navigate("/my-expense");
      setLoader(false);
    } catch (error: any) {
      setError(error.message);
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Avatar
              sx={{
                m: 1,
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
              }}
            >
              Sign in to your account to continue
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{
                mb: 3,
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fecaca',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.8)',
                },
                '& .MuiInputBase-input': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
                mb: 2,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.8)',
                },
                '& .MuiInputBase-input': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
                mb: 2,
              }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    '&.Mui-checked': {
                      color: '#667eea',
                    },
                  }}
                />
              }
              label="Remember me"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 3,
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
            
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <GoogleButton
                style={{ 
                  width: "100%",
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                type="dark"
                onClick={handleGoogleSignIn}
              />
            </Box>
            
            <Grid container spacing={1}>
              <Grid item xs>
                <Link 
                  to="#" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.875rem',
                  }}
                >
                  Don't have an account?{' '}
                  <Link 
                    to="/signup"
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#5a67d8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}
