import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCpurV4hAQVpdTnshTz_Q2Tfs6y-N3-ZU",
  authDomain: "expense-tracker-management.firebaseapp.com",
  projectId: "expense-tracker-management",
  storageBucket: "expense-tracker-management.appspot.com",
  messagingSenderId: "775278203000",
  appId: "1:775278203000:web:efc42a965b83fca1eadd8d",
  measurementId: "G-BKP8BLFHGJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
