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
} from "@mui/material";

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
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Shepherd CRM
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Create Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
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
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Register"}
      </Button>

      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Already have an account?{" "}
          <Button
            component="a"
            href="/login"
            color="primary"
            sx={{ fontWeight: "normal", p: 0, textTransform: "none" }}
          >
            Sign in
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
