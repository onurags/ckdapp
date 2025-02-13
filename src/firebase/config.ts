import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6FehGRaFjNp-4g5hKXqdnfeASXwV6Dwc",
  authDomain: "kidney-analysis-app.firebaseapp.com",
  projectId: "kidney-analysis-app",
  storageBucket: "kidney-analysis-app.firebasestorage.app",
  messagingSenderId: "870418928936",
  appId: "1:870418928936:web:909974fff23e1ca85cec1d",
  measurementId: "G-94PQT6YS11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
// Initialize Firestore
export const db = getFirestore(app);

export default app;