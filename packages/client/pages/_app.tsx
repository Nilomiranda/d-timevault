import '../styles/globals.css'
import 'react-quill/dist/quill.snow.css';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.scss'
import { ChakraProvider } from '@chakra-ui/react'
import Head from "next/head";


function MyApp({ Component, pageProps }) {
  return (
      <>
        <Head>
          <title>Time vault</title>
          <meta charSet="utf-8"/>
        </Head>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </>
  )
}

export default MyApp
