// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSUnzA9ycsRWDFYN39-LEFa_Q9h4LsjjI",
  authDomain: "chat-60c41.firebaseapp.com",
  projectId: "chat-60c41",
  storageBucket: "chat-60c41.firebasestorage.app",
  messagingSenderId: "443592595679",
  appId: "1:443592595679:web:ca08c939e176ab8e16b16a",
  measurementId: "G-PDDJBLS34R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider(); 
