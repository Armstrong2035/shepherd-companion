"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "@/context/AuthContext-simplified";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50", // Green color for church theme
      light: "#81C784",
      dark: "#388E3C",
    },
    secondary: {
      main: "#FFA000", // Amber color
    },
  },
  typography: {
    fontFamily: "inherit",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default function ClientRootLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
