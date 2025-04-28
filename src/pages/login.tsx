// filepath: /Users/brandon/Documents/GitHub/sanctuary/sanctuary/src/pages/login.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { doc, setDoc } from "firebase/firestore"; 

import { getAnalytics } from "firebase/analytics";
import {getAuth, getRedirectResult, signInWithPopup, signInWithRedirect} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

import { app, db, auth, provider, firestore } from "@/utils/firebaseConfig"; // Ensure this path points to your Firebase configuration file





export default function Login() {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {
      const user =  getAuth(app).currentUser;
      console.log(user);
      if (user) {
        router.push('/'); // Redirect to home if already logged in
      }
    };
    checkUser();
  }, [router, auth]);

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider).then((result) => {
      console.log(result);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        name: user.displayName,
        profilePicture: user.photoURL,
        givenName: user.displayName?.split(" ")[0],
        familyName: user.displayName?.split(" ")[1],   
      }); 

    set(ref(db, "users/" + user.uid), {
      email: user.email,
      name: user.displayName,
      profilePicture: user.photoURL,
      givenName: user.displayName?.split(" ")[0],
      familyName: user.displayName?.split(" ")[1],   
    });
   
      localStorage.setItem("user", JSON.stringify({accessToken: token, email: user.email, name: user.displayName, givenName: user.displayName?.split(" ")[0], familyName: user.displayName?.split(" ")[1]}));
      if (user) {
        router.push('/'); // Redirect to home if already logged in
      }
    });
    
  }
    
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button onClick={signInWithGoogle} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Sign in with Google
      </button>
    </div>
  );
}