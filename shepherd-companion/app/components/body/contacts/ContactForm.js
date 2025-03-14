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
} from "@mui/material";

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

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            disabled={isSubmitting}
          />
        </Grid>

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
              />
            }
            label="This is also a WhatsApp number"
          />
        </Grid>

        {!formData.isWhatsApp && (
          <Grid item xs={12}>
            <TextField
              name="whatsAppNumber"
              label="WhatsApp Number (if different)"
              value={formData.whatsAppNumber}
              onChange={handleChange}
              fullWidth
              disabled={isSubmitting}
              placeholder="(123) 456-7890"
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            name="state"
            label="State"
            value={formData.state}
            onChange={handleChange}
            fullWidth
            disabled={isSubmitting}
            placeholder="State"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            disabled={isSubmitting}
            placeholder="City"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            disabled={isSubmitting}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth disabled={isSubmitting}>
            <InputLabel id="source-label">Source</InputLabel>
            <Select
              labelId="source-label"
              name="source"
              value={formData.source}
              onChange={handleChange}
              label="Source"
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
          <TextField
            name="notes"
            label="Notes"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            disabled={isSubmitting}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ py: 1.5 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Add Contact"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
