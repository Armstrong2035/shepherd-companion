// components/contacts/StatusNotification.js
import { Alert } from "@mui/material";

export default function StatusNotification({ success, error, onClose }) {
  if (!success && !error) return null;

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={onClose}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={onClose}>
          Contact added successfully!
        </Alert>
      )}
    </>
  );
}
