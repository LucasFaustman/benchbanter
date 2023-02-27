import type { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs' //create supabase client that we can use throughout our application
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react' //allows us to hold supabase client within react state
import { NextUIProvider } from '@nextui-org/react'
//Provider (providing supabase, nextui provider)
import { Box } from '../components/box'
//Navbar
import NavbarComponent from '../components/navbar/NavbarComponent'
//Box component for content


export default function App({ Component, pageProps }: AppProps) {
 const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <SessionContextProvider supabaseClient={supabaseClient}> 
      {/* allows our entire app constantly see the supabase sessuin */}
      <NextUIProvider>
        <NavbarComponent />
        {/* <Box css={{ px: "$12", py: "$15", mt: "$12", "@xsMax": {px: "$10"}, maxWidth: "800px", margin: "0 auto" }}> */}
          <Component {...pageProps} />
        {/* </Box> */}
      </NextUIProvider>
  </SessionContextProvider>
  
  )
}
