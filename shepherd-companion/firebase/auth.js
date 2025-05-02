// lib/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth } from "./config";
import { db } from "./config";

/**
 * Verify pre-registration status
 * @param {string} email - User's email
 * @returns {Promise<Object>} - Pre-registration data
 */
export async function checkPreRegistration(email) {
  const preRegQuery = query(
    collection(db, "preRegisteredUsers"),
    where("email", "==", email),
    where("status", "==", "active")
  );

  const snapshot = await getDocs(preRegQuery);

  if (snapshot.empty) {
    throw new Error(
      "You need to be invited to register. Please contact your administrator."
    );
  }

  return {
    preRegData: snapshot.docs[0].data(),
    preRegId: snapshot.docs[0].id,
  };
}

/**
 * Create or update user document in Firestore
 * @param {Object} user - Firebase Auth user object
 * @param {string} role - User role
 * @param {string} workspaceId - Workspace ID
 */
export async function createOrUpdateUserDocument(user, role, workspaceId) {
  await setDoc(
    doc(db, "users", user.uid),
    {
      email: user.email,
      displayName: user.displayName || user.email.split("@")[0],
      photoURL: user.photoURL || null,
      role: role,
      workspaces: [
        {
          workspaceId: workspaceId,
          role: role,
        },
      ],
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Update pre-registration status
 * @param {string} preRegId - Pre-registration document ID
 * @param {string} userId - Firebase Auth UID
 */
export async function updatePreRegistrationStatus(preRegId, userId) {
  await updateDoc(doc(db, "preRegisteredUsers", preRegId), {
    status: "registered",
    userId: userId,
    updatedAt: serverTimestamp(),
  });

  // Also check if there's a matching invitation to update
  const invitationQuery = query(
    collection(db, "invitations"),
    where("email", "==", auth.currentUser.email),
    where("status", "==", "pending")
  );

  const invitationSnapshot = await getDocs(invitationQuery);

  if (!invitationSnapshot.empty) {
    const invitationDoc = invitationSnapshot.docs[0];
    await updateDoc(invitationDoc.ref, {
      status: "accepted",
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: userId,
    });
  }
}

/**
 * Register with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User credential
 */
export async function register(email, password) {
  // Check pre-registration first
  const { preRegData, preRegId } = await checkPreRegistration(email);

  // Create the user account
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Create user document with correct role
  await createOrUpdateUserDocument(
    userCredential.user,
    preRegData.role,
    preRegData.workspaceId
  );

  // Update pre-registration status
  await updatePreRegistrationStatus(preRegId, userCredential.user.uid);

  return userCredential;
}

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User credential
 */
export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Update last login time
  await setDoc(
    doc(db, "users", userCredential.user.uid),
    {
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );

  return userCredential;
}

/**
 * Sign in with Google
 * @returns {Promise<Object>} - User credential
 */
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Check if this is first login (registration)
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    // First time login - treat as registration
    try {
      const { preRegData, preRegId } = await checkPreRegistration(user.email);

      // Create user document with correct role
      await createOrUpdateUserDocument(
        user,
        preRegData.role,
        preRegData.workspaceId
      );

      // Update pre-registration status
      await updatePreRegistrationStatus(preRegId, user.uid);
    } catch (error) {
      // If not pre-registered, sign out and throw error
      await firebaseSignOut(auth);
      throw new Error(
        "You need to be invited to register. Please contact your administrator."
      );
    }
  } else {
    // Just update last login time
    await setDoc(
      doc(db, "users", user.uid),
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return userCredential;
}

/**
 * Sign out
 * @returns {Promise<void>}
 */
export async function logout() {
  return await firebaseSignOut(auth);
}

/**
 * Format Firebase auth errors for display
 * @param {string} errorCode - Firebase error code
 * @returns {string} - User-friendly error message
 */
export function formatAuthError(errorCode) {
  const errorMap = {
    "auth/user-not-found": "No account found with this email address",
    "auth/wrong-password": "Incorrect password",
    "auth/invalid-email": "Invalid email address format",
    "auth/weak-password": "Password is too weak",
    "auth/email-already-in-use": "This email is already registered",
    "auth/popup-closed-by-user": "Sign in was canceled",
    "auth/operation-not-allowed": "This sign-in method is not allowed",
    "auth/invalid-credential": "The credential is malformed or expired",
  };

  return errorMap[errorCode] || "An error occurred during authentication";
}
