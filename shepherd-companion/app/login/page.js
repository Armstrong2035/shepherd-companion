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
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, authError, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const success = await loginWithGoogle();
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
              Companion App
            </Typography>
          </Box>

          {authError && (
            <Alert
              severity="error"
              sx={{ width: "100%", mb: 2 }}
              onClose={clearError}
            >
              {authError}
            </Alert>
          )}

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
              autoComplete="current-password"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </form>

          <Divider sx={{ width: "100%", my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{ mb: 2, py: 1.5 }}
          >
            Sign in with Google
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account yet?{" "}
              <Link href="/register" passHref>
                <MuiLink component="span">Register here</MuiLink>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
}
