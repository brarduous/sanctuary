import "@/styles/globals.css";
import sanctuaryTheme from "@/styles/sanctuaryTheme";
import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={sanctuaryTheme}>

    <Component {...pageProps} />
    </ThemeProvider>
  )
  
  
  ;
}
