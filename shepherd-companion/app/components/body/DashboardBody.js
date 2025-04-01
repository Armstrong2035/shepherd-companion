// components/dashboard/DashboardBody.js
"use client";
import { useState } from "react";
import { Box, Container } from "@mui/material";
import AddContact from "./contacts/AddContact";
import BottomNav from "../layouts/BottomNavigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTabContext } from "@mui/lab";

export default function DashboardBody() {
  const router = useRouter();
  const [navValue, setNavValue] = useState(0);

  const handleNavChange = (event, newValue) => {
    setNavValue(newValue);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ pb: 7 }}>
        <Box sx={{ mt: 2, mb: 8 }}>
          {navValue === 0 && <AddContact />}
          {navValue === 1 && router.push("/contacts")}
        </Box>
      </Container>

      <BottomNav value={navValue} onChange={handleNavChange} />
    </>
  );
}
