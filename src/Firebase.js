import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB38dn2a8NK9XrMJewlxqnEbcDHYB9FQQ0",
  authDomain: "moodmart-66.firebaseapp.com",
  projectId: "moodmart-66",
  storageBucket: "moodmart-66.firebasestorage.app",
  messagingSenderId: "804296045171",
  appId: "1:804296045171:web:09423faec26101b0f03006",
  measurementId: "G-JLSBB1T8RV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();

// For backward compatibility
export { app };

