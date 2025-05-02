// components/contacts/ContactForm.js
import { useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotesIcon from "@mui/icons-material/Notes";
import SourceIcon from "@mui/icons-material/Source";

const contactSources = [
  "Church Service",
  "Outreach Program",
  "Website",
  "Referral",
  "Social Media",
  "Community Event",
  "Other",
];

export default function ContactForm({
  onSubmit,
  isSubmitting,
  initialData = {},
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    state: initialData.location || "",
    city: initialData.city || "",
    phone: initialData.phone || "",
    isWhatsApp: initialData.isWhatsApp || false,
    whatsAppNumber: initialData.whatsAppNumber || "",
    email: initialData.email || "",
    notes: initialData.notes || "",
    source: initialData.source || "Outreach Program",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // If user checks that phone is WhatsApp, copy phone to WhatsApp field
    if (name === "isWhatsApp" && checked) {
      setFormData((prev) => ({
        ...prev,
        whatsAppNumber: prev.phone,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Field styling for consistent Notion-like appearance
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.2)',
        boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px inset',
      },
      '&.Mui-focused': {
        boxShadow: 'rgba(46, 117, 204, 0.15) 0px 0px 0px 2px inset',
        border: '1px solid #2E75CC',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.9rem',
    },
  };

  // Section title styling
  const sectionTitleSx = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'text.secondary',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    mt: 3,
    mb: 2,
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Add New Contact
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonAddOutlinedIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography sx={sectionTitleSx}>Basic Information</Typography>
          </Box>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            disabled={isSubmitting}
            sx={fieldSx}
            placeholder="John Doe"
            variant="outlined"
          />
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PhoneIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography sx={sectionTitleSx}>Contact Information</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
                disabled={isSubmitting}
                placeholder="(123) 456-7890"
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isWhatsApp"
                    checked={formData.isWhatsApp}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    sx={{
                      color: '#2E75CC',
                      '&.Mui-checked': {
                        color: '#2E75CC',
                      },
                    }}
                  />
                }
                label="This is also a WhatsApp number"
              />
            </Grid>

            {!formData.isWhatsApp && (
              <Grid item xs={12} sm={6}>
                <TextField
                  name="whatsAppNumber"
                  label="WhatsApp Number"
                  value={formData.whatsAppNumber}
                  onChange={handleChange}
                  fullWidth
                  disabled={isSubmitting}
                  placeholder="(123) 456-7890"
                  sx={fieldSx}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                disabled={isSubmitting}
                placeholder="email@example.com"
                sx={fieldSx}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Location */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography sx={sectionTitleSx}>Location</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="state"
                label="State"
                value={formData.state}
                onChange={handleChange}
                fullWidth
                disabled={isSubmitting}
                placeholder="California"
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                disabled={isSubmitting}
                placeholder="San Francisco"
                sx={fieldSx}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SourceIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography sx={sectionTitleSx}>Source</Typography>
          </Box>
          <FormControl fullWidth disabled={isSubmitting} sx={fieldSx}>
            <InputLabel id="source-label">How did you meet this person?</InputLabel>
            <Select
              labelId="source-label"
              name="source"
              value={formData.source}
              onChange={handleChange}
              label="How did you meet this person?"
            >
              {contactSources.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotesIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography sx={sectionTitleSx}>Notes</Typography>
          </Box>
          <TextField
            name="notes"
            label="Additional notes about this contact"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            disabled={isSubmitting}
            sx={fieldSx}
            placeholder="Any additional information about this contact..."
          />
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ 
              py: 1.5,
              mt: 2,
              textTransform: 'none',
              fontSize: '1rem',
            }}
            startIcon={<PersonAddOutlinedIcon />}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Add Contact"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
