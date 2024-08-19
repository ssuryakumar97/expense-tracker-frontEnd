// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9GTA6nJCpgpTG53SaxtCXn3OpGXCD_2k",
  authDomain: "expense-tracker-99934.firebaseapp.com",
  projectId: "expense-tracker-99934",
  storageBucket: "expense-tracker-99934.appspot.com",
  messagingSenderId: "996483644861",
  appId: "1:996483644861:web:77e538e81606651ac8a6d4",
  measurementId: "G-9P22619RG3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
