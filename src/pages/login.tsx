// filepath: /Users/brandon/Documents/GitHub/sanctuary/sanctuary/src/pages/login.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log(user);
      if (user) {
        router.push('/'); // Redirect to home if already logged in
      }
    };
    checkUser();
  }, [router]);

  const signInWithGoogle = async (credential:any) => {
    supabase.auth.signInWithIdToken({ provider:'google', token: credential }).then((e) => {
      console.log(e);
      const { user, session } = e.data;
      if (!user) {
        console.error("Error signing in with Google: ");
        return;
      }
      const token = session?.access_token;
      console.log(token);
      localStorage.setItem("accessToken", token || "");
      localStorage.setItem("refreshToken", session?.refresh_token || "");
      localStorage.setItem("user", JSON.stringify(user));
      console.log(user);
      if (user) {
        router.push('/'); // Redirect to home if already logged in
      }
    });
      
     

  
    
  }
    
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <GoogleLogin
  onSuccess={credentialResponse => {
    signInWithGoogle(credentialResponse.credential);
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
    </div>
  );
}