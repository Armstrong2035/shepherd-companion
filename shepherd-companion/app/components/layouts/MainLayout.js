"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  Avatar,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Fade,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import BottomNav from "./BottomNavigation";
import ThemeProvider from "./ThemeProvider";
import useAuth from "@/app/hooks/useAuth";
import { logout } from "@/firebase/auth";

export default function MainLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [navValue, setNavValue] = useState(0);

  // Set navigation based on current path
  useEffect(() => {
    if (pathname === "/dashboard") {
      setNavValue(0);
    } else if (pathname === "/contacts") {
      setNavValue(1);
    }
  }, [pathname]);

  const handleNavChange = (event, newValue) => {
    setNavValue(newValue);
    if (newValue === 0) {
      router.push("/dashboard");
    } else if (newValue === 1) {
      router.push("/contacts");
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    router.push("/login");
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user && pathname !== "/login" && pathname !== "/register") {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  // Get first letter of display name for avatar
  const getInitial = () => {
    if (profile?.displayName) {
      return profile.displayName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  // Show loading state
  if (loading) {
    return (
      <ThemeProvider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f9f9fa",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  // Don't show layout for login and register pages
  if (pathname === "/login" || pathname === "/register" || !user) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f9f9fa", pb: 10 }}>
        <AppBar 
          position="static" 
          color="transparent" 
          elevation={0}
          sx={{ 
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            backgroundColor: "white",
          }}
        >
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600, flexGrow: 1 }}>
              Shepherd
            </Typography>
            
            {profile && (
              <div>
                <IconButton
                  size="small"
                  onClick={handleMenu}
                  sx={{ ml: 2 }}
                >
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: "primary.main",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    {getInitial()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">{profile.displayName}</Typography>
                  </MenuItem>
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {profile.role}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                    Sign Out
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Fade in={true} timeout={300}>
            <Box>
              {children}
            </Box>
          </Fade>
        </Container>

        <BottomNav value={navValue} onChange={handleNavChange} />
      </Box>
    </ThemeProvider>
  );
}