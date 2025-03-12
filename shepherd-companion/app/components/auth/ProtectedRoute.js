// components/auth/ProtectedRoute.js
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (
      !loading &&
      !user &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
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

  // If on login/register page and user is authenticated, redirect to dashboard
  if ((pathname === "/login" || pathname === "/register") && user) {
    router.push("/dashboard");
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

  return children;
}
