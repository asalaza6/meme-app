import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { wrapper } from '../store';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
(toast as any).configure();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Head>
        <link rel="shortcut icon" href="/static/logo.svg" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default wrapper.withRedux(App);
