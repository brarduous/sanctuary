// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { doc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {getAuth, getRedirectResult, signInWithPopup, signInWithRedirect} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2YnSA-9YigxvfryLYG6teqg_L46JcAR8",
  authDomain: "glory-app-cf113.firebaseapp.com",
  projectId: "glory-app-cf113",
  storageBucket: "glory-app-cf113.appspot.com",
  messagingSenderId: "618700854180",
  appId: "1:618700854180:web:72cefa65b046ae2da4a731",
  measurementId: "G-T0TKTGQ6PB",
  databaseURL: "https://glory-app-cf113-default-rtdb.firebaseio.com"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

//create Sermon type
export type Sermon = {
  scripture: string;
  title: string;
  sermon_outline: string;
  key_takeaways: string;
  sermon_body: string;
  illustration?: string;

};

export const saveSermon = async (sermon:Sermon) => {
  const user = getAuth(app).currentUser;
  if (user) {
    const userId = user.uid;
    // setDoc(doc(firestore, "users", user.uid), sermon).then((e) => {
    //     console.log("Sermon saved successfully", e);
    // });
    set(ref(db, "sermons/" + user.uid + "/" + crypto.randomUUID()), sermon).then((e) => {
      console.log("Sermon saved successfully", e);
    });

  } else {
    console.error("User not authenticated");
  }
}