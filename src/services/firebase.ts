// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDjn3hGxS7h9QZhXDLp1BYf_dQGFk5Oc78",
  authDomain: "todoapp-322ab.firebaseapp.com",
  projectId: "todoapp-322ab",
  storageBucket: "todoapp-322ab.firebasestorage.app",
  messagingSenderId: "163980214070",
  appId: "1:163980214070:web:29e6920a189fa2a60dfd97",
  measurementId: "G-VRX0RCJKRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);