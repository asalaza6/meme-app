import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { wrapper } from '../store';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
(toast as any).configure();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default wrapper.withRedux(App);
