
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore,collection,addDoc,getDoc } from "firebase/firestore";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged, signOut} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export{
    collection,
    addDoc,
    db,
    getDoc,
    getAuth,
    createUserWithEmailAndPassword,
    auth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
     signOut
}