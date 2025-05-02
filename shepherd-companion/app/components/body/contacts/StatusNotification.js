// components/contacts/StatusNotification.js
import { Alert, Box, Typography, IconButton, Collapse, Fade } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";

export default function StatusNotification({ success, error, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (success || error) {
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) setTimeout(onClose, 300); // Call onClose after fade out animation
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error, onClose]);
  
  if (!success && !error) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300); // Call onClose after fade out animation
  };

  return (
    <Fade in={isVisible}>
      <Box 
        sx={{ 
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: error ? "rgba(211, 47, 47, 0.05)" : "rgba(46, 125, 50, 0.05)",
          border: "1px solid",
          borderColor: error ? "rgba(211, 47, 47, 0.2)" : "rgba(46, 125, 50, 0.2)",
          py: 1.5,
          px: 2,
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {error ? (
          <ErrorOutlineIcon color="error" sx={{ mr: 1.5 }} />
        ) : (
          <CheckCircleOutlineIcon color="success" sx={{ mr: 1.5 }} />
        )}
        
        <Typography 
          variant="body2" 
          sx={{ 
            flex: 1,
            color: error ? "error.main" : "success.main",
            fontWeight: 500,
          }}
        >
          {error || "Contact added successfully!"}
        </Typography>
        
        <IconButton 
          size="small" 
          onClick={handleClose}
          sx={{ 
            color: error ? "error.main" : "success.main",
            opacity: 0.7,
            '&:hover': {
              opacity: 1,
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Fade>
  );
}
