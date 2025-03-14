// components/dashboard/DashboardBody.js
"use client";
import { useState } from "react";
import { Box, Container } from "@mui/material";
import AddContact from "./contacts/AddContact";
import BottomNav from "../layouts/BottomNavigation";

export default function DashboardBody() {
  const [navValue, setNavValue] = useState(0);

  const handleNavChange = (event, newValue) => {
    setNavValue(newValue);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ pb: 7 }}>
        <Box sx={{ mt: 2, mb: 8 }}>
          {navValue === 0 && <AddContact />}
          {navValue === 1 && (
            <Box
              sx={{
                height: "calc(100vh - 220px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Contacts list will be here
            </Box>
          )}
        </Box>
      </Container>

      <BottomNav value={navValue} onChange={handleNavChange} />
    </>
  );
}
