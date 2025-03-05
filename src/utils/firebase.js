// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHucpSr7x0c2u-cuGClcLwyk5mGcgq-Q8",
  authDomain: "netflixgpt-b9d89.firebaseapp.com",
  projectId: "netflixgpt-b9d89",
  storageBucket: "netflixgpt-b9d89.firebasestorage.app",
  messagingSenderId: "444080597792",
  appId: "1:444080597792:web:dcb4649e633000d975c545",
  measurementId: "G-N8KWS6TC4Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
