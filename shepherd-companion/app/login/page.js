// app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  loginWithEmail,
  loginWithGoogle,
  formatAuthError,
} from "../../firebase/auth";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Container,
} from "@mui/material";
import ThemeProvider from "../components/layouts/ThemeProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      router.push("/dashboard");
    } catch (error) {
      setError(formatAuthError(error.code) || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      setError(formatAuthError(error.code) || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <Box sx={{ 
        minHeight: "100vh", 
        backgroundColor: "#f9f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 8
      }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 2,
              border: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{ maxWidth: 400, mx: "auto" }}
            >
              <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                Shepherd CRM
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
                Companion App
              </Typography>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(211, 47, 47, 0.05)",
                    border: "1px solid rgba(211, 47, 47, 0.2)",
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px inset',
                    },
                    '&.Mui-focused': {
                      boxShadow: 'rgba(46, 117, 204, 0.15) 0px 0px 0px 2px inset',
                      border: '1px solid #2E75CC',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px inset',
                    },
                    '&.Mui-focused': {
                      boxShadow: 'rgba(46, 117, 204, 0.15) 0px 0px 0px 2px inset',
                      border: '1px solid #2E75CC',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem" }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{ py: 1.5, fontSize: "1rem" }}
              >
                Sign in with Google
              </Button>

              <Box mt={3} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Button
                    component="a"
                    href="/register"
                    color="primary"
                    sx={{ fontWeight: 500, p: 0, textTransform: "none" }}
                  >
                    Register here
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
