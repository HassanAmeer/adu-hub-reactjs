import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAbIllVWicHce3mHRz9zhRYIq4AIi-mMgU",
    authDomain: "adu-hub.firebaseapp.com",
    projectId: "adu-hub",
    storageBucket: "adu-hub.firebasestorage.app",
    messagingSenderId: "8408551042",
    appId: "1:8408551042:web:921f1237a599aef1aa6e9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
