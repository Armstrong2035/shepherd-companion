// firebase/auth-simplified.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

/**
 * Sign in with email and password - simplified version
 */
export const signInWithEmail = async (email, password) => {
  try {
    // Simple sign in without any checks
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update last login
    try {
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.log("Error updating last login - ignoring", error);
    }

    return userCredential;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

/**
 * Register a new user - simplified version
 */
export const registerWithEmail = async (email, password) => {
  try {
    // Create user with Firebase Authentication - no pre-registration check
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create basic user document
    try {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        displayName: email.split("@")[0],
        createdAt: serverTimestamp(),
        role: "user",
      });
    } catch (error) {
      console.log("Error creating user document - ignoring", error);
    }

    return userCredential;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Sign in with Google - simplified version
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Create or update user document
    try {
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          email: userCredential.user.email,
          displayName:
            userCredential.user.displayName ||
            userCredential.user.email.split("@")[0],
          photoURL: userCredential.user.photoURL,
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.log("Error updating user document - ignoring", error);
    }

    return userCredential;
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

/**
 * Format Firebase auth error messages
 */
export const formatAuthError = (errorCode) => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/invalid-email":
      return "Invalid email address format";
    case "auth/weak-password":
      return "Password is too weak";
    case "auth/email-already-in-use":
      return "This email is already registered";
    case "auth/popup-closed-by-user":
      return "Sign in was canceled";
    default:
      return "An error occurred during authentication";
  }
};

export default auth;
