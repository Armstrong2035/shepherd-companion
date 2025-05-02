// app/dashboard/page.js
"use client";
import { Box, Typography } from "@mui/material";
import DashboardBody from "../components/body/DashboardBody";
import useAuth from "../hooks/useAuth";
import MainLayout from "../components/layouts/MainLayout";

export default function Dashboard() {
  const { profile, user } = useAuth();

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Welcome, {profile?.displayName || user?.email}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Manage your contacts and assignments here
        </Typography>
      </Box>
      
      <DashboardBody />
    </MainLayout>
  );
}
