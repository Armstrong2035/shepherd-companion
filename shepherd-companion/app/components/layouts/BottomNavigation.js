// components/layouts/BottomNavigation.js
import { useState } from "react";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";

export default function BottomNav({ value, onChange }) {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation showLabels value={value} onChange={onChange}>
        <BottomNavigationAction label="Add Contact" icon={<PersonAddIcon />} />
        <BottomNavigationAction label="Contacts" icon={<PeopleIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
