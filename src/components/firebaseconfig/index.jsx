// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,    // ✅ Added for fetching multiple docs
  query,      // ✅ Added for category filtering
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  increment,
  limit        // ✅ Added for specific conditions
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut, RecaptchaVerifier, signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBM-oD81V9HIAGrRiLCQGh8lPP-UmuaidI",
  authDomain: "chataap-5522c.firebaseapp.com",
  projectId: "chataap-5522c",
  storageBucket: "chataap-5522c.firebasestorage.app",
  messagingSenderId: "356212896262",
  appId: "1:356212896262:web:a1402be74bfa529a244987",
  measurementId: "G-31694W1BQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Exporting everything correctly
export {
  db,
  auth,
  collection,
  addDoc,
  getDoc,
  getDocs,    // Category filtering ke liye zaroori hai
  query,      // Category filtering ke liye zaroori hai
  where,      // Category filtering ke liye zaroori hai
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut, RecaptchaVerifier, signInWithPhoneNumber, orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  increment,
  limit
};