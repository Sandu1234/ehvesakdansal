// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7woY5TQKLOdDaN9s6ZPsdMON3FVi80m0",
  authDomain: "elephant-house-vesak-daniel.firebaseapp.com",
  projectId: "elephant-house-vesak-daniel",
  storageBucket: "elephant-house-vesak-daniel.appspot.com", // FIXED: .app -> .app**spot**
  messagingSenderId: "62429575375",
  appId: "1:62429575375:web:0c17e7371f69710e16dfba"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
