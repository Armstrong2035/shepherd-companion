// components/contacts/OfflineManager.js
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";

export default function OfflineManager({ children, onSync }) {
  const [isOnline, setIsOnline] = useState(true);
  const [unsyncedContacts, setUnsyncedContacts] = useState([]);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    // Add event listeners for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Load any unsynced contacts from localStorage
    const storedContacts = localStorage.getItem("unsyncedContacts");
    if (storedContacts) {
      setUnsyncedContacts(JSON.parse(storedContacts));
    }

    // Clean up listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync unsaved contacts when back online
  useEffect(() => {
    if (isOnline && unsyncedContacts.length > 0 && onSync) {
      onSync(unsyncedContacts);
    }
  }, [isOnline, unsyncedContacts, onSync]);

  // Save contact to localStorage for offline support
  const saveOffline = (contactData) => {
    const newUnsyncedContacts = [...unsyncedContacts, contactData];
    setUnsyncedContacts(newUnsyncedContacts);
    localStorage.setItem(
      "unsyncedContacts",
      JSON.stringify(newUnsyncedContacts)
    );
    return true;
  };

  // Clear specific contacts from offline storage
  const clearOfflineContacts = (contactsToRemove) => {
    const remainingContacts = unsyncedContacts.filter(
      (contact) => !contactsToRemove.includes(contact)
    );
    setUnsyncedContacts(remainingContacts);
    localStorage.setItem("unsyncedContacts", JSON.stringify(remainingContacts));
  };

  return (
    <>
      {!isOnline && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You're currently offline. Data will be saved locally and synced when
          you're back online.
        </Alert>
      )}

      {unsyncedContacts.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You have {unsyncedContacts.length} contact(s) waiting to be synced.
        </Alert>
      )}

      {children({
        isOnline,
        unsyncedContacts,
        saveOffline,
        clearOfflineContacts,
      })}
    </>
  );
}
