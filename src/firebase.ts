// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
