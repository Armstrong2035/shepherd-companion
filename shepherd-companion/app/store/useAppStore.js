import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db, auth } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// Zustand store with persistence
const useAppStore = create(
  persist(
    (set, get) => ({
      contacts: [],
      assignedToMe: [],

      // Set assigned contacts
      setAssignedToMe: (assignedContacts) => {
        set({ assignedToMe: assignedContacts });
      },

      // Subscribe to the user document to get real-time assigned contacts updates
      subscribeToUserDocument: () => {
        const user = auth.currentUser;
        if (!user) return () => {}; // Return empty function if no user

        const userDocRef = doc(db, "users", user.uid);

        return onSnapshot(userDocRef, (docSnapshot) => {
          if (!docSnapshot.exists()) return;

          const userData = docSnapshot.data();
          const assignedContactIds = userData.assignedToMe || [];

          // Get the latest contacts
          const { contacts } = get();

          if (contacts.length > 0 && assignedContactIds.length > 0) {
            // Convert all IDs to strings for consistent comparison
            const stringIds = assignedContactIds.map((id) => String(id));

            // Convert IDs to full contact objects
            const assignedContacts = contacts.filter((contact) =>
              stringIds.includes(String(contact.id))
            );
            
            set({ assignedToMe: assignedContacts });
          } else {
            // Store the IDs for now
            set({ assignedToMe: assignedContactIds });
          }
        });
      },

      // Subscribe to Firestore in real time (Contacts)
      subscribeToContacts: () => {
        const contactsCollection = collection(db, "contacts");
        return onSnapshot(contactsCollection, (snapshot) => {
          const updatedContacts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ contacts: updatedContacts });

          // Update assigned contacts if we have IDs but not full objects
          const { assignedToMe } = get();
          if (assignedToMe && assignedToMe.length > 0) {
            // Check if assignedToMe contains IDs (strings) rather than objects
            const isIds = typeof assignedToMe[0] === "string";

            if (isIds) {
              // Convert all IDs to strings for consistent comparison
              const stringIds = assignedToMe.map((id) => String(id));

              // Convert IDs to full objects using the updated contacts
              const assignedContacts = updatedContacts.filter((contact) =>
                stringIds.includes(String(contact.id))
              );

              if (assignedContacts.length > 0) {
                set({ assignedToMe: assignedContacts });
              }
            }
          }
        });
      },

      // Fetch assigned contacts from user document
      fetchAssignedContactIds: async () => {
        try {
          const user = auth.currentUser;
          if (!user) return [];

          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) return [];

          const userData = userDoc.data();
          const assignedContactIds = userData.assignedToMe || [];
          
          // Get the latest contacts to convert IDs to full objects
          const { contacts } = get();
          if (contacts.length > 0 && assignedContactIds.length > 0) {
            // Convert all IDs to strings for consistent comparison
            const stringIds = assignedContactIds.map(id => String(id));
            
            // Convert IDs to full objects
            const assignedContacts = contacts.filter(contact => 
              stringIds.includes(String(contact.id))
            );
            
            set({ assignedToMe: assignedContacts });
            return assignedContacts;
          }
          
          // Store IDs if contacts aren't available yet
          set({ assignedToMe: assignedContactIds });
          return assignedContactIds;
        } catch (error) {
          console.error("Error fetching assigned contacts:", error);
          return [];
        }
      },
    }),
    { name: "app-storage" } // Local storage key
  )
);

export default useAppStore;