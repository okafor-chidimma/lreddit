import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { createClient,Provider } from "urql";

import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";

import theme from "../theme";
//setting up urql
const client = createClient({
  url: "http://localhost:4000/graphql",
  //to include credential when sending requests to the db
  fetchOptions: {
    credentials: "include",
  },
});
// this file initializes all the component in the pages folder
function MyApp({ Component, pageProps }:any) {
  return (
    //adding the client to your app
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Container height="100vh">
            <Component {...pageProps} />
            <DarkModeSwitch />
          </Container>
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
