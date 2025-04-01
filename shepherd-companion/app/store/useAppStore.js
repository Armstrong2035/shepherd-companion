import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db, auth } from "@/firebase/config";
import { collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

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

      // ✅ Subscribe to Firestore in real time (Contacts)
      subscribeToContacts: () => {
        const contactsCollection = collection(db, "contacts");
        return onSnapshot(contactsCollection, (snapshot) => {
          const updatedContacts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ contacts: updatedContacts });
          
          // Update assignedToMe with full contact objects when contacts change
          const { assignedToMe } = get();
          if (assignedToMe && assignedToMe.length > 0) {
            // Check if assignedToMe contains ids (strings) or full objects
            const isIds = typeof assignedToMe[0] === 'string';
            
            if (isIds) {
              // We have IDs, need to convert to full objects
              const assignedContacts = updatedContacts.filter(contact => 
                assignedToMe.includes(contact.id)
              );
              if (assignedContacts.length > 0) {
                console.log("Updating assignedToMe with full contacts:", assignedContacts.length);
                set({ assignedToMe: assignedContacts });
              }
            }
          }
        });
      },

      // Fetch assigned contacts from user document
      fetchAssignedContacts: async () => {
        try {
          const user = auth.currentUser;
          if (!user) return [];
          
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) return [];
          
          const userData = userDoc.data();
          const assignedContactIds = userData.assignedToMe || [];
          
          console.log("User assignedToMe IDs:", assignedContactIds);
          
          // If we have contacts already loaded, use them to get the full contact objects
          const { contacts } = get();
          if (contacts.length > 0 && assignedContactIds.length > 0) {
            console.log("All contacts available:", contacts.length);
            const assignedContacts = contacts.filter(contact => 
              assignedContactIds.includes(contact.id)
            );
            console.log("Filtered assigned contacts:", assignedContacts);
            set({ assignedToMe: assignedContacts });
            return assignedContacts;
          }
          
          // Otherwise, just store the IDs for now - they'll be updated when contacts load
          console.log("No contacts loaded yet, storing empty array");
          set({ assignedToMe: assignedContactIds });
          return assignedContactIds;
        } catch (error) {
          console.error("Error fetching assigned contacts:", error);
          return [];
        }
      }
    }),
    { name: "app-storage" } // Local storage key
  )
);

export default useAppStore;
