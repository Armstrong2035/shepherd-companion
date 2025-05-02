// app/register/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, formatAuthError } from "../../firebase/auth";
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

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(email, password);
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
              onSubmit={handleRegister}
              sx={{ maxWidth: 400, mx: "auto" }}
            >
              <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                Shepherd CRM
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
                Create Account
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

              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(46, 117, 204, 0.05)",
                  border: "1px solid rgba(46, 117, 204, 0.2)",
                }}
              >
                You can only register if your email has been pre-registered by an
                administrator.
              </Alert>

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
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>

              <Box mt={3} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Button
                    component="a"
                    href="/login"
                    color="primary"
                    sx={{ fontWeight: 500, p: 0, textTransform: "none" }}
                  >
                    Sign in
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
