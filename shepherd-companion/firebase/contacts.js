import {
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "./config";

export async function saveContact(contactData) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be logged in to add contacts");
    }

    const now = serverTimestamp();
    const nowDate = new Date();

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
      labels: [],
      status: "New",
      activities: [
        {
          text: `${contactData.name} was added by ${userName}`,
          timestamp: nowDate.toISOString(),
          userId: user.uid,
        },
      ],
      assignedTo: null,
      source: contactData.source || "Other",
      createdAt: now,
      updatedAt: now,
      createdBy: user.uid,
    };

    // Add the contact to Firestore
    const docRef = await addDoc(collection(db, "contacts"), contactToSave);

    // ✅ Update the document with its Firestore ID
    await updateDoc(doc(db, "contacts", docRef.id), {
      id: docRef.id,
    });

    return {
      id: docRef.id,
      ...contactToSave,
    };
  } catch (error) {
    console.error("Error saving contact:", error);
    throw error;
  }
}

export async function addComment(contactId, commentText) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be logged in to add comments");
    }

    // Get current timestamp
    const now = new Date().toISOString();

    // Get user profile for activity log
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userName = userDoc.exists()
      ? userDoc.data().displayName || user.email
      : user.email;

    // Create comment object
    const comment = {
      text: commentText,
      timestamp: now,
      userId: user.uid,
      userName: userName,
      type: "comment"
    };

    // Add comment to the activities array in Firestore
    const contactRef = doc(db, "contacts", contactId);
    await updateDoc(contactRef, {
      activities: arrayUnion(comment),
      updatedAt: serverTimestamp(),
    });

    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

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

    for (const contact of contacts) {
      try {
        const now = serverTimestamp();
        const activities = contact.activities || [];
        if (activities.length > 0) {
          activities[0].timestamp = now;
        }

        const contactToSave = {
          ...contact,
          activities,
          createdAt: now,
          updatedAt: now,
          createdBy: user.uid,
        };

        // Add the contact to Firestore
        const docRef = await addDoc(collection(db, "contacts"), contactToSave);

        // ✅ Update the document with its Firestore ID
        await updateDoc(doc(db, "contacts", docRef.id), {
          id: docRef.id,
        });

        results.push({
          id: docRef.id,
          ...contactToSave,
        });
      } catch (err) {
        console.error("Error syncing contact:", err);
        errors.push({ contact, error: err.message });
      }
    }

    return { successful: results, failed: errors };
  } catch (error) {
    console.error("Error in batch sync:", error);
    throw error;
  }
}
