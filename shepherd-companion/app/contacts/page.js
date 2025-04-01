"use client";
import useAppStore from "../store/useAppStore";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import AssignedContacts from "../components/contacts/AssignedContacts";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function Contacts() {
  const {
    contacts,
    subscribeToContacts,
    subscribeToUserDocument,
    fetchAssignedContactIds,
    assignedToMe,
  } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [assignedContacts, setAssignedContacts] = useState([]);

  useEffect(() => {
    setLoading(true);
    
    // Start Firestore listeners
    const unsubscribeContacts = subscribeToContacts();
    const unsubscribeUser = subscribeToUserDocument();
    
    // Create a timeout to make sure contacts are loaded before we try to fetch assignments
    // This gives the contacts subscription time to load data first
    const timer = setTimeout(() => {
      fetchAssignedContactIds().finally(() => {
        setLoading(false);
      });
    }, 1500); // 1.5 second delay

    // Cleanup when unmounting
    return () => {
      clearTimeout(timer);
      unsubscribeContacts();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  // Refresh assigned contacts when contacts array changes
  useEffect(() => {
    if (contacts.length > 0) {
      fetchAssignedContactIds();
    }
  }, [contacts.length]); // Only run when the contacts array length changes

  // Filter contacts that are assigned to the current user
  useEffect(() => {
    if (contacts.length > 0 && assignedToMe.length > 0) {
      // First check if assignedToMe contains full contact objects or just IDs
      const isFullObjects =
        typeof assignedToMe[0] === "object" && assignedToMe[0] !== null;

      if (isFullObjects) {
        // We already have full objects
        setAssignedContacts(assignedToMe);
      } else {
        // We have IDs and need to filter
        // Make sure all IDs are strings for consistent comparison
        const stringIds = assignedToMe.map(id => String(id));
        const filtered = contacts.filter(contact => 
          stringIds.includes(String(contact.id))
        );
        setAssignedContacts(filtered);
      }
    } else {
      setAssignedContacts([]);
    }
  }, [contacts, assignedToMe]);

  // Keep the app clean in production by removing console logs
  
  return (
    <Box sx={{ padding: 2 }}>
      <AssignedContacts
        contacts={assignedContacts.length > 0 ? assignedContacts : assignedToMe}
      />
    </Box>
  );
}
