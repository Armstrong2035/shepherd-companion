"use client";
import useAppStore from "../store/useAppStore";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import AssignedContacts from "../components/contacts/AssignedContacts";
import { auth } from "@/firebase/config";

export default function Contacts() {
  const {
    contacts,
    subscribeToContacts,
    fetchAssignedContacts,
    assignedToMe,
  } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [assignedContacts, setAssignedContacts] = useState([]);

  useEffect(() => {
    // Start Firestore listeners
    const unsubscribeContacts = subscribeToContacts();

    // Load assigned contacts
    const loadAssignedContacts = async () => {
      setLoading(true);
      await fetchAssignedContacts();
      setLoading(false);
    };

    loadAssignedContacts();

    // Cleanup when unmounting
    return () => {
      unsubscribeContacts();
    };
  }, []);

  // Filter contacts that are assigned to the current user
  useEffect(() => {
    if (contacts.length > 0 && assignedToMe.length > 0) {
      // Check if assignedToMe contains full contact objects or just IDs
      const isFullObjects = typeof assignedToMe[0] === 'object' && assignedToMe[0] !== null;
      
      if (isFullObjects) {
        // We already have full objects
        setAssignedContacts(assignedToMe);
      } else {
        // We have IDs and need to filter
        const filtered = contacts.filter((contact) =>
          assignedToMe.includes(contact.id)
        );
        setAssignedContacts(filtered);
      }
    } else {
      setAssignedContacts([]);
    }
  }, [contacts, assignedToMe]);

  console.log("All contacts:", contacts);
  console.log("Assigned to me (page):", assignedContacts);

  return (
    <Box>
      <AssignedContacts contacts={assignedContacts.length > 0 ? assignedContacts : assignedToMe} />
    </Box>
  );
}
