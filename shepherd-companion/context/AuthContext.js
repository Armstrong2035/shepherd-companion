"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import {
  signInWithEmail,
  signInWithGoogle,
  registerWithEmail,
  signOut,
  formatAuthError,
} from "../firebase/auth-simplified";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Fetch user profile data
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Continue anyway - don't block the UI
          setUserProfile({
            displayName: user.displayName || user.email.split("@")[0],
            email: user.email,
            photoURL: user.photoURL,
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError("");
    try {
      await signInWithEmail(email, password);
      return true;
    } catch (error) {
      setAuthError(formatAuthError(error.code) || error.message);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    setAuthError("");
    try {
      await signInWithGoogle();
      return true;
    } catch (error) {
      setAuthError(formatAuthError(error.code) || error.message);
      return false;
    }
  };

  const register = async (email, password) => {
    setAuthError("");
    try {
      await registerWithEmail(email, password);
      return true;
    } catch (error) {
      setAuthError(formatAuthError(error.code) || error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  const clearError = () => {
    setAuthError("");
  };

  const value = {
    user,
    userProfile,
    loading,
    authError,
    login,
    loginWithGoogle,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
