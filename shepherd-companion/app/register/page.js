"use client";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { register, authError, clearError } = useAuth();

  const validateForm = () => {
    clearError();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const success = await register(email, password);
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            mt: 8,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: 3, textAlign: "center" }}>
            {/* Replace with your actual logo */}
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              color="primary"
            >
              Shepherd CRM
            </Typography>
            <Typography variant="h5" component="h1" gutterBottom>
              Create Account
            </Typography>
          </Box>

          {(authError || formError) && (
            <Alert
              severity="error"
              sx={{ width: "100%", mb: 2 }}
              onClose={() => {
                clearError();
                setFormError("");
              }}
            >
              {formError || authError}
            </Alert>
          )}

          <Alert severity="info" sx={{ width: "100%", mb: 3 }}>
            You can only register if your email has been pre-registered by an
            administrator.
          </Alert>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link href="/login" passHref>
                <MuiLink component="span">Sign in</MuiLink>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
}
