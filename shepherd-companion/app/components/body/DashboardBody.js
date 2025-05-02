// components/dashboard/DashboardBody.js
"use client";
import { useState } from "react";
import { 
  Box, 
  Paper, 
  Fade
} from "@mui/material";
import AddContact from "./contacts/AddContact";

export default function DashboardBody() {
  return (
    <Paper elevation={0} sx={{ 
      borderRadius: 2, 
      overflow: "hidden",
      mb: 3
    }}>
      <Fade in={true} timeout={300}>
        <Box sx={{ p: 0 }}>
          <AddContact />
        </Box>
      </Fade>
    </Paper>
  );
}
