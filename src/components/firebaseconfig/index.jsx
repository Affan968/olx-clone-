// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore,collection,addDoc } from "firebase/firestore";

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
  appId: "1:356212896262:web:428ec85f8378da95244987",
  measurementId: "G-WR6GCH0HWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export{
    collection,
    addDoc,
    db
}