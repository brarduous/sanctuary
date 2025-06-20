import "@/styles/globals.css";
import sanctuaryTheme from "@/styles/sanctuaryTheme";
import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={sanctuaryTheme}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>

    <Component {...pageProps} />
      
        </GoogleOAuthProvider>
    </ThemeProvider>
  )
  
  
  ;
}
