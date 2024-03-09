// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfy_U_pIyXnOnmY8G4THBvGubWrznNGH0",
  authDomain: "expense-tracker-70e15.firebaseapp.com",
  projectId: "expense-tracker-70e15",
  storageBucket: "expense-tracker-70e15.appspot.com",
  messagingSenderId: "670097043078",
  appId: "1:670097043078:web:ee70a48f107ae000976b07",
  measurementId: "G-4RNB661QDD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
