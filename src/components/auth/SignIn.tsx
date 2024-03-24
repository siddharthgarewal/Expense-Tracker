import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, MouseEventHandler } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Stack } from "@mui/material";
import GoogleButton from "react-google-button";
import Loader from "../loader/Loader";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

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
      navigate("/add-expense");
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
      navigate("/add-expense");
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
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Stack sx={{ width: "100%" }} spacing={2}>
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError("")}
                  variant="filled"
                >
                  {error}
                </Alert>
              )}
            </Stack>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
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
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
                <GoogleButton
                  style={{ width: "100%" }}
                  type="dark"
                  onClick={handleGoogleSignIn}
                />
              </Box>
              <Grid container>
                <Grid item xs>
                  <Link to="#">Forgot password?</Link>
                </Grid>
                <Grid item>
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
