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

      // ✅ Subscribe to Firestore in real time (Contacts)
      subscribeToContacts: () => {
        const contactsCollection = collection(db, "contacts");
        return onSnapshot(contactsCollection, (snapshot) => {
          const updatedContacts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ contacts: updatedContacts });
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
