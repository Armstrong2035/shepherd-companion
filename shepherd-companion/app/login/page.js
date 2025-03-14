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
} from "@mui/material";

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
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Shepherd CRM
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Companion App
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Sign In"}
      </Button>

      <Button
        fullWidth
        variant="outlined"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        Sign in with Google
      </Button>

      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Don't have an account?{" "}
          <Button
            component="a"
            href="/register"
            color="primary"
            sx={{ fontWeight: "normal", p: 0, textTransform: "none" }}
          >
            Register here
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
