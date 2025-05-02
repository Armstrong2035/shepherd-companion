// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOtUlVO4ZulgoGg5uH1eblgF8-NW2Psig",
  authDomain: "shepherd-crm.firebaseapp.com",
  projectId: "shepherd-crm",
  storageBucket: "shepherd-crm.firebasestorage.app",
  messagingSenderId: "655280184931",
  appId: "1:655280184931:web:8cd16daea2746c86972256",
  measurementId: "G-MTE5WF3Y0R",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
