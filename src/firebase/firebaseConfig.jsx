

// src/firebase/firebaseConfig.jsx

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCZNX3TQUIenlbUGn8xQZwDDsnvZcw37V8",
  authDomain: "final-toll.firebaseapp.com",
  projectId: "final-toll",
  storageBucket: "final-toll.firebasestorage.app",
  messagingSenderId: "469299343647",
  appId: "1:469299343647:web:74a9d4b187853464ae402a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
