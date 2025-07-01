// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcg3Ub2PsVUm5mFgucVndqheIP7KA-PUk",
  authDomain: "roomfund-4cf22.firebaseapp.com",
  projectId: "roomfund-4cf22",
  storageBucket: "roomfund-4cf22.appspot.com", // (fixed typo: added .com)
  messagingSenderId: "661967014609",
  appId: "1:661967014609:web:306c97374edd5acb23d3f0",
  measurementId: "G-W0MHDXHDQ5"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
