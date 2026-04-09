// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiWQqd93gXBHMtuWYKJLIT3gXDx4N6V04",
  authDomain: "sparkboard-web.firebaseapp.com",
  projectId: "sparkboard-web",
  storageBucket: "sparkboard-web.firebasestorage.app",
  messagingSenderId: "702010096189",
  appId: "1:702010096189:web:03d5dd9958b73fd47c8854",
  measurementId: "G-8RV088X04X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
