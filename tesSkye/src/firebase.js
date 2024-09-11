import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-S7aGjjSMc9X74RVcDOJJ4SLdOhX4Qsc",
  authDomain: "belajar-4db67.firebaseapp.com",
  projectId: "belajar-4db67",
  storageBucket: "belajar-4db67.appspot.com",
  messagingSenderId: "1036567061674",
  appId: "1:1036567061674:web:e59acab384b9dc2a5c1cd3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
