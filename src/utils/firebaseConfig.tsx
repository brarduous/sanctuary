// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get} from "firebase/database";
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
    return await set(ref(db, "sermons/" + user.uid + "/" + crypto.randomUUID()), sermon);

  } else {
    console.error("User not authenticated");
    return null;
  }
}
export const getSermons = async () => {
  const user = getAuth(app).currentUser;
  if (user) {
    const userId = user.uid;
    const dbRef = ref(db);
    return await get(child(dbRef, `sermons/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Sermons: ", data);
        // Convert the object to an array if needed
        const sermonsArray = Object.keys(data).map((key) => {
          return { id: key, ...data[key] };
        }
        );
        return sermonsArray;
      } else {
        console.log("No data available");
      }
    }
    ).catch((error) => {  
      console.error("Error getting data: ", error);
    }
    );
  } else {
    console.error("User not authenticated");
  }
} 
export async function getSermonById(sermonId: string) {
  const user = getAuth(app).currentUser;
  if (user) {
    const userId = user.uid;
    const dbRef = ref(db);
    return await get(child(dbRef, `sermons/${userId}/${sermonId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Sermon: ", data);
        return data;
      } else {
        console.log("No data available");
      }
    }
    ).catch((error) => {  
      console.error("Error getting data: ", error);
    }
    );
  } else {
    console.error("User not authenticated");
  }
}