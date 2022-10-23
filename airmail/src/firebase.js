// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAa0s1nQB3m0iPdwU3vnkfBgNbN6Vf8M6Q",
  authDomain: "air-mail-29adb.firebaseapp.com",
  projectId: "air-mail-29adb",
  storageBucket: "air-mail-29adb.appspot.com",
  messagingSenderId: "249691319449",
  appId: "1:249691319449:web:67d26a94cf8caf2cccdc08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();