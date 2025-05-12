import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDc9qmZkgmfMHRWxszDIWIW2-OiAcaqzB4",
  authDomain: "xolisawebsite.firebaseapp.com",
  projectId: "xolisawebsite",
  storageBucket: "xolisawebsite.firebasestorage.app",
  messagingSenderId: "1027994947633",
  appId: "1:1027994947633:web:2f630668c259cac8330510",
  measurementId: "G-JHZBFR4R52"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

