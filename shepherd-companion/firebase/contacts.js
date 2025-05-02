import {
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  arrayUnion,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./config.js";

// Helper function to get the current user ID
const getUserId = () => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not authenticated");
  return currentUser.uid; // Fixed: using uid instead of userId
};

// Helper function to get the active workspace ID
const userWorkspace = async () => {
  const userId = getUserId();
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }
  const userData = userDoc.data();
  console.log("userData", userData);
  return userData.workspaces[0].workspaceId;
};

// Fix references to getActiveWorkspaceId in other functions
export async function saveContact(contactData) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be logged in to add contacts");
    }

    // Get the active workspace ID
    const workspaceId = await userWorkspace(); // Fixed: added await
    if (!workspaceId) {
      throw new Error("No active workspace selected");
    }

    console.log("workspaceId", workspaceId);

    const now = serverTimestamp();
    const nowDate = new Date();

    // Get user profile for activity log
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userName = userDoc.exists()
      ? userDoc.data().displayName || user.email
      : user.email;

    // Create the contact document with workspace ID
    const contactToSave = {
      name: contactData.name,
      location: contactData.location || null,
      phone: contactData.phone,
      whatsApp: contactData.isWhatsApp
        ? contactData.phone
        : contactData.whatsAppNumber || null,
      email: contactData.email || null,
      notes: contactData.notes || null,
      labelIds: [], // Changed from labels to labelIds for consistency
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
      workspaceId: workspaceId, // Add the workspace ID
      createdAt: now,
      updatedAt: now,
      createdBy: user.uid,
    };

    // Add the contact to Firestore
    const docRef = await addDoc(collection(db, "contacts"), contactToSave);

    // Update the document with its Firestore ID
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

    // Get the active workspace ID
    const workspaceId = userWorkspace();
    if (!workspaceId) {
      throw new Error("No active workspace selected");
    }

    // First verify the contact belongs to the user's active workspace
    const contactSnap = await getDoc(doc(db, "contacts", contactId));
    if (!contactSnap.exists()) {
      throw new Error("Contact not found");
    }

    const contactData = contactSnap.data();
    if (contactData.workspaceId !== workspaceId) {
      throw new Error("You don't have permission to comment on this contact");
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
      type: "comment",
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

export function subscribeToContact(contactId, callback) {
  if (!contactId) {
    console.error("Contact ID is required for subscription");
    return () => {}; // Return empty unsubscribe function
  }

  const workspaceId = userWorkspace();
  if (!workspaceId) {
    console.error("No active workspace selected");
    return () => {};
  }

  const contactRef = doc(db, "contacts", contactId);
  console.log(`Setting up listener for contact: ${contactId}`);

  return onSnapshot(
    contactRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const contactData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };

        // Verify the contact belongs to the active workspace
        if (contactData.workspaceId === workspaceId) {
          callback(contactData);
        } else {
          console.log(
            `Contact ${contactId} does not belong to the active workspace`
          );
          callback(null);
        }
      } else {
        console.log(`Contact ${contactId} does not exist`);
        callback(null);
      }
    },
    (error) => {
      console.error("Error listening to contact:", error);
    }
  );
}

export function subscribeToWorkspaceContacts(callback) {
  const workspaceId = userWorkspace();
  if (!workspaceId) {
    console.error("No active workspace selected");
    return () => {};
  }

  const contactsQuery = query(
    collection(db, "contacts"),
    where("workspaceId", "==", workspaceId)
  );

  console.log(`Setting up listener for workspace contacts: ${workspaceId}`);

  return onSnapshot(
    contactsQuery,
    (querySnapshot) => {
      const contacts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(contacts);
    },
    (error) => {
      console.error("Error listening to workspace contacts:", error);
    }
  );
}

export async function syncContacts(contacts) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be logged in to sync contacts");
    }

    // Get the active workspace ID
    const workspaceId = userWorkspace();
    if (!workspaceId) {
      throw new Error("No active workspace selected");
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
          workspaceId: workspaceId, // Add workspace ID to each synced contact
          labelIds: contact.labels || [], // Convert labels to labelIds if present
          activities,
          createdAt: now,
          updatedAt: now,
          createdBy: user.uid,
        };

        // Remove the old labels field if it exists
        if (contactToSave.labels) {
          delete contactToSave.labels;
        }

        // Add the contact to Firestore
        const docRef = await addDoc(collection(db, "contacts"), contactToSave);

        // Update the document with its Firestore ID
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
