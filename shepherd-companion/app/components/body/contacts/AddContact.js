// components/contacts/AddContact.js
import { useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import ContactForm from "./ContactForm";
import OfflineManager from "./OfflineManager";
import StatusNotification from "./StatusNotification";
import { validateContact } from "./formValidation";
import useAuth from "@/app/hooks/useAuth";
import { saveContact, syncContacts } from "@/firebase/contacts";

export default function AddContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user, profile } = useAuth();

  // Create contact object with required fields
  const createContactObject = (formData) => {
    const timestamp = new Date().toISOString();
    const userName = profile?.displayName || user?.email || "Unknown User";

    return {
      name: formData.name,
      state: formData.state,
      city: formData.city,
      phone: formData.phone,
      whatsApp: formData.isWhatsApp ? formData.phone : formData.whatsAppNumber,
      email: formData.email || null,
      notes: formData.notes || null,
      labels: [], // Empty array for label IDs
      status: "New",
      activities: [
        {
          text: `${formData.name} was added by ${userName}`,
          timestamp,
          userId: user.uid,
        },
      ],
      assignedTo: null, // Null by default
      source: formData.source,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: user.uid,
    };
  };

  // Handle sync of offline contacts
  const handleSync = async (offlineContacts) => {
    try {
      setIsSubmitting(true);
      const result = await syncContacts(offlineContacts);

      if (result.successful.length > 0) {
        setSuccess(true);
        return result.successful;
      }

      if (result.failed.length > 0) {
        setError(`Failed to sync ${result.failed.length} contacts`);
      }

      return [];
    } catch (err) {
      setError("Failed to sync contacts: " + err.message);
      return [];
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    // Validate form data
    const validation = validateContact(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await saveContact(formData);
      setSuccess(true);
    } catch (err) {
      console.error("Error adding contact:", err);
      setError(err.message || "Failed to add contact");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStatus = () => {
    setError("");
    setSuccess(false);
  };

  return (
    <Box>
      <OfflineManager onSync={handleSync}>
        {({ isOnline, saveOffline }) => (
          <>
            <StatusNotification
              success={success}
              error={error}
              onClose={resetStatus}
            />

            <Box sx={{ backgroundColor: "white", p: 3 }}>
              <ContactForm
                onSubmit={(formData) => {
                  if (!isOnline) {
                    // Save offline
                    const contactObject = createContactObject(formData);
                    saveOffline(contactObject);
                    setSuccess(true);
                  } else {
                    // Save online
                    handleSubmit(formData);
                  }
                }}
                isSubmitting={isSubmitting}
              />
            </Box>
          </>
        )}
      </OfflineManager>
    </Box>
  );
}
