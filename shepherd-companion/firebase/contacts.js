// lib/contacts.js
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./config";

// Save a contact to Firestore
// In your saveContact function
export async function saveContact(contactData) {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("You must be logged in to add contacts");
    }

    // Create timestamps
    const now = serverTimestamp(); // This is for top-level timestamps
    const nowDate = new Date(); // Use regular Date for arrays

    // Get user profile for activity log
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userName = userDoc.exists()
      ? userDoc.data().displayName || user.email
      : user.email;

    // Create the contact document
    const contactToSave = {
      name: contactData.name,
      location: contactData.location || null,
      phone: contactData.phone,
      whatsApp: contactData.isWhatsApp
        ? contactData.phone
        : contactData.whatsAppNumber || null,
      email: contactData.email || null,
      notes: contactData.notes || null,
      labels: [], // Empty array for label IDs
      status: "New",
      activities: [
        {
          text: `${contactData.name} was added by ${userName}`,
          timestamp: nowDate.toISOString(), // Use ISO string for arrays
          userId: user.uid,
        },
      ],
      assignedTo: null, // Null by default
      source: contactData.source || "Other",
      createdAt: now, // Use serverTimestamp for top-level fields
      updatedAt: now, // Use serverTimestamp for top-level fields
      createdBy: user.uid,
    };

    // Add the contact to Firestore
    const docRef = await addDoc(collection(db, "contacts"), contactToSave);

    return {
      id: docRef.id,
      ...contactToSave,
    };
  } catch (error) {
    console.error("Error saving contact:", error);
    throw error;
  }
}

// Sync multiple contacts to Firestore (for offline support)
export async function syncContacts(contacts) {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("You must be logged in to sync contacts");
    }

    const results = [];
    const errors = [];

    // Get user profile for activity log
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userName = userDoc.exists()
      ? userDoc.data().displayName || user.email
      : user.email;

    // Process each contact
    for (const contact of contacts) {
      try {
        // Create a proper timestamp
        const now = serverTimestamp();

        // Update the timestamp in the activities
        const activities = contact.activities || [];
        if (activities.length > 0) {
          activities[0].timestamp = now;
        }

        // Prepare contact with proper timestamps
        const contactToSave = {
          ...contact,
          activities: activities,
          createdAt: now,
          updatedAt: now,
          createdBy: user.uid,
        };

        // Add the contact to Firestore
        const docRef = await addDoc(collection(db, "contacts"), contactToSave);

        results.push({
          id: docRef.id,
          ...contactToSave,
        });
      } catch (err) {
        console.error("Error syncing contact:", err);
        errors.push({
          contact,
          error: err.message,
        });
      }
    }

    return {
      successful: results,
      failed: errors,
    };
  } catch (error) {
    console.error("Error in batch sync:", error);
    throw error;
  }
}

// Get all labels
export async function getLabels() {
  try {
    const labelsSnapshot = await getDocs(collection(db, "labels"));
    const labels = [];

    labelsSnapshot.forEach((doc) => {
      labels.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return labels;
  } catch (error) {
    console.error("Error getting labels:", error);
    throw error;
  }
}
