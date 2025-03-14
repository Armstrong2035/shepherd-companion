// app/dashboard/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { logout } from "@/firebase/auth";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import DashboardBody from "../components/body/DashboardBody";

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {profile && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Welcome, {profile.displayName}</Typography>
          <Typography variant="body1" color="textSecondary">
            Role: {profile.role}
          </Typography>
        </Box>
      )}

      <Button variant="contained" color="primary" onClick={handleLogout}>
        Sign Out
      </Button>

      <DashboardBody />
    </Box>
  );
}
