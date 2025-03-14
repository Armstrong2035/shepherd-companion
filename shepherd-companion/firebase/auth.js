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
} from "firebase/firestore";
import { auth, db } from "./config";

// Verify pre-registration
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

// Handle user document creation/update
export async function createUserDocument(user, role) {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    displayName: user.displayName || user.email.split("@")[0],
    photoURL: user.photoURL || null,
    role: role,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  });
}

// Update pre-registration status
export async function updatePreRegistration(preRegId, userId) {
  await setDoc(
    doc(db, "preRegisteredUsers", preRegId),
    {
      userId: userId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// Register with email and password
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
  await createUserDocument(userCredential.user, preRegData.role);

  // Update pre-registration status
  await updatePreRegistration(preRegId, userCredential.user.uid);

  return userCredential;
}

// Sign in with email and password
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

// Sign in with Google
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Check if this is first login (registration)
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    // First time login - treat as registration
    const { preRegData, preRegId } = await checkPreRegistration(user.email);

    // Create user document with correct role
    await createUserDocument(user, preRegData.role);

    // Update pre-registration status
    await updatePreRegistration(preRegId, user.uid);
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

// Sign out
export async function logout() {
  return await firebaseSignOut(auth);
}

// Format Firebase auth errors for display
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
