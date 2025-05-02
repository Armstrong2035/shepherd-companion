// components/layouts/BottomNavigation.js
import { useState } from "react";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

export default function BottomNav({ value, onChange }) {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: 0,
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
      }}
      elevation={0}
    >
      <BottomNavigation 
        showLabels 
        value={value} 
        onChange={onChange}
        sx={{
          height: 64,
          backgroundColor: "white",
        }}
      >
        <BottomNavigationAction 
          label="Add Contact" 
          icon={<PersonAddOutlinedIcon />} 
          sx={{ 
            color: value === 0 ? "primary.main" : "text.secondary",
            "&.Mui-selected": {
              color: "primary.main",
            },
          }}
        />
        <BottomNavigationAction 
          label="Contacts" 
          icon={<PeopleOutlineIcon />} 
          sx={{ 
            color: value === 1 ? "primary.main" : "text.secondary",
            "&.Mui-selected": {
              color: "primary.main",
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
}
